## Features Roadmap
1. Make epub parser
    1. ✓ Support EPUB 2.0.
    1. ✓ Support EPUB 3.0.
    1. [-] Support Non-compliant files.
        1. ✓ body.xhtml.

1. File browser / Library
    1. ✓ Ask Permissions.
    1. ✓ Make permission persistent.
    1. ✓ Directory traversal.
    1. ✓ Filter contents - Display only Directories and EPUBs.
    1. ✓ Load book on click.
    1. [-] Properly sort by name.

1. Table of Contents
    1. ✓ Multi-levels.
    1. ✓ Chapter loading (Except for body.xhtml).

1. Page renderer
    1. ✓ Display first part of book when book is loaded (this is usually the cover page).
    1. Dropped: Divide flow into pages that scale on viewport.
    1. Dropped: Button for moving to a specific page.
    1. [-] Button, hotkey, and scroll, touch gestures for [next, previous] page.
    1. Custom text styling.

1. Bookmarks
    1. Last read.
    1. ✓ last spoken by TTS.
    1. ✓ User-defined.
    1. ✓ Autoload from IDB

1. Text-to-speech
    1. [-] Use media controls.
    1. ✓ Start speaking on selected text. 
    1. ✓ Resume speaking on unfinished paragraph.
    1. [-] while reading, immediately start reading if target is changed.
    1. ✓ Set TTS cursor to latest readable bookmark.
    1. ✓ Remember speech_rate
    1. Remember voice

1. Custom keybinds
    1. Load from json
    1. Settings panel
    
1. Improve UI
    1. Use SVG icons
    1. Themes
## Current feature in dev:
Bookmarks