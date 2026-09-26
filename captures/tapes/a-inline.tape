# Inline assist on one exact line: the edit stays unsaved and undoable.
Hide
Type "cd /tmp/demo/throttle && clear && red src/bucket.rs"
Enter
Wait+Screen@30s /NORMAL/
Sleep 7s
Show
Sleep 1s
Type "/u64"
Enter
Sleep 700ms
Type "V"
Sleep 600ms
Space
Type "i"
Sleep 900ms
Type "this rounds down, so callers wake too early. round up."
Sleep 500ms
Enter
Hide
Wait+Screen@120s /Applied to buffer/
Show
Sleep 2.5s
Screenshot "a-inline.png"
Type "v"
Sleep 3.5s
Escape
Sleep 800ms
Type "u"
Sleep 2s
