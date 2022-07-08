## Features Roadmap
1. Make epub parser
    NOTE: Separate project
    - [x] Support EPUB 2.0.
    - [x] Support EPUB 3.0.
    - [ ] Try to render non-compliant files.
        - [x] body.xhtml.

1.  File browser / Library
    NOTES
        - Unsupported in mobile.
        - Created a separate project, though it's not in dev.
    - [x] panel
    - [x] Load book on click.
    - [x] Ask READ permissions.
    - [x] Make permission persistent.
        - NOTE: User gesture is still required.
    - [x] Directory traversal.
    - [x] Filter contents - Display only Directories and EPUBs.
    - [ ] Sort by name.

1.  Table of Contents
    - [x] panel
    - [x] Multi-level
        - max-depth at 7 to follow my EPUB project.
    - [x] Chapter navigation via anchors.
        - Except for body.xhtml.

1.  Bookmarks
    - [x] panel
    - [ ] Last read via scroll position.
    - [x] last spoken by TTS.
    - [x] User-defined.
    - [x] Autoload from IDB

1.  Text-to-speech
    Note: Planing to create a separate project to replicate the behavior in Chromium edge.
    - [x] Overlay in footer
    - [ ] Use media controls.
        - branch exists.
    - [x] Start speaking on selected text. 
    - [x] Resume speaking on unfinished text.
    - [ ] while reading, immediately start reading if target is changed.
    - [x] Set TTS cursor to latest readable bookmark.
    - [x] Remember speech_rate
    - [ ] Remember voice

1. Modes
    - [x] Load all approach.
    - [x] Lazy loading.
        1. There are TTS issues.

1. Settings
    - [x] panel
        - [x] Loader
        - [ ] TTS
        - [ ] Styling
    - [ ] Custom keybinds
        - [ ] Store in IndexedDB
        - [ ] json im/export 
    - [ ] Load from json
        - [ ] pref loader mode
    
1.  UI
    - [ ] Button, hotkey, and scroll, pointer gestures for [next, previous] page.
    - [ ] Use SVG images for buttons
    - [ ] Themes
    - [ ] Custom styles
    - [ ] Use epub provided styles

1. Progressive Web App
    - [x] Meet install requirements in:
        - [x] Chromium-based
            - [x] Mobile
            - [x] Desktop
        - [ ] Firefox
            - [ ] Desktop - unsupported
            - [ ] Android - untested
        - [ ] Safari
            - [ ] IOS - untested
            - [ ] Mac - untested
    - Chromium:
        - [x] Register as file handler
    - [ ] Someday - Permanent directory READ access

1. Cloudsync
    - [ ] progress
    - [ ] settings

## Current feature in dev:
TTS lazy mode