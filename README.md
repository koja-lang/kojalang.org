# kojalang.org

[![Deploy](https://github.com/koja-lang/kojalang.org/actions/workflows/deploy.yml/badge.svg)](https://github.com/koja-lang/kojalang.org/actions/workflows/deploy.yml)
[![Last Updated](https://img.shields.io/github/last-commit/koja-lang/kojalang.org.svg)](https://github.com/koja-lang/kojalang.org/commits/main)

The landing page for the [Koja programming language](https://github.com/koja-lang/koja), served at [kojalang.org](https://kojalang.org). A [Jekyll](https://jekyllrb.com) static site with no JavaScript framework, just Liquid templates, CSS, and a little vanilla JS.

## Development

Install dependencies and serve the site locally:

```sh
bundle install
bundle exec jekyll serve
```

The landing page lives in `index.html`. The installation guide and language
reference live in `install.md` and `language.md`, with canonical content from
the Koja repository's `INSTALLING.md` and `LANGUAGE.md`. Shared layouts live in
`_layouts/`, and navigation and footer partials live in `_includes/`. Site
metadata is in `_config.yml`.

## Formatting

CI checks formatting with [Prettier](https://prettier.io). Format everything before committing:

```sh
npx prettier --write "**/*.{css,html,js,json,md,yml,yaml}"
```

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages via `.github/workflows/deploy.yml`. The custom domain is configured in `CNAME`.
