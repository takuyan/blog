---
title: "Syntasticを使うときはzshenvにrbenvの設定を書きましょう"
date: 2012-11-08 08:38
comments: true
categories: [vim, rbenv, ruby]
---
まあ、vimからrbenv経由でrubyを呼び出すときは、Syntastic関係なく、zshenvに書きましょう。

## Syntastic

[Syntastic](https://github.com/scrooloose/syntastic) という優れものを昨日、知りました。

<img src='/images/2012/syntastic_screenshot.png' class="img-rounded img-responsive" />

> Image from Github [scrooloose/syntastic](https://github.com/scrooloose/syntastic)

いわゆる構文チェッカーです。デフォルトでは保存時にチェックをしてくれるようです。Vimなのに、もう殆どIDEですね。

> At the time of this writing, syntax checking plugins exist for applescript, c, coffee, cpp, css, cucumber, cuda, docbk, erlang, eruby, fortran, gentoo_metadata, go, haml, haskell, html, javascript, json, less, lua, matlab, perl, php, puppet, python, rst, ruby, sass/scss, sh, tcl, tex, vala, xhtml, xml, xslt, yaml, zpt

上記の通り、様々な言語に対応しているとのこと。

### 構文エラーじゃないのに！

<img src='/images/2012/invalid_syntax.png' class="img-rounded" />

あ、もしかして、1.9 styleのHashで怒られてる？

げ、もしかして、俺のVim、`.rbenv-local`を読んでなかった？

### rbenvの設定はzshenvに書かなきゃダメ

ちゃんと書いてありますから、ちゃんと読みましょう。はい、ごめんなさい。

``` sh
if [ -d ${HOME}/.rbenv  ] ; then
  export PATH="$HOME/.rbenv/bin:$PATH"
  eval "$(rbenv init -)"
fi
```

> Zsh note: Modify your ~/.zshenv file instead of ~/.bash_profile.
> [sstephenson/rbenv](https://github.com/sstephenson/rbenv#section_2.1)

<img src='/images/2012/valid_syntax.png' class="img-rounded" />

ちゃんと通ったみたい。めでたしめでたし。

#### 参考文献

[VimからrbenvのRubyが呼び出せない問題が発生してハマった](http://blog.glidenote.com/blog/2012/06/26/vim-zshenv-rbenv/)

## Vim as your IDE

[Vim as your IDE](http://haridas.in/vim-as-your-ide.html) という記事を読んだのですが、Vimでもプラグインを使えばEclipseに負けないほどのIDEになるってのは驚きですね。

確かに、プラグインが充実しているのでVimでもIDEとして使うことができうると思います。

でも私は「VimをIDEとして使う」のではなく「VimはいつでもIDEとして使える」という軽量級なのに重量級な戦いもできるVimがやっぱり好きですねぇ。


