#!/usr/bin/env node
import { createInterface } from "node:readline";

const send = (message: Record<string, unknown>) =>
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}\n`);

let nextRequest = 1;
const waiting = new Map<string, (reply: any) => void>();

// Send a request to Red and resolve with its response.
function callHost(method: string, params = {}): Promise<any> {
  const id = `outline-${nextRequest++}`;
  send({ id, method, params });
  return new Promise((resolve, reject) => {
    waiting.set(id, (reply) => {
      if (reply.error) {
        reject(new Error(reply.error.message));
      } else {
        resolve(reply.result);
      }
    });
  });
}

async function outline(): Promise<string> {
  const document = await callHost("red/DocumentSnapshot");
  const headings = document.text.match(/^#{1,6} .+$/gm) ?? [];
  const name = document.path?.split(/[\\/]/).pop() ?? "This buffer";
  return `${name} has ${headings.length} headings`;
}

createInterface({ input: process.stdin }).on("line", async (line) => {
  const message = JSON.parse(line);
  // A response from Red.
  if (message.method === undefined) {
    waiting.get(message.id)?.(message);
    return;
  }
  const { id, method, params } = message;
  if (method === "initialize") {
    const commands = [
      { name: "Outline", metadata: { title: "Show the Markdown outline" } },
    ];
    send({ id, result: { protocol_version: 1, commands, events: [] } });
  } else if (method === "command/execute" && params.name === "Outline") {
    try {
      send({ id, result: { message: await outline() } });
    } catch (error) {
      send({ id, error: { code: -32000, message: (error as Error).message } });
    }
  } else if (method === "shutdown") {
    send({ id, result: null });
  } else if (method === "exit") {
    process.exit(0);
  }
});
