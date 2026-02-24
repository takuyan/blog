# Source code of blog.takuyan.com

個人の日記レベルのブログです。

## Tech Baseline

- Ruby: `4.0.1` (`.ruby-version`)
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

## Request

書いて欲しいネタがあれば[こちら](https://github.com/takuyan/blog/issues/new)からリクエストしてください。  
書くかもしれません。

## Copyright

&copy; Takuya Kato All Right Reserved.
