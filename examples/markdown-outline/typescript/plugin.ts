#!/usr/bin/env node
// Markdown Outline: a live outline panel and table of contents for Red.
// Runs with Node.js 22.18 or later, which strips the types when loading it.
import { createInterface } from "node:readline";

// --- Protocol types used by this plugin ---

type Params = Record<string, unknown>;
type Message = {
  jsonrpc: "2.0";
  id?: string | number;
  method?: string;
  params?: any;
  result?: any;
  error?: { code: number; message: string };
};
type Snapshot = {
  path: string | null;
  revision: string;
  text: string;
  document_id: string;
};
type Heading = { level: number; title: string; line: number };
type Settings = { max_depth?: number; auto_open?: boolean };

// --- Talking to Red ---
// One JSON message per line. stdout carries only protocol messages, so logs
// go to stderr.

const send = (message: Params) =>
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}\n`);
const log = (...args: unknown[]) =>
  console.error("[markdown-outline]", ...args);

class HostError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

let nextRequest = 1;
const waiting = new Map<
  string,
  { resolve: (value: any) => void; reject: (error: Error) => void }
>();

function callHost<T = null>(method: string, params: Params = {}): Promise<T> {
  const id = `outline-${nextRequest++}`;
  send({ id, method, params });
  return new Promise((resolve, reject) => waiting.set(id, { resolve, reject }));
}

// Handlers run one at a time. Responses are delivered as soon as they arrive,
// so a handler can await a host call without blocking the message loop.
let work = Promise.resolve();
function enqueue(task: () => Promise<void>) {
  work = work.then(task).catch((error) => log(error));
}

// --- Markdown ---

function parseHeadings(text: string): Heading[] {
  const headings: Heading[] = [];
  let fence: string | null = null;
  text.split("\n").forEach((raw, line) => {
    const row = raw.replace(/\r$/, "");
    const marker = /^ {0,3}(`{3,}|~{3,})/.exec(row)?.[1];
    if (marker) {
      if (!fence) {
        fence = marker;
      } else if (marker[0] === fence[0] && marker.length >= fence.length) {
        fence = null;
      }
      return;
    }
    const heading =
      !fence && /^ {0,3}(#{1,6})[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/.exec(row);
    if (heading) {
      headings.push({ level: heading[1].length, title: heading[2], line });
    }
  });
  return headings;
}

function slugs(headings: Heading[]): string[] {
  const seen = new Map<string, number>();
  return headings.map(({ title }) => {
    const base = title
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s_-]/gu, "")
      .replace(/\s/g, "-");
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count ? `${base}-${count}` : base;
  });
}

function nestedList(
  headings: Heading[],
  item: (heading: Heading, index: number) => string,
): string {
  const top = Math.min(...headings.map((heading) => heading.level));
  return headings
    .map(
      (heading, index) =>
        `${"  ".repeat(heading.level - top)}- ${item(heading, index)}`,
    )
    .join("\n");
}

// The table of contents leaves out a lone H1, which is the document's title.
function tocEntries(headings: Heading[], depth: number): Heading[] {
  const titled = headings.filter((heading) => heading.level === 1).length === 1;
  return headings.filter(
    (heading) => heading.level <= depth && !(titled && heading.level === 1),
  );
}

function tableOfContents(headings: Heading[], depth: number): string {
  const anchors = new Map(
    headings.map((heading, index) => [heading, slugs(headings)[index]]),
  );
  const entries = tocEntries(headings, depth);
  return entries.length
    ? nestedList(
        entries,
        (heading) => `[${heading.title}](#${anchors.get(heading)})`,
      )
    : "";
}

// --- Plugin state ---

const PANEL = "outline";
let following: string | null = null; // document ID the panel follows
let lastToc: { documentId: string; transactionId: string } | null = null;
let settings: Settings = {};
let depth = 3;

const isMarkdown = (path: string | null) =>
  !!path && /\.(md|markdown)$/i.test(path);

function panelActions(): Params[] {
  return [
    {
      id: "toc",
      label: "TOC",
      key: "r",
      description: "Write or refresh the table of contents",
    },
    {
      id: "copy",
      label: "Copy",
      key: "c",
      description: "Copy the table of contents",
    },
    {
      id: "undo",
      label: "Undo",
      key: "u",
      description: "Undo the last table of contents change",
      enabled: lastToc !== null,
    },
    { id: "close", label: "Close", compact_label: "x", key: "q" },
  ];
}

