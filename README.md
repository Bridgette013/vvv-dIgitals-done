# vvv-dIgitals-done

Short guide

## Deployment

There are two supported ways to publish the built `dist` directory to the `gh-pages` branch:

1) Local quick deploy (subtree)

- Build and push `dist` locally using the subtree script:

```bash
npm run deploy:subtree
```

This runs `npm run build` (via `predeploy`) and then runs `git subtree push --prefix dist origin gh-pages`. It works well on Windows where the `gh-pages` npm tool can run into argument-length issues.

2) CI deploy (GitHub Actions)

- The repository includes two workflows in `.github/workflows/`:
  - `deploy-subtree.yml` (subtree-split push; already added)
  - `deploy-gh-pages.yml` (uses the GitHub Pages deploy action)

When you push to `main`, the Actions runner will build the project and publish `dist` to `gh-pages` automatically using the runner token.

Notes

- The GitHub Actions workflows use the automatically provided `GITHUB_TOKEN` and do not require extra secrets.
- If you prefer to use the `gh-pages` npm package locally, you may need to enable long paths on Windows (`git config --system core.longpaths true`) or use the subtree approach above.
