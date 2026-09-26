# Git workspace: review the hunk, stage it, generate a commit message, commit.
Hide
Type "cd /tmp/demo/throttle && sed -i '' 's#(missing / self.rate) as u64#missing.div_ceil(self.rate) as u64#' src/bucket.rs && clear && red src/bucket.rs"
Enter
Wait+Screen@30s /NORMAL/
Sleep 6s
Show
Sleep 1s
Space
Type "G"
Sleep 2s
Screenshot "a-git.png"
Type "s"
Sleep 1.2s
Type "c"
Sleep 1.2s
Enter
Hide
Wait+Screen@90s /Commit message generated/
Show
Sleep 3s
Type ":wq"
Sleep 400ms
Enter
Sleep 1.5s
Space
Type "G"
Sleep 1s
Type "l"
Sleep 3s
