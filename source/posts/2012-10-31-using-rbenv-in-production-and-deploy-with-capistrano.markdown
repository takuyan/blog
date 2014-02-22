---
title: "本番環境でrbenvとCapistrano"
date: 2012-10-31 07:33
comments: true
categories: [ruby, rails, rbenv, capistrano, deploy]
---

一応、ひととおり書きますが、ブログに書くことは必ず古くなり、また、内容もメンテナンスされる保証はありません。

よって、基本的なことは以下のサイトで直接確認してください。

### 参考

[Using rbenv in production](https://github.com/sstephenson/rbenv/wiki/Using-rbenv-in-production)

[DEPLOYING WITH RBENV AND CAPISTRANO](http://henriksjokvist.net/archive/2012/2/deploying-with-rbenv-and-capistrano/)

## Install rbenv to production

`git`をインストール済みのサーバで以下のコマンドを実行し、デプロイユーザに対して`rbenv`をインストールします。
OSについては、専用のコマンドが用意してあるので`Ubuntu`がお勧めです。

``` sh
curl -L https://raw.github.com/fesplugas/rbenv-installer/master/bin/rbenv-installer | bash
```

それに加え、`.bash_profile`など、loadpathの含まれるファイルに以下を追記する。

``` sh
if [[ -d $HOME/.rbenv ]]; then
  export PATH="$HOME/.rbenv/bin:$PATH"
  eval "$(rbenv init -)"
fi
```

`Ubuntu 10.04 LTS`, `Ubuntu 11.10` or `Ubuntu 12.04 LTS`であれば、専用のインストールコマンドが用意されています。
それを実行しましょう。

``` sh
$ rbenv bootstrap-ubuntu-12-04
```

あとはお好きなrubyをインストールします。
それと、新しくrubyをインストールした場合や、実行可能なbinを含むgemをインストールしたときは、[rbenv rehash](https://github.com/sstephenson/rbenv#section_3.6)を実行しましょう。

``` sh
$ rbenv install 1.9.3-p286
$ rbenv rehash
```

## Capistrano

### Capfile

デフォルトで以下のようになっていました。

``` ruby
load 'deploy'
# Uncomment if you are using Rails' asset pipeline
# load 'deploy/assets'
load 'config/deploy' # remove this line to skip loading any of the default tasks
```

ほぼ間違いないく`asset pipeline`を使っているはずなので、指示通り、コメントを外しましょう。

``` ruby
load 'deploy'
# Uncomment if you are using Rails' asset pipeline
load 'deploy/assets'
load 'config/deploy' # remove this line to skip loading any of the default tasks
```

ここに落とし穴が。

別件なんですが、私は`config/database.yml`は`git`で管理してなくて、`symlink_database_yml`という別のタスクを作ってデプロイ時に`shared/config/database.yml`から取得しているのですが、これでハマった。(なので、普通の人はハマらないとおもいます。)

`load 'deploy/assets'`は`load 'config/deploy'`より後に記述しましょう。

``` ruby
load 'deploy'
# Uncomment if you are using Rails' asset pipeline
load 'config/deploy' # remove this line to skip loading any of the default tasks
load 'deploy/assets' # こいつが一番最後
```

さもないと、以下のようなエラーが出ます。

```
  * 2012-10-31 08:25:30 08:25:30 == Currently executing `deploy:assets:precompile'
  * executing "cd /home/takuyan/rails/sampleapp/releases/20121030232515 && bundle exec rake RAILS_ENV=production RAILS_GROUPS=assets assets:precompile"
    servers: ["sampleapp.com"]
    [sampleapp.takuyan.com] executing command
 ** [out :: sampleapp.com] rake aborted!
 ** [out :: sampleapp.com] No such file or directory - /home/takuyan/rails/sampleapp/releases/20121030232515/config/database.yml
 ** [out :: sampleapp.com]
 ** [out :: sampleapp.com] Tasks: TOP => environment
 ** [out :: sampleapp.com] (See full trace by running task with --trace)
    command finished in 3302ms
*** [deploy:update_code] rolling back
```

### config/deploy.rb

あとは、他で書かれている通り、以下を追記しておきます。

```  ruby
#
# rbenv configuration
#
set :default_environment, {
  'RBENV_ROOT' => '$HOME/.rbenv',
  'PATH' => "$HOME/.rbenv/shims:$HOME/.rbenv/bin:$PATH"
}
set :bundle_flags, "--deployment --quiet --binstubs --shebang ruby-local-exec"
```

