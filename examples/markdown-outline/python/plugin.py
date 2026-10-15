#!/usr/bin/env python3
"""Markdown Outline: a live outline panel and table of contents for Red."""
import json
import re
import sys
from collections import deque

# --- Talking to Red: one JSON message per line; stdout is reserved for protocol messages ---

sys.stdin.reconfigure(encoding="utf-8")
sys.stdout.reconfigure(encoding="utf-8")


def send(message):
    sys.stdout.write(json.dumps({"jsonrpc": "2.0", **message}, ensure_ascii=False, separators=(",", ":")) + "\n")
    sys.stdout.flush()


def log(*args):
    print("[markdown-outline]", *args, file=sys.stderr)


def receive():
    line = sys.stdin.readline()
    if not line:
        sys.exit(0)  # Red closed the connection
    return json.loads(line)


class HostError(Exception):
    def __init__(self, code, message):
        super().__init__(message)
        self.code = code


next_request = 1
deferred = deque()  # messages that arrived while waiting for a host response


def call_host(method, params=None):
    global next_request
    request_id = f"outline-{next_request}"
    next_request += 1
    send({"id": request_id, "method": method, "params": params or {}})
    # Keep reading until our response arrives; handle anything else afterward.
    while True:
        message = receive()
        if "method" in message:
            deferred.append(message)
        elif message.get("id") == request_id:
            if "error" in message:
                raise HostError(message["error"]["code"], message["error"]["message"])
            return message.get("result")


# --- Markdown ---

FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})")
HEADING = re.compile(r"^ {0,3}(#{1,6})[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$")


def parse_headings(text):
    headings, fence = [], None
    for line, raw in enumerate(text.split("\n")):
        row = raw.rstrip("\r")
        marker = FENCE.match(row)
        if marker:
            marker = marker.group(1)
            if not fence:
                fence = marker
            elif marker[0] == fence[0] and len(marker) >= len(fence):
                fence = None
            continue
        heading = None if fence else HEADING.match(row)
        if heading:
            headings.append({"level": len(heading.group(1)), "title": heading.group(2), "line": line})
    return headings


def slugs(headings):
    seen, result = {}, []
    for heading in headings:
        base = re.sub(r"\s", "-", re.sub(r"[^\w\s-]", "", heading["title"].lower().strip()))
        count = seen.get(base, 0)
        seen[base] = count + 1
        result.append(f"{base}-{count}" if count else base)
    return result


def nested_list(headings, item):
    top = min(heading["level"] for heading in headings)
    return "\n".join(f"{'  ' * (heading['level'] - top)}- {item(heading)}" for heading in headings)


def toc_entries(headings, depth):
    # The table of contents leaves out a lone H1, which is the document's title.
    titled = sum(1 for heading in headings if heading["level"] == 1) == 1
    return [h for h in headings if h["level"] <= depth and not (titled and h["level"] == 1)]


def table_of_contents(headings, depth):
    anchors = {heading["line"]: slug for heading, slug in zip(headings, slugs(headings))}
    entries = toc_entries(headings, depth)
    if not entries:
        return ""
    return nested_list(entries, lambda heading: f"[{heading['title']}](#{anchors[heading['line']]})")


# --- Plugin state ---

PANEL = "outline"
following = None  # document ID the panel follows
last_toc = None
settings = {}
depth = 3


def is_markdown(path):
    return bool(path) and re.search(r"\.(md|markdown)$", path, re.IGNORECASE) is not None


def panel_actions():
    return [
        {"id": "toc", "label": "TOC", "key": "t", "description": "Write or refresh the table of contents"},
        {"id": "copy", "label": "Copy", "key": "c", "description": "Copy the table of contents"},
        {"id": "undo", "label": "Undo", "key": "u", "description": "Undo the last table of contents change",
         "enabled": last_toc is not None},
        {"id": "close", "label": "Close", "compact_label": "x", "key": "q"},
    ]


def load_settings():
    global settings, depth
    settings = call_host("red/ConfigGet") or {}
    stored = call_host("red/StorageGet", {"key": "depth"})
    depth = stored if stored is not None else settings.get("max_depth", 3)


def snapshot(selector=None):
    return call_host("red/DocumentSnapshot", {**(selector or {}), "include_document_id": True})


# --- The outline panel ---

def open_outline(selector=None):
    global following
    document = snapshot(selector)
    if not is_markdown(document["path"]):
        raise ValueError("Outline works on Markdown files (.md or .markdown)")
    if following != document["document_id"]:
        if following:
            call_host("red/DocumentUnwatch", {"document_id": following})
        # Watch before reading, so a change made in between still arrives as an event.
        call_host("red/DocumentWatch", {"document_id": document["document_id"]})
        following = document["document_id"]
    call_host("red/TextPanelCreate",
              {"id": PANEL, "side": "right", "width": 40, "title": "Outline", "actions": panel_actions()})
    refresh()


def refresh():
    if not following:
        return
    document = snapshot({"document_id": following})
    headings = [h for h in parse_headings(document["text"]) if h["level"] <= depth]
    words = len(re.findall(r"[^\W_][\w'’-]*", document["text"]))
    text = nested_list(headings, lambda heading: heading["title"]) if headings else "_No headings yet._"
    call_host("red/TextPanelSetContent", {"id": PANEL, "blocks": [{"id": "outline", "format": "markdown", "text": text}]})
    call_host("red/StatuslineSet", {"text": f"§ {len(headings)} headings · {words:,} words"})


