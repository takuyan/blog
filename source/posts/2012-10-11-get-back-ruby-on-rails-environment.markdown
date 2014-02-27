---
title: "Rails-on-Mac開発環境構築"
date: 2012-10-11 13:00
comments: true
tags: [rails, mac]
---

先日、[Macbookが壊れた](/blog/2012/09/28/smart-error/)際、どうせならイチから環境構築しようと思い、バックアップを取らずに修理をお願いしました。
このMacbookProを開発モードにするべく、以下の作業を行いました。

所要時間は、光回線で、3時間くらい。

READMORE

## 必須作業編

### Mountain Lion インストール

通常通り、Mac App Store で購入してダウンロード・インストール。

[Mountain Lion](http://itunes.apple.com/jp/app/os-x-mountain-lion/id537386512?ls=1&mt=12)

### Xcode インストール

こちらも通常通り、Mac App Store で購入してダウンロード・インストール。

[Xcode](http://itunes.apple.com/jp/app/xcode/id497799835?mt=12)

その後、シミュレーターやコマンドラインツールを追加でダウンロード

#### preference &gt; Download &gt; Componets

- iOS 5.1 Simulator
- iOS 5.0 Simulator
- Command Line Tools

### Homebrew インストール

    $ brew install zsh git sqlite mysql postgresql redis imagemagick qt

- zsh (chshもすること)
- git
- sqlite
- mysql
- postgresql
- redis
- imagemagick
- qt

### Growl

[Growl](http://growl.info/)


#### Growl Notify

[Growl - Download ページの右下の方](http://growl.info/downloads)

# ユーティリティ編

- [Chrome](http://www.google.com/chrome/intl/ja/landing.html)
- [Firefox](http://www.mozilla.jp/firefox/)
- [Filezilla](http://filezilla-project.org/)
- [TotalFinder](http://totalfinder.binaryage.com/)
- [TotalTerminal](http://totalterminal.binaryage.com/)
- [Macvim - Kaoriya](http://code.google.com/p/macvim-kaoriya/)
- [自分のdotfiles](https://github.com/takuyan/dotfiles)
- [neobundle.vim](https://github.com/Shougo/neobundle.vim)

#### neobundle.vim でプラグイン管理

    $ mkdir -p ~/.vim/bundle
    $ git clone git://github.com/Shougo/neobundle.vim ~/.vim/bundle/neobundle.vim

#### vimproc は該当ディレクトで以下を実行しておくこと

    $ make -f make_mac.mak

vim上で `:NeoBundleInstall` を実行してvimプラグインをインストールする

# Ruby編

### [Pow](http://pow.cx/)

    $ curl get.pow.cx | sh

### [rbenv](https://github.com/sstephenson/rbenv)

    $ cd
    $ git clone git://github.com/sstephenson/rbenv.git .rbenv

    # dotfilesある場合は不要
    $ echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.zshrc

### [ruby-build](https://github.com/sstephenson/ruby-build)

    $ mkdir -p ~/.rbenv/plugins
    $ cd ~/.rbenv/plugins
    $ git clone git://github.com/sstephenson/ruby-build.git

### rubyのインストール

    $ rbenv install 1.9.3-p194
    $ rbenv install 1.9.3-p125

### 既存Railsプロジェクトでbundle install

    $ cd ~/my/rails/application
    $ gem install bundler
    $ bundle install


