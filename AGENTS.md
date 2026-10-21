# Project workflow

- Canonical remote: https://github.com/sz8265493-cecil/infi-sim (public, explicitly authorized by the user on 2026-10-21).
- All subsequent testing and deployment must use GitHub. Do not publish or update this simulator through GPT Sites.
- Run CI in GitHub Actions. Tests validates pushes and pull requests.
- GitHub Pages uses GitHub Actions. deploy-pages.yml tests and checks JavaScript syntax before publishing dist/ on main pushes or manual dispatch.
- Production URL: https://sz8265493-cecil.github.io/infi-sim/
- Preserve third-party asset ownership notices. Public visibility does not grant a new license to third-party assets.
- This checkout was cloned from the canonical GitHub history. Older migration checkouts have divergent history; never force-push those.