def close_outline():
    global following
    if following:
        call_host("red/DocumentUnwatch", {"document_id": following})
    following = None
    try:
        call_host("red/TextPanelDispose", {"id": PANEL})
    except HostError:
        pass  # already closed by the user
    call_host("red/StatuslineClear")


# --- The table of contents ---

def update_toc(selector):
    global last_toc
    document = snapshot(selector)
    headings = parse_headings(document["text"])
    toc = table_of_contents(headings, depth)
    if not toc:
        raise ValueError("Add a few ## headings first")
    first = toc_entries(headings, depth)[0]["line"]
    lines = [line + "\n" for line in document["text"].split("\n")]  # keep each line's ending
    start = next((i for i, line in enumerate(lines) if line.strip() == "<!-- toc -->"), -1)
    stop = next((i for i, line in enumerate(lines) if i > start and line.strip() == "<!-- tocstop -->"), -1)
    if start >= 0 and stop > start:
        # Replace what is between the markers. Red rejects the edit if that text changed.
        edit = {
            "range": {"start": {"line": start + 1, "character": 0}, "end": {"line": stop, "character": 0}},
            "text": f"{toc}\n",
            "expected_text": "".join(lines[start + 1:stop]),
        }
    else:
        # The first time, insert the markers just before the first section.
        edit = {
            "range": {"start": {"line": first, "character": 0}, "end": {"line": first, "character": 0}},
            "text": f"<!-- toc -->\n{toc}\n<!-- tocstop -->\n\n",
            "expected_text": "",
        }
    applied = call_host("red/DocumentApply", {
        "document_id": document["document_id"],
        "expected_revision": document["revision"],
        "allow_inactive": True,  # the panel may have focus instead of the document
        "label": "Update table of contents",
        "edits": [edit],
    })
    last_toc = {"document_id": document["document_id"], "transaction_id": applied["transaction_id"]}
    if following:
        call_host("red/TextPanelSetActions", {"id": PANEL, "actions": panel_actions()})
    return "Table of contents updated"


def undo_toc():
    global last_toc
    if not last_toc:
        raise ValueError("There is no table of contents change to undo")
    # Red only undoes it while it is still the document's latest change.
    call_host("red/DocumentUndo", {**last_toc, "allow_inactive": True})
    last_toc = None
    if following:
        call_host("red/TextPanelSetActions", {"id": PANEL, "actions": panel_actions()})
    return "Table of contents change undone"


def copy_toc():
    document = snapshot({"document_id": following})
    call_host("red/ClipboardWrite", {"text": table_of_contents(parse_headings(document["text"]), depth) + "\n"})
    call_host("red/MessageShow", {"message": "Table of contents copied", "severity": "success"})


# --- Commands, events, and notifications ---

COMMANDS = [
    {"name": "Outline", "metadata": {"title": "Show the Markdown outline", "category": "Markdown"}},
    {"name": "OutlineToc", "metadata": {"title": "Write or refresh the table of contents", "category": "Markdown"}},
    {"name": "OutlineDepth", "metadata": {"title": "Choose the outline depth", "category": "Markdown"}},
]


def run_command(name):
    if name == "Outline":
        open_outline()
        return None
    if name == "OutlineToc":
        return update_toc({})
    if name == "OutlineDepth":
        items = [{"id": str(level), "label": f"Up to H{level}", **({"detail": "current"} if level == depth else {})}
                 for level in range(1, 7)]
        call_host("red/PickerOpen", {"id": "depth", "title": "Outline depth", "items": items})
        return None
    raise ValueError(f"Unknown command {name}")


def on_panel_action(action):
    try:
        if action == "toc":
            call_host("red/MessageShow", {"message": update_toc({"document_id": following})})
        elif action == "undo":
            call_host("red/MessageShow", {"message": undo_toc()})
        elif action == "copy":
            copy_toc()
        elif action == "close":
            close_outline()
    except (HostError, ValueError) as error:
        call_host("red/MessageShow", {"message": str(error), "severity": "warning"})


def on_picked(item):
    global depth
    depth = int(item["id"])
    call_host("red/StorageSet", {"key": "depth", "value": depth})
    refresh()
    call_host("red/MessageShow", {"message": f"Outline shows headings up to H{depth}"})


def handle(message):
    request_id, method, params = message.get("id"), message["method"], message.get("params") or {}
    if method == "initialize":
        send({"id": request_id, "result": {"protocol_version": 1, "commands": COMMANDS, "events": ["file:opened"]}})
    elif method == "initialized":
        load_settings()
    elif method == "command/execute":
        try:
            text = run_command(params["name"])
            send({"id": request_id, "result": {"message": text} if text else None})
        except (HostError, ValueError) as error:
            send({"id": request_id, "error": {"code": -32000, "message": str(error)}})
    elif method == "event/notify":  # file:opened, declared in red-plugin.toml
        if settings.get("auto_open") and is_markdown(params["payload"]["file"]):
            open_outline({"path": params["payload"]["file"]})
    elif method == "document/event":
        if params["document_id"] == following:
            close_outline() if params["event"] == "closed" else refresh()
    elif method == "panel/event":
        if params["id"] == PANEL:
            on_panel_action(params["action"])
    elif method == "picker/event":
        if params["event"] == "selected":
            on_picked(params["item"])
    elif method == "shutdown":
        send({"id": request_id, "result": None})
    elif method == "exit":
        sys.exit(0)
    elif request_id is not None:
        send({"id": request_id, "error": {"code": -32601, "message": f"Unknown method {method}"}})


def main():
    while True:
        message = deferred.popleft() if deferred else receive()
        if "method" not in message:
            continue  # a late response to a call we stopped waiting for
        try:
            handle(message)
        except HostError as error:
            log(error)


main()
