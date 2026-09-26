# Full Agent fixes the refill overflow through the editor. The wait is cut.
Hide
Type "cd /tmp/demo/throttle && clear && red src/bucket.rs"
Enter
Wait+Screen@30s /NORMAL/
Sleep 7s
Show
Sleep 1s
Type "26G"
Sleep 800ms
Space
Type "A"
Sleep 900ms
Type "refill can overflow when the bucket sits idle. Cap tokens at capacity."
Sleep 600ms
Enter
Sleep 7s
Hide
Wait+Screen@240s /Worked for/
Show
Sleep 2.5s
Screenshot "a-agent.png"
Sleep 3s
