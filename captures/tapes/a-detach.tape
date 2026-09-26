# A detached session keeps unsaved work after the terminal lets go.
Hide
Type "cd /tmp/demo/throttle && clear"
Enter
Show
Sleep 600ms
Type "red --detach=work src/window.rs"
Sleep 300ms
Enter
Hide
Wait+Screen@30s /NORMAL/
Sleep 5s
Show
Sleep 800ms
Type "/remaining"
Enter
Sleep 500ms
Type "O"
Type "/// Free slots left in the current window."
Escape
Sleep 1.2s
Ctrl+\
Sleep 1.8s
Type "red --attach work"
Sleep 300ms
Enter
Hide
Wait+Screen@20s /NORMAL/
Sleep 600ms
Show
Sleep 2.5s
Screenshot "a-detach.png"
Sleep 1s
