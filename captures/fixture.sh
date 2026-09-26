#!/bin/sh
# Recreate the deterministic `throttle` demo workspace and an isolated Red config.
# Usage: fixture.sh <workdir>
set -e
W="${1:?workdir}"
rm -rf "$W"
mkdir -p "$W/throttle/src" "$W/xdg/red"
cd "$W/throttle"

cat > Cargo.toml <<'T'
[package]
name = "throttle"
version = "0.3.0"
edition = "2021"
description = "Token-bucket and sliding-window rate limiters"

[dependencies]
T

cat > src/lib.rs <<'T'
//! Small, allocation-free rate limiters.

pub mod bucket;
pub mod window;

pub use bucket::Bucket;
pub use window::SlidingWindow;
T

cat > src/bucket.rs <<'T'
use std::time::{Duration, Instant};

/// A token bucket that refills at a fixed rate.
pub struct Bucket {
    capacity: u32,
    tokens: u32,
    rate: u32,
    last: Instant,
}

impl Bucket {
    /// Create a full bucket that earns `rate` tokens per second.
    pub fn new(capacity: u32, rate: u32) -> Self {
        Self {
            capacity,
            tokens: capacity,
            rate,
            last: Instant::now(),
        }
    }

    /// Add the tokens earned since the last refill.
    pub fn refill(&mut self, now: Instant) {
        let elapsed = now.duration_since(self.last).as_secs() as u32;
        let earned = elapsed * self.rate;
        self.tokens = self.tokens + earned;
        self.last = now;
    }

    /// Try to take `n` tokens. Returns false when the bucket is short.
    pub fn take(&mut self, n: u32) -> bool {
        self.refill(Instant::now());
        if self.tokens < n {
            return false;
        }
        self.tokens -= n;
        true
    }

    /// The most tokens this bucket can hold.
    pub fn capacity(&self) -> u32 {
        self.capacity
    }

    /// How long until `n` tokens are available.
    pub fn wait_time(&self, n: u32) -> Duration {
        if self.tokens >= n {
            return Duration::ZERO;
        }
        let missing = n - self.tokens;
        Duration::from_secs((missing / self.rate) as u64)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn starts_full() {
        let mut bucket = Bucket::new(10, 1);
        assert!(bucket.take(10));
        assert!(!bucket.take(1));
    }
}
T

cat > src/window.rs <<'T'
use std::collections::VecDeque;
use std::time::{Duration, Instant};

/// Allow at most `limit` events inside a moving time window.
pub struct SlidingWindow {
    limit: usize,
    span: Duration,
    events: VecDeque<Instant>,
}

impl SlidingWindow {
    pub fn new(limit: usize, span: Duration) -> Self {
        Self { limit, span, events: VecDeque::with_capacity(limit) }
    }

    /// Record an event if the window has room.
    pub fn hit(&mut self, now: Instant) -> bool {
        while let Some(&oldest) = self.events.front() {
            if now.duration_since(oldest) < self.span {
                break;
            }
            self.events.pop_front();
        }
        if self.events.len() >= self.limit {
            return false;
        }
        self.events.push_back(now);
        true
    }

    pub fn remaining(&self) -> usize {
        self.limit - self.events.len()
    }
}
T

cat > README.md <<'T'
# throttle

Small, allocation-free rate limiters for Rust services.

- `Bucket`: a token bucket with a steady refill rate
- `SlidingWindow`: at most N events per time span
T

printf '/target\nCargo.lock\n' > .gitignore

git init -q -b main
git config user.name "Demo"
git config user.email "demo@getred.dev"
git -c user.name="Demo" -c user.email="demo@getred.dev" add -A
git -c user.name="Demo" -c user.email="demo@getred.dev" commit -qm "Add token bucket and sliding window"

# Isolated Red config: no tour, no release panel, no network fetch.
cat > "$W/xdg/red/config.toml" <<'T'
theme = "red.json"
show_whats_new = false
fetch_release_notes = false
log_file = "red.log"

[copilot]
command = "copilot-disabled-for-captures"
T