async function loadSettings() {
  settings = (await callHost<Settings | null>("red/ConfigGet")) ?? {};
  depth =
    (await callHost<number | null>("red/StorageGet", { key: "depth" })) ??
    settings.max_depth ??
    3;
}

async function snapshot(selector: Params = {}): Promise<Snapshot> {
  return callHost<Snapshot>("red/DocumentSnapshot", {
    ...selector,
    include_document_id: true,
  });
}

// --- The outline panel ---

async function openOutline(selector: Params = {}) {
  const document = await snapshot(selector);
  if (!isMarkdown(document.path)) {
    throw new Error("Outline works on Markdown files (.md or .markdown)");
  }
  if (following !== document.document_id) {
    if (following) {
      await callHost("red/DocumentUnwatch", { document_id: following });
    }
    // Watch before reading, so changes made meanwhile still send an event.
    await callHost("red/DocumentWatch", { document_id: document.document_id });
    following = document.document_id;
  }
  await callHost("red/TextPanelCreate", {
    id: PANEL,
    side: "right",
    width: 40,
    title: "Outline",
    actions: panelActions(),
  });
  await refresh();
}

async function refresh() {
  if (!following) return;
  const document = await snapshot({ document_id: following });
  const headings = parseHeadings(document.text).filter(
    (heading) => heading.level <= depth,
  );
  const words =
    document.text.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ?? 0;
  const text = headings.length
    ? nestedList(headings, (heading) => heading.title)
    : "_No headings yet._";
  await callHost("red/TextPanelSetContent", {
    id: PANEL,
    blocks: [{ id: "outline", format: "markdown", text }],
  });
  const count = words.toLocaleString("en-US");
  await callHost("red/StatuslineSet", {
    text: `§ ${headings.length} headings · ${count} words`,
  });
}

async function closeOutline() {
  if (following) {
    await callHost("red/DocumentUnwatch", { document_id: following });
  }
  following = null;
  // The user may have closed the panel already.
  await callHost("red/TextPanelDispose", { id: PANEL }).catch(() => {});
  await callHost("red/StatuslineClear");
}

// --- The table of contents ---

async function updateToc(selector: Params): Promise<string> {
  const document = await snapshot(selector);
  const headings = parseHeadings(document.text);
  const toc = tableOfContents(headings, depth);
  if (!toc) throw new Error("Add a few ## headings first");
  const first = tocEntries(headings, depth)[0].line;
  const lines = document.text.split(/(?<=\n)/); // keep each line's ending
  const start = lines.findIndex((line) => line.trim() === "<!-- toc -->");
  const stop = lines.findIndex(
    (line, index) => index > start && line.trim() === "<!-- tocstop -->",
  );
  let edit;
  if (start >= 0 && stop > start) {
    // Replace the list between the markers. Red rejects the edit if that
    // text changed after the snapshot.
    edit = {
      range: {
        start: { line: start + 1, character: 0 },
        end: { line: stop, character: 0 },
      },
      text: `${toc}\n`,
      expected_text: lines.slice(start + 1, stop).join(""),
    };
  } else {
    // The first time, insert the markers just before the first section.
    const at = { line: first, character: 0 };
    edit = {
      range: { start: at, end: at },
      text: `<!-- toc -->\n${toc}\n<!-- tocstop -->\n\n`,
      expected_text: "",
    };
  }
  const applied = await callHost<{ transaction_id: string; revision: string }>(
    "red/DocumentApply",
    {
      document_id: document.document_id,
      expected_revision: document.revision,
      // The panel may have focus instead of the document.
      allow_inactive: true,
      label: "Update table of contents",
      edits: [edit],
    },
  );
  lastToc = {
    documentId: document.document_id,
    transactionId: applied.transaction_id,
  };
  if (following) {
    await callHost("red/TextPanelSetActions", {
      id: PANEL,
      actions: panelActions(),
    });
  }
  return "Table of contents updated";
}

