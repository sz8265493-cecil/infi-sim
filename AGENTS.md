# Project workflow

- Latest user instruction, 2026-10-28: make sz8265493-cecil/infi-sim public/open source and deploy the website on GitHub Pages. This supersedes earlier instructions to keep the repository private, pause synchronization and disable Pages.
- Canonical repository: https://github.com/sz8265493-cecil/infi-sim. Public site: https://sz8265493-cecil.github.io/infi-sim/.
- Develop locally, manually exercise affected flows in a real browser, then sync validated changes. Automated tests alone do not replace browser verification.
- Retain the independent Tests workflow. Pages deployment publishes complete dist/ only after tests and syntax checks pass; use GitHub Actions as the Pages source. Do not publish through GPT Sites.
- Record what was actually exercised and any remaining limitations. Do not claim untested flows passed.
- The user authorized sharing this private repository with GitHub account JFungx, author of JFungx/Tactical_Helper.
- This checkout uses GitHub's canonical history. Older migration checkouts have divergent history; never force-push those.
