#!/usr/bin/env python3
import json
import os
import re
import sys

next_request = 1


def send(message):
    print(json.dumps({"jsonrpc": "2.0", **message}), flush=True)


def call_host(method, params=None):
    """Send a request to Red and wait for its response."""
    global next_request
    request_id = f"outline-{next_request}"
    next_request += 1
    send({"id": request_id, "method": method, "params": params or {}})
    reply = json.loads(sys.stdin.readline())
    if "error" in reply:
        raise RuntimeError(reply["error"]["message"])
    return reply["result"]


def outline():
    document = call_host("red/DocumentSnapshot")
    headings = re.findall(r"^#{1,6} .+$", document["text"], re.MULTILINE)
    name = os.path.basename(document["path"]) if document["path"] else "This buffer"
    return f"{name} has {len(headings)} headings"


while line := sys.stdin.readline():
    message = json.loads(line)
    request_id, method = message.get("id"), message.get("method")
    if method == "initialize":
        commands = [{"name": "Outline", "metadata": {"title": "Show the Markdown outline"}}]
        send({"id": request_id, "result": {"protocol_version": 1, "commands": commands, "events": []}})
    elif method == "command/execute" and message["params"]["name"] == "Outline":
        try:
            send({"id": request_id, "result": {"message": outline()}})
        except RuntimeError as error:
            send({"id": request_id, "error": {"code": -32000, "message": str(error)}})
    elif method == "shutdown":
        send({"id": request_id, "result": None})
    elif method == "exit":
        sys.exit(0)