async function undoToc(): Promise<string> {
  if (!lastToc) throw new Error("There is no table of contents change to undo");
  // Red only undoes it while it is still the document's latest change.
  await callHost("red/DocumentUndo", {
    document_id: lastToc.documentId,
    transaction_id: lastToc.transactionId,
    allow_inactive: true,
  });
  lastToc = null;
  if (following) {
    await callHost("red/TextPanelSetActions", {
      id: PANEL,
      actions: panelActions(),
    });
  }
  return "Table of contents change undone";
}

async function copyToc() {
  const document = await snapshot({ document_id: following });
  await callHost("red/ClipboardWrite", {
    text: `${tableOfContents(parseHeadings(document.text), depth)}\n`,
  });
  await callHost("red/MessageShow", {
    message: "Table of contents copied",
    severity: "success",
  });
}

// --- Commands, events, and notifications ---

const command = (name: string, title: string) => ({
  name,
  metadata: { title, category: "Markdown" },
});

const commands = [
  command("Outline", "Show the Markdown outline"),
  command("OutlineToc", "Write or refresh the table of contents"),
  command("OutlineDepth", "Choose the outline depth"),
];

async function runCommand(name: string): Promise<string | null> {
  if (name === "Outline") {
    await openOutline();
    return null;
  }
  if (name === "OutlineToc") return updateToc({});
  if (name === "OutlineDepth") {
    const items = [1, 2, 3, 4, 5, 6].map((level) => ({
      id: String(level),
      label: `Up to H${level}`,
      ...(level === depth ? { detail: "current" } : {}),
    }));
    await callHost("red/PickerOpen", {
      id: "depth",
      title: "Outline depth",
      items,
    });
    return null;
  }
  throw new Error(`Unknown command ${name}`);
}

async function onPanelAction(action: string) {
  try {
    if (action === "toc") {
      const message = await updateToc({ document_id: following });
      await callHost("red/MessageShow", { message });
    } else if (action === "undo") {
      await callHost("red/MessageShow", { message: await undoToc() });
    } else if (action === "copy") {
      await copyToc();
    } else if (action === "close") {
      await closeOutline();
    }
  } catch (error) {
    await callHost("red/MessageShow", {
      message: (error as Error).message,
      severity: "warning",
    });
  }
}

async function onPicked(item: { id: string }) {
  depth = Number(item.id);
  await callHost("red/StorageSet", { key: "depth", value: depth });
  await refresh();
  await callHost("red/MessageShow", {
    message: `Outline shows headings up to H${depth}`,
  });
}

function dispatch(message: Message) {
  if (message.method === undefined) {
    // A response to one of our host calls.
    const call = waiting.get(String(message.id));
    waiting.delete(String(message.id));
    if (message.error) {
      call?.reject(new HostError(message.error.code, message.error.message));
    } else {
      call?.resolve(message.result ?? null);
    }
    return;
  }
  const { id, method, params } = message;
  switch (method) {
    case "initialize":
      send({
        id,
        result: { protocol_version: 1, commands, events: ["file:opened"] },
      });
      break;
    case "initialized":
      enqueue(loadSettings);
      break;
    case "command/execute":
      enqueue(async () => {
        try {
          const text = await runCommand(params.name);
          send({ id, result: text ? { message: text } : null });
        } catch (error) {
          send({
            id,
            error: { code: -32000, message: (error as Error).message },
          });
        }
      });
      break;
    case "event/notify": // file:opened, declared in red-plugin.toml
      enqueue(async () => {
        const file = params.payload.file;
        if (settings.auto_open && isMarkdown(file)) {
          await openOutline({ path: file });
        }
      });
      break;
    case "document/event":
      if (params.document_id !== following) break;
      enqueue(params.event === "closed" ? closeOutline : refresh);
      break;
    case "panel/event":
      if (params.id === PANEL) enqueue(() => onPanelAction(params.action));
      break;
    case "picker/event":
      if (params.event === "selected") enqueue(() => onPicked(params.item));
      break;
    case "shutdown":
      send({ id, result: null });
      break;
    case "exit":
      process.exit(0);
    default:
      if (id !== undefined) {
        const error = { code: -32601, message: `Unknown method ${method}` };
        send({ id, error });
      }
  }
}

createInterface({ input: process.stdin, crlfDelay: Infinity })
  .on("line", (line) => line && dispatch(JSON.parse(line)))
  .on("close", () => process.exit(0));
