# GraphQL

hpapp ではコードファーストのアプローチを利用して GraphQL を開発します。これはいくつかの理由があります。

- 多くの service コードが GraphQL のフレームワークに依存することを避けるため
- service コードを変更した際にスキーマの変更忘れを防ぐため
- 常に servce コードを先に開発することで実装の実現可能性を早期に判断するため
- データベースのフレームワークとして entgo を採用しているので、ent のスキーマ定義から必要なファイルを生成

コードファーストアプローチを実現するために Go の静的解析パッケージを利用して、GraphQL のスキーマを生成します。Go の各 type が GraphQL の type/scalar/enum/interface に対応するように定義することで、GraphQL のスキーマを生成します。詳細なマッピングについては、[devtool/generator/graphql](../../devtool/generator/graphql/) を参照してください。
