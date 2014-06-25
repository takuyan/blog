---
title: Railsで一度に全部処理するときのRoutes問題
date: 2014-06-25 17:00 JST
tags: rails, rest
thumb: /images/2014/rails_guides_outside_in.png
---

TODO管理をするとして「すべてのタスクを削除したい」とか「すべてのタスクを終了にしたい」っていう要件、普通によくありますね。  
これって簡単なくせに「どうあるべきなの？」と迷うことが多くて悩んでいたところ、[@tkawa](https://twitter.com/tkawa)さんが[サクッと解決してくれた](https://twitter.com/katton/status/478069723817472000)のでここに残しておきます。

READMORE

## 考え方と使われ方

すべてのリソースに対するアクションなので`DELETE /tasks`とか`PUT /tasks`で済ませたいというREST脳が働きますね。  
どうやって使いたいか、というと、こんな感じ。

### app/views/tasks/index.html.erb

普段はHamlですけど、今回はERBで（手抜き）

``` erb
<h1>Listing Tasks</h1>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Memo</th>
      <th>Done</th>
      <th colspan="3"></th>
    </tr>
  </thead>

  <tbody>
    <% @tasks.each do |task| %>
      <tr>
        <td><%= task.name %></td>
        <td><%= task.memo %></td>
        <td><%= task.done %></td>
        <td><%= link_to 'Show', task %></td>
        <td><%= link_to 'Edit', edit_task_path(task) %></td>
        <td><%= link_to 'Destroy', task, method: :delete, data: { confirm: 'Are you sure?' } %></td>
      </tr>
    <% end %>
  </tbody>
</table>

<br>

<%= link_to 'New Task', new_task_path %>
<%= link_to 'Destroy All', tasks_path, method: :delete %>
<%= link_to 'Done All', tasks_path(task: {done: true}), method: :put %>
```

もちろん注目すべきはココですね。

``` erb
<%= link_to 'New Task', new_task_path %>
<%= link_to 'Destroy All', tasks_path, method: :delete %>
<%= link_to 'Done All', tasks_path(task: {done: true}), method: :put %>
```

はい、これがシンプルです。  
これがやりたいです。  
これにしましょう。

## Routesの設計

まず「すべて削除」「すべて更新」を`config/routes.rb`で表現します。  
これは`tasks`というリソースに対する`DELETE`および`PUT`操作ですので、次のように書きました。

### config/routes.rb

``` ruby
Rails.application.routes.draw do
  resources :tasks
  delete :tasks, to: 'tasks#destroy_all'
  put :tasks, to: 'tasks#update_all'
  root to: 'tasks#index'
end
```

これがどのようなURLになるか、見てみましょう。

```
$ rake routes
   Prefix Verb   URI Pattern               Controller#Action
    tasks GET    /tasks(.:format)          tasks#index
          task   /tasks(.:format)          tasks#create
 new_task GET    /tasks/new(.:format)      tasks#new
edit_task GET    /tasks/:id/edit(.:format) tasks#edit
     task GET    /tasks/:id(.:format)      tasks#show
          PATCH  /tasks/:id(.:format)      tasks#update
          PUT    /tasks/:id(.:format)      tasks#update
          DELETE /tasks/:id(.:format)      tasks#destroy
          DELETE /tasks(.:format)          tasks#destroy_all
          PUT    /tasks(.:format)          tasks#update_all
     root GET    /                         tasks#index
```

とってもスッキリですね！

なお、昔は次のように書いていました。  
これでも同じ用に使えるとは思いますが、すごいモヤモヤ感があったので、いまでは上のようなやり方にしています。

``` ruby
# モヤモヤver
Rails.application.routes.draw do
  resources :tasks do
    collection do
      delete :destroy_all
      put :update_all
    end
  end
  root to: 'tasks#index'
end
```

## コントローラ側の実装

さて、コントローラを実装します。
ここでは大雑把にやりますが、実際に作りこむ際は次の点を注意するようにしましょう。

- [トランザクションの問題 (All or Nothingにしたいところ)](http://api.rubyonrails.org/classes/ActiveRecord/Transactions/ClassMethods.html)
- [どのフォーマットで返すのか (formatごとのアレ)](http://api.rubyonrails.org/classes/ActionController/Responder.html)

### app/controllers/tasks_controller.rb

``` ruby
class TasksController < ApplicationController
  # ...

  def destroy_all
    Task.destroy_all
    redirect_to root_path
  end

  def update_all
    Task.update_all(task_params)
    redirect_to root_path
  end

  # ...

  private

  def task_params
    params.require(:task).permit(:name, :memo, :done)
  end
end
```

なお、検証環境は以下のとおりです。

- Ruby 2.1.2
- Rails 4.1

## 関連記事

- [単一項目のみを更新するRailsパターンを探る](posts/2013/02/18/one-attribute-update-best-practice-in-rails/)
- [Railsのリスト操作におけるURL設計](/posts/2013/02/25/move-position-resources-best-practices/)
