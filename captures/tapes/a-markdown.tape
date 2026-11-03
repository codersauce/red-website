# Markdown reads as a document and edits as source. Rendered grid and hidden
# link URLs, a before/after of the hidden markup, the table's source on Insert,
# a task toggled with gT, and a link followed into the code and back.
Hide
Type "cd /tmp/demo/throttle && clear && red -c lsp.enabled=false docs/design.md"
Enter
Wait+Screen@30s /NORMAL/
Sleep 4s
Show
Sleep 2.2s
Type ":markdown-conceal"
Sleep 400ms
Enter
Sleep 2s
Type ":markdown-conceal"
Sleep 400ms
Enter
Sleep 1.4s
Type "/SlidingWindow"
Sleep 300ms
Enter
Sleep 900ms
Type "i"
Sleep 1.8s
Escape
Sleep 1.4s
Type "/Leaky"
Sleep 300ms
Enter
Sleep 700ms
Type "gT"
Sleep 1.6s
Type "gg"
Sleep 500ms
Type "/token bucket"
Sleep 300ms
Enter
Sleep 900ms
Type "gx"
Sleep 2.6s
Ctrl+O
Sleep 2s
