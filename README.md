# Source code of blog.takuyan.com

個人の日記レベルのブログです。

## Tech Baseline

- Ruby: `4.0.9` (`.ruby-version`)
- Bundler: `2.7.2` (`Gemfile.lock`)
- Static site generator: Middleman `4.6.3`
- Main content: `source/posts`
- Generated output: `build/`
- Deploy target: Amazon S3 bucket `blog.takuyan.com`

公開済みポストの本文は変更せず、技術基盤のみ更新する方針です。

## Local Setup

### 1) Ruby (rbenv)

```bash
rbenv install -s "$(cat .ruby-version)"
rbenv local "$(cat .ruby-version)"
ruby -v
```

### 2) Bundler + dependencies

```bash
gem install bundler -v 2.7.2
bundle _2.7.2_ install
```

### 3) Environment variables (`.env`)

Copy `.env.sample` to `.env` and set:

- `S3_ACCESS`
- `S3_SECRET`

`config.rb` loads `.env` via `dotenv`.

## Run (Local Preview)

```bash
bundle _2.7.2_ exec middleman server
```

Open `http://127.0.0.1:4567`.

Notes:

- `livereload` is intentionally disabled in `config.rb` (known issue, TODO remains).
- If local server fails, confirm baseline execution first:

```bash
bundle _2.7.2_ exec middleman build --bail
```

## Build

```bash
bundle _2.7.2_ exec middleman build --bail
```

Build artifacts are generated in `build/`.

## Deploy (S3)

```bash
bundle _2.7.2_ exec middleman s3_sync
```

Prerequisites:

- S3 bucket `blog.takuyan.com` exists.
- IAM credentials in `.env` have S3 update permissions for this bucket.

## Troubleshooting

- `Could not find ... in any of the sources`
  - Run `bundle _2.7.2_ install`
- Bundler version mismatch
  - Use `bundle _2.7.2_ ...` explicitly
- `s3_sync` permission errors
  - Re-check IAM policy for bucket and object operations

## Dependency maintenance

Dependabot checks Ruby dependencies and GitHub Actions weekly. CI runs
`bundler-audit check --update` without an ignore list, builds with `--bail`, checks
public artifacts, and exercises desktop/mobile behavior in the runner's Chrome.

The 2026-11-01 security refresh updates the locked vulnerable dependencies:

| Dependency | Before | After |
| --- | --- | --- |
| ActiveSupport | 6.1.7.10 | 7.2.4 |
| Addressable | 2.8.8 | 2.9.2 |
| bootstrap-sass | 3.3.7 | 3.4.1 |
| concurrent-ruby | 1.3.6 | 1.3.8 |
| Crass | 1.0.6 | 1.0.8 |
| ERB | 6.0.1 | 6.0.7 |
| Nokogiri | 1.19.1 | 1.19.4 |
| Rack | 2.2.22 | 3.1.23 |
| Redcarpet | 3.4.0 | 3.6.1 |
| Sanitize | 7.0.0 | 7.0.1 |

Middleman 4.6.3 and Sprockets 4.2.2 allow the supported dependencies. A CSS
manifest compiles the existing Sass styles through Sprockets 4. Bootstrap's CSS
is retained, but **no Bootstrap JavaScript or jQuery is served**. The small native
navigation handler preserves mobile open/close behavior and updates ARIA state.
The error-page URL suggestion uses DOM properties instead of inserting a URL as
HTML. This removes the unused Bootstrap button, tooltip, and popover components
covered by [CVE-2024-6485](https://github.com/advisories/GHSA-vxmc-5x29-h64v) and
[CVE-2025-1647](https://github.com/advisories/GHSA-q58r-hwc8-rm9j).

`source/posts/drafts/**` is excluded from the sitemap and public build. Do not
upload source directories or local preview output. CI verifies draft paths and
references are absent before saving screenshots of public pages only; it never
uploads the complete build or source tree.

### Reproduce verification

```bash
bundle _2.7.2_ exec bundler-audit check --update
bundle _2.7.2_ exec middleman build --bail
bundle _2.7.2_ exec ruby script/verify-build
bundle _2.7.2_ exec ruby script/verify-rendering-regressions
node script/verify-browser.mjs
```

Browser verification needs Node 22 and Chrome (set `CHROME_BIN` to an existing
browser executable outside Linux). CI supplies these runtimes. Checks cover the
every generated HTML page at 390px and 1280px, including all tag pages;
exact About/error/tag titles and headings; mobile menu open/close and ARIA state;
desktop navigation; horizontal overflow; and legacy `/blog/` URL suggestions.
Screenshots are saved in `output/playwright/`.
The full visit inventory is saved in `output/browser-coverage.json`.

Tilt 2.9 resolves `.html.erb` separately from `.erb`. Both must use Middleman's
renderer: the generic Tilt renderer omits the marker Padrino needs to capture
`content_for` blocks, causing layout HTML to appear inside titles and headings.
The explicit compound-extension registration in `config.rb` preserves capture
without reverting any dependency. The regression check exercises buffer isolation
and proves malformed document/navigation/body output is rejected. Artifact checks
count document tags before DOM parsing, which would otherwise repair duplicates.

The artifact check verifies main outputs, compiled CSS, navigation/pagination
links, valid feed entries, byte-identical gzip decompression, absence of legacy
JavaScript and drafts, and a live download/SRI comparison for the pinned Font
Awesome stylesheet. Existing social widgets are mutable service endpoints and
cannot use a fixed SRI hash; their direct asset URLs use HTTPS.

For a future staged update, run `bash script/update-dependencies`. It uses the
current Gemfile constraints, installs gems under `vendor/bundle`, and promotes
Gemfile/lockfile only after the same audit, build, artifact, and browser checks
pass. It does not deploy or copy `.env` into the validation directory.

Remaining legacy content-link/asset issues and validation results are recorded
in PR #70. Bootstrap 3 CSS remains end-of-life; this change removes its JavaScript
runtime exposure rather than redesigning the site. Third-party analytics/social
services retain their existing behavior. No article or draft content is changed.

## Request

書いて欲しいネタがあれば[こちら](https://github.com/takuyan/blog/issues/new)からリクエストしてください。  
書くかもしれません。

## Copyright

&copy; Takuya Kato All Right Reserved.
