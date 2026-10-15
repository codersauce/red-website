# Fonts

`jetbrains-mono-box-drawing.woff2` is the box-drawing range (U+2500–257F) of
[JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), downloaded from
Google Fonts with `text=` subsetting. DM Mono has no box-drawing glyphs, so
`app/globals.css` adds this range to the DM Mono family; both fonts use a
0.6em advance, so tree diagrams stay aligned. JetBrains Mono is licensed under the
[SIL Open Font License 1.1](https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt).
