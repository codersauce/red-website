import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

// The guide's Markdown Outline plugin, driven by a scripted stand-in for Red.
const examples = new URL("../examples/markdown-outline/", import.meta.url);
const plugins = [
  { name: "TypeScript", directory: "typescript", command: process.execPath, args: ["--experimental-strip-types", "plugin.ts"] },
  { name: "Python", directory: "python", command: "python3", args: ["plugin.py"] },
];
const pythonAvailable = spawnSync("python3", ["--version"]).status === 0;

const readme = [
  "# Bucket", "", "A token bucket. Café ☕ included.", "",
  "## Install", "", "Add the crate.", "",
  "```sh", "# Build in release mode", "cargo build --release", "```", "",
  "### Take tokens", "", "## License", "", "MIT", "",
].join("\n");
const toc = "- [Install](#install)\n  - [Take tokens](#take-tokens)\n- [License](#license)";

function connect({ command, args, directory }) {
  const child = spawn(command, args, { cwd: new URL(directory, examples), stdio: ["pipe", "pipe", "inherit"] });
  const inbox = [];
  let buffered = "";
  let wake = () => {};
  child.stdout.setEncoding("utf8").on("data", (chunk) => {
    buffered += chunk;
    for (let end = buffered.indexOf("\n"); end >= 0; end = buffered.indexOf("\n")) {
      inbox.push(JSON.parse(buffered.slice(0, end)));
      buffered = buffered.slice(end + 1);
    }
    wake();
  });
  const exited = new Promise((resolve) => child.on("exit", resolve));

  async function next() {
    const deadline = Date.now() + 5000;
    while (!inbox.length) {
      if (Date.now() > deadline) throw new Error("plugin sent nothing for 5 s");
      await new Promise((resolve) => { wake = resolve; setTimeout(resolve, 50); });
    }
    return inbox.shift();
  }

  return {
    exited,
    send: (message) => child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}\n`),
    // Answer host calls until `done` returns true for a message from the plugin.
    async serve(document, calls, done) {
      for (;;) {
        const message = await next();
        if (message.method?.startsWith("red/")) {
          calls.push({ method: message.method, params: message.params });
          const result = {
            "red/DocumentSnapshot": { path: "README.md", revision: document.revision, text: document.text, document_id: "7" },
            "red/DocumentWatch": { revision: document.revision },
            "red/DocumentApply": { transaction_id: "t1", revision: "2" },
            "red/DocumentUndo": { revision: "3" },
            "red/ConfigGet": { max_depth: 3 },
          }[message.method] ?? null;
          this.send({ id: message.id, result });
        }
        if (done(message)) return message;
      }
    },
  };
}

async function transcript(plugin) {
  const red = connect(plugin);
  const calls = [];
  const document = { revision: "1", text: readme };
  const reply = (id) => (message) => message.id === id && !message.method;

  red.send({ id: 1, method: "initialize", params: { protocol_versions: [1], red_api_version: "0.19.0", plugin_id: "markdown-outline", host_methods: [] } });
  const initialized = await red.serve(document, calls, reply(1));
  red.send({ method: "initialized" });

  red.send({ id: 2, method: "command/execute", params: { name: "Outline", args: [], raw_args: "" } });
  const outline = await red.serve(document, calls, reply(2));

  red.send({ id: 3, method: "command/execute", params: { name: "OutlineToc", args: [], raw_args: "" } });
  const inserted = await red.serve(document, calls, reply(3));

  document.text = readme.replace("## Install", `<!-- toc -->\n- [Install](#install)\n<!-- tocstop -->\n\n## Install`);
  document.revision = "4";
  red.send({ id: 4, method: "command/execute", params: { name: "OutlineToc", args: [], raw_args: "" } });
  const refreshed = await red.serve(document, calls, reply(4));

  red.send({ method: "panel/event", params: { id: "outline", action: "undo" } });
  await red.serve(document, calls, () => calls.at(-1)?.method === "red/MessageShow");

  red.send({ method: "document/event", params: { document_id: "7", event: "closed" } });
  await red.serve(document, calls, () => calls.at(-1)?.method === "red/StatuslineClear");

  red.send({ id: 5, method: "shutdown" });
  const shutdown = await red.serve(document, calls, reply(5));
  red.send({ method: "exit" });
  return { initialized, outline, inserted, refreshed, shutdown, calls, exitCode: await red.exited };
}

const manifestCommands = async (directory) => {
  const manifest = await readFile(new URL(`${directory}/red-plugin.toml`, examples), "utf8");
  return {
    commands: JSON.parse(/^commands = (\[.*\])$/m.exec(manifest)[1]),
    events: JSON.parse(/^events = (\[.*\])$/m.exec(manifest)?.[1] ?? "[]"),
  };
};

const results = new Map();
for (const plugin of plugins) {
  test(`the ${plugin.name} outline plugin builds an outline and a table of contents`, { skip: plugin.name === "Python" && !pythonAvailable && "python3 is not installed" }, async () => {
    const run = await transcript(plugin);
    results.set(plugin.name, run);
    const { commands, events } = await manifestCommands(plugin.directory);
    assert.deepEqual(run.initialized.result.commands.map((command) => command.name), commands);
    assert.deepEqual(run.initialized.result.events, events);
    assert.equal(run.initialized.result.protocol_version, 1);

    const methods = run.calls.map((call) => call.method);
    assert.ok(methods.indexOf("red/DocumentWatch") < methods.lastIndexOf("red/DocumentSnapshot"), "watch before reading");
    const content = run.calls.find((call) => call.method === "red/TextPanelSetContent").params.blocks[0];
    assert.equal(content.text, "- Bucket\n  - Install\n    - Take tokens\n  - License");
    assert.equal(content.format, "markdown");
    assert.match(run.calls.find((call) => call.method === "red/StatuslineSet").params.text, /^§ 4 headings · \d+ words$/);
    assert.equal(run.outline.result, null);

    const [insert, replace] = run.calls.filter((call) => call.method === "red/DocumentApply").map((call) => call.params);
    assert.deepEqual(insert.edits, [{
      range: { start: { line: 4, character: 0 }, end: { line: 4, character: 0 } },
      text: `<!-- toc -->\n${toc}\n<!-- tocstop -->\n\n`,
      expected_text: "",
    }]);
    assert.equal(insert.expected_revision, "1");
    assert.deepEqual(replace.edits, [{
      range: { start: { line: 5, character: 0 }, end: { line: 6, character: 0 } },
      text: `${toc}\n`,
      expected_text: "- [Install](#install)\n",
    }]);
    assert.deepEqual(run.inserted.result, { message: "Table of contents updated" });
    assert.deepEqual(run.refreshed.result, { message: "Table of contents updated" });

    const undo = run.calls.find((call) => call.method === "red/DocumentUndo").params;
    assert.deepEqual(undo, { document_id: "7", transaction_id: "t1", allow_inactive: true });
    assert.ok(methods.includes("red/TextPanelDispose"));
    assert.equal(run.shutdown.result, null);
    assert.equal(run.exitCode, 0);
  });
}

for (const plugin of plugins) {
  test(`the guide's first ${plugin.name} command counts headings the naive way`, { skip: plugin.name === "Python" && !pythonAvailable && "python3 is not installed" }, async () => {
    const red = connect({ ...plugin, directory: `first-command/${plugin.directory}` });
    const calls = [];
    const document = { revision: "1", text: readme };
    red.send({ id: 1, method: "initialize", params: { protocol_versions: [1] } });
    const initialized = await red.serve(document, calls, (message) => message.id === 1);
    assert.deepEqual(initialized.result.commands.map((command) => command.name), (await manifestCommands(`first-command/${plugin.directory}`)).commands);
    red.send({ method: "initialized" });
    red.send({ id: 2, method: "command/execute", params: { name: "Outline", args: [], raw_args: "" } });
    const reply = await red.serve(document, calls, (message) => message.id === 2 && !message.method);
    // Five lines start with "#", including the shell comment that step 2 learns to skip.
    assert.deepEqual(reply.result, { message: "README.md has 5 headings" });
    red.send({ id: 3, method: "shutdown" });
    await red.serve(document, calls, (message) => message.id === 3);
    red.send({ method: "exit" });
    assert.equal(await red.exited, 0);
  });
}

test("both outline plugins make the same host calls", { skip: !pythonAvailable && "python3 is not installed" }, () => {
  const [typescript, python] = ["TypeScript", "Python"].map((name) => results.get(name));
  assert.ok(typescript && python, "both plugin runs completed");
  assert.deepEqual(python.calls, typescript.calls);
});
