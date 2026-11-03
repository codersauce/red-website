#!/bin/sh
# Recreate the deterministic `throttle` demo workspace and an isolated Red config.
# Usage: fixture.sh <workdir>
set -e
W="${1:?workdir}"
HERE_ASSETS="$(cd "$(dirname "$0")" && pwd)/assets"
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

mkdir -p docs
cp "$HERE_ASSETS/bucket.png" "$HERE_ASSETS/window.png" docs/
cat > docs/design.md <<'T'
# Design notes

Two limiters, one rule: **never allocate on the hot path**.
The [token bucket](../src/bucket.rs:23) refills lazily from elapsed time, and the [sliding window](../src/window.rs:17) keeps one timestamp per event.
Both are covered by the [benchmarks](#benchmarks) below.
Response headers follow the [IETF rate-limit header draft](https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/).

## Choosing a limiter

| Limiter | Bursts | Memory | Precision | Use it for |
| :--- | :---: | ---: | :---: | :--- |
| `Bucket` | up to *capacity* | 24 bytes | 1 s | API clients, background jobs |
| `SlidingWindow` | none | 16 bytes per event | exact | logins, **abuse checks** |
| *both, stacked* | short | 24 bytes + window | exact | public endpoints |

## Roadmap

- [x] Token bucket with lazy refill
- [x] Sliding window
- [ ] Leaky bucket for smoothing output
- [ ] `async` wrappers that wait instead of rejecting

## Benchmarks

| Operation | Time | Allocations |
| :--- | ---: | ---: |
| `Bucket::take` | 9 ns | 0 |
| `SlidingWindow::hit` | 31 ns | 0 |

## Token bucket

![Token bucket refill over eight seconds](bucket.png)

A request takes tokens; time puts them back at `rate` per second, never past `capacity`. See [`refill`](../src/bucket.rs:23) and [`take`](../src/bucket.rs:31).

## Sliding window

![Events inside and outside a sliding window](window.png)

Each `hit` drops timestamps older than `span`, then admits the event only while fewer than `limit` remain.
T

cat > docs/overview.md <<'T'
# throttle

Allocation-free rate limiters. The [token bucket](../src/bucket.rs:23) absorbs **bursts**, the [sliding window](../src/window.rs:17) is *exact*.

![Token bucket refill over eight seconds](bucket.png)

| Limiter | Bursts | Memory | `take` / `hit` |
| :--- | :---: | ---: | ---: |
| `Bucket` | up to *capacity* | 24 bytes | 9 ns |
| `SlidingWindow` | none | 16 bytes per event | 31 ns |

- [x] Lazy refill, no timers
- [ ] `async` wrappers ([roadmap](design.md#roadmap))
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
