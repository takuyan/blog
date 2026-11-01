# Source code of blog.takuyan.com

個人の日記レベルのブログです。

## Tech Baseline

- Ruby: `4.0.9` (`.ruby-version`)
- Bundler: `2.7.2` (`Gemfile.lock`)
- Static site generator: Middleman `4.4.0`
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
bundle _2.7.2_ exec middleman build
```

## Build

```bash
bundle _2.7.2_ exec middleman build
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

Dependabot checks Ruby dependencies and GitHub Actions weekly. Its changes still
need review and a successful build; CDN script versions in
`source/layouts/_footer.erb` must be checked separately.

As of 2026-11-01, the Ruby baseline is set to 4.0.9, and the CDN scripts use
jQuery 3.7.1 and Bootstrap 3.4.1 over HTTPS with integrity checks. Bootstrap 3 is
end-of-life; 3.4.1 is an interim compatibility update, not a complete security fix.

The gem refresh is **not complete**: this environment could not reach RubyGems.
An offline check against ruby-advisory-db dated 2026-10-10 found advisories for
ActiveSupport, Addressable, bootstrap-sass, concurrent-ruby, Crass, ERB, Nokogiri,
Rack, and Redcarpet in the current lockfile. These are version matches, not proof
that every vulnerability is exploitable on this static site. Ruby tooling runs
during builds and local previews; CDN JavaScript runs in readers' browsers.

Remaining work on a machine with RubyGems access:

- Install Ruby 4.0.9 and Bundler 2.7.2 using the setup instructions above.
- Run the staged update:

  ```bash
  bash script/update-dependencies
  ```

  It updates Middleman and Sprockets together, moves ActiveSupport to the 7.2
  series, updates bootstrap-sass, Redcarpet, Nokogiri and other dependencies,
  and adds bundler-audit. The original Gemfile and lockfile are retained until
  dependency resolution, a current vulnerability audit, a build, and primary
  output/gzip checks all pass. Downloaded gems are installed under vendor/bundle.
  Diagnostic files and the candidate build remain in the printed temporary
  directory on failure so compatibility problems can be investigated. It does
  not load the project's .env into that temporary build or deploy anything.
- Review the generated Gemfile and lockfile diff. Do not ignore advisories just
  to pass the check. The updater has only been syntax-checked and tested on its
  network-failure path in this environment; no gem updates have been applied yet.
- Build the site, then check the home page, posts, feed, styles, and mobile
  navigation in a browser before deploying.

### Build and artifact verification (2026-11-01)

- After updating ruby-build to 20261023 and installing Ruby 4.0.9 through rbenv,
  the normal build passed with Ruby 4.0.9 and Bundler 2.7.2. `bundle check` passed.
  The gem versions remain unchanged; installing the bundle did not update them.
- The Ruby 4.0.9 output contains the same 375 files as the updated Ruby 4.0.1
  build. Every uncompressed file is byte-for-byte identical, and all 153 gzip
  files decompress to their corresponding originals. There are no new missing
  local targets or fragment targets. These counts include local untracked draft
  files; a clean checkout may produce fewer files.
- Clean baseline and updated builds passed using Ruby 4.0.1, the existing gems,
  and temporary verification Gemfiles. Each produced 375 files, including 151
  HTML pages and 153 gzip files. Every gzip file decompressed to its original.
- The output file sets were identical. All HTML differences were limited to the
  two intended CDN script tags; CSS, JavaScript, and images were unchanged.
  Feed XML parsed with six entries; its only differences were entry update times
  caused by copying source files into the temporary baseline directory.
- All 151 HTML pages contained the new script URLs and integrity attributes.
  No new missing local targets or fragment targets were introduced.
- Existing issues remain: six unique internal link targets are absent (18 link
  occurrences), 14 fragment references have no matching anchor, and CSS references
  six missing font URLs. The generated error page is `error.html`, while S3
  configuration names `404.html`, which is not generated.
- Files under `source/posts/drafts`, including local untracked files, are copied
  into build output. Review draft exclusion before uploading the build. No draft
  files were modified by this verification or included in this change.
- Browser rendering, CDN downloads/SRI enforcement, and mobile navigation remain
  unverified: the environment prohibits binding a local HTTP server, and its
  browser does not permit local `file:` URLs. No deployment was performed.

References:

- [Ruby 4.0.9 security fixes](https://www.ruby-lang.org/en/news/2026/10/23/ruby-4-0-9-released/)
- [Middleman 4.6.3 dependencies](https://rubygems.org/gems/middleman-core/versions/4.6.3/dependencies)
- [Bootstrap 3 support status](https://getbootstrap.com/docs/3.4/getting-started/)

## Request

書いて欲しいネタがあれば[こちら](https://github.com/takuyan/blog/issues/new)からリクエストしてください。  
書くかもしれません。

## Copyright

&copy; Takuya Kato All Right Reserved.
