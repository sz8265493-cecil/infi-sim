# Project workflow

- Canonical remote: https://github.com/sz8265493-cecil/infi-sim (private).
- User instruction dated 2026-10-21: all subsequent testing and deployment must use GitHub. Do not publish or update this simulator through GPT Sites.
- Run CI in GitHub Actions. The existing Tests workflow validates pushes and pull requests.
- GitHub Pages is currently blocked by the account plan for this private repository. Do not make the repository public or purchase a plan without user authorization.
- deploy-pages.yml is a manually triggered, test-gated deployment workflow. Enable Pages in repository settings before running it.
- This local checkout retains older history and differs from GitHub's uploaded snapshot history. Never force-push it; synchronize from the GitHub history before future source changes.
