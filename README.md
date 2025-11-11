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

DNS / Custom domain setup

If you want `https://vvvdigitals.com/` to serve your site, configure your DNS and the repository as follows:

- For an apex domain (example.com / vvvdigitals.com): add four A records pointing to GitHub Pages IPs:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

- For a subdomain (www.example.com) use a CNAME record pointing to your GitHub Pages address:

```
USERNAME.github.io.
```

- Ensure the repository's `CNAME` file (in the repository root) contains the custom domain (e.g. `vvvdigitals.com`). The workflows will copy that `CNAME` into `dist` before deploying, or you can set a `CUSTOM_DOMAIN` repository secret with the domain name.

- After the site is deployed, enable HTTPS in the repository Settings → Pages if it isn't enabled automatically. GitHub will provision certificates for `www` and apex domains that point correctly.
