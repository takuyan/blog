---
title: "Podcast Publisher が Mountain Lion から消し去られた件について"
date: 2012-10-15 20:09
comments: true
categories: mac
---

{% img /images/2012/PodcastPublisher.png %}

from [www.haxconnect24.com](http://www.haxconnect24.com/HaxConnect24/The_Hax_Cast/The_Hax_Cast.html)

[Podcast Publisher](http://www.apple.com/jp/support/lionserver/podcast/) は、iMac(Lion)にプリインストールされていたツールである。
ただ、インストールされていたことすら、気づいていない人も多いと思う。
場所としては、LaunchPadの「その他」のフォルダに入っていて、「ターミナル」「DVDプレーヤー」「キーチェーンアクセス」などに紛れていた。


Mountain Lion にバージョンアップしたあと開いていなかったが、起動しようとしたところ、どこにも見当たらない。
`grep`しても見当たらないので、これはおかしいと思い、アップルのサポートに連絡した結果、シニアサポートアドバイザーの方まで繋がってお話を伺えたので、その顛末をメモしておこうと思う。

## 結論から書く

{% img /images/2012/podcastheader-670x525.png %}

from [9to5mac.com](http://9to5mac.com/2011/02/26/podcast-publisher-lets-your-run-your-own-shows-debuts-in-10-7-lion/)

Mountain Lion にバージョンアップした時点でツールは削除され、同時にデータもすべて削除された。 これらのデータは、[Time Machine](http://ja.wikipedia.org/wiki/Time_Machine_(%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2))などでバックアップを取っていない限り、復旧することはできない。

残念でした。

## どのように使っていたか

### Podcast Publisherはよくできていた

iMacのインカメラに向かって子供たちに「今日あったこと」などを語らせていた。2011/08に購入したはずなので、一年以上である。
だから、Podcast Publisherといっても、実際にPodcastで何かを配信していたわけではない。

ツール自体は削除されてしまったとしても**データだけはどうしても復旧したかった**。

## 想定されるプロユーザからの反論

### Time Machine使わないほうが悪い

生粋のAppleファンなら「[Time Machine](http://ja.wikipedia.org/wiki/Time_Machine_(%E3%82%BD%E3%83%95%E3%83%88%E3%82%A6%E3%82%A7%E3%82%A2))を使わないほうがおかしい」と言われそうな事案ではある。

それでも、ユーザのデータを、断りもなしに削除するという今回の方針は、ユーザに対してあまりにも不誠実ではあるまいか。

### 保存場所を指定しなかったの？

Podcast Publisher は本当によくできていて、動画を撮影後、即座に、そのサムネイルがコルクボードに乗っかるような動作をしていた。

普段であれば「データの保存場所」について考えないわけがない。
だが、この「データの保存場所を考えさせない、すばらしいUI」によって、まったくもって油断してしまったのだ。

この点については、重大な反省点だと思う。

## 現在ではLion Serverに付属

サポート曰く、「Lionにプリインストールされているはずはない」とのことだった。

いや、入ってたんだよ！
MacAppStoreとかAppleStoreへの発注時のカスタマイズなどの履歴も見たけど、Serverを購入した形跡はありませんでした。

## データ

下記ディレクトリにはその名の通り、各アプリケーションで使用するデータが保存されている模様。
シニアサポートアドバイザーさん曰く、可能性があるとしたら「ここです」とのこと。

    $HOME/Library/Saved Application State/com.apple.[PodcastPublisher関連の名前]

## Appleに伝えたい

.
.
.

# 人のデータを勝手に消すな。

傲慢にも程があるだろうが。


