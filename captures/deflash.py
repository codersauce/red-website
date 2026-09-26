#!/usr/bin/env python3
"""Remove capture flashes from a VHS recording.

VHS occasionally grabs xterm.js mid-repaint, which yields a frame that is only
the terminal background. Red itself never clears the screen between frames, so
any short run of blank frames between non-blank ones is a capture artifact.
Those frames are dropped and the previous frame is held in their place, so
timing is unchanged. Also writes <name>-poster.jpg from the first frame, so a
page swapping poster for video shows no jump.

Usage: deflash.py in.mp4 out.mp4
"""
import re
import subprocess
import sys

src, dst = sys.argv[1], sys.argv[2]
probe = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", src, "-vf",
     "signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-", "-f", "null", "-"],
    capture_output=True, text=True, check=True).stdout
yavg = [float(v) for v in re.findall(r"YAVG=([\d.]+)", probe)]
floor = min(yavg)

def blank(i):
    return yavg[i] < floor + 0.4

MAX_RUN = 3
drop = []
i = 1
while i < len(yavg) - 1:
    if blank(i) and not blank(i - 1):
        j = i
        while j < len(yavg) and blank(j):
            j += 1
        if j < len(yavg) and j - i <= MAX_RUN:
            drop.extend(range(i, j))
        i = j
    else:
        i += 1

vf = []
if drop:
    vf.append("select='not(" + "+".join(f"eq(n\\,{n})" for n in drop) + ")'")
cmd = ["ffmpeg", "-v", "error", "-y", "-i", src]
if vf:
    cmd += ["-vf", ",".join(vf)]
cmd += ["-fps_mode", "cfr", "-r", "30", "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-crf", "20", "-preset", "slow", "-movflags", "+faststart", "-an", dst]
subprocess.run(cmd, check=True)
poster = re.sub(r"\.mp4$", "-poster.jpg", dst)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", dst, "-frames:v", "1", "-q:v", "3", poster], check=True)
print(f"{dst}: dropped {len(drop)} flash frame(s) {drop}")
