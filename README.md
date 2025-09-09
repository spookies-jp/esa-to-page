# esa to page

[esa.io](https://esa.io) の記事を外部に公開するための Next.js アプリケーション。Cloudflare Workers で動作します。

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mattyatea/esa-to-page)

## 概要

esa to page を使用すると、プライベートな esa ワークスペースから選択した記事のみを一般公開できます。社内ドキュメント、ブログ記事、ナレッジベースなどを外部に共有したいチームに最適です。

### 主な機能

- 🚀 **選択的公開** - 公開したい esa 記事のみを選択
- ⚡ **エッジデプロイ** - Cloudflare Workers でグローバルに高速配信
- 🔒 **OAuth 認証** - esa OAuth による安全な管理者アクセス
- 💾 **スマートキャッシング** - KV ベースの効率的なキャッシュ
- 📱 **レスポンシブデザイン** - あらゆるデバイスで美しく表示
- 🎨 **Markdown 対応** - esa の Markdown を完全サポート
- 🔄 **リアルタイム更新** - 記事をオンデマンドで更新

## 技術スタック

- **フレームワーク**: Next.js 15（App Router）
- **デプロイ**: OpenNext 経由で Cloudflare Workers
- **データベース**: Cloudflare D1
- **キャッシュ**: Cloudflare KV
- **スタイリング**: Tailwind CSS v4
- **言語**: TypeScript

## 必要要件

- Node.js 18 以上と npm
- Cloudflare アカウント
- API アクセス可能な esa.io ワークスペース
- Wrangler CLI (`npm install -g wrangler`)

## クイックスタート

### 1. クローンとインストール

```bash
git clone https://github.com/mattyatea/esa-to-page.git
cd esa-to-page
npm install
```

### 2. Cloudflare リソースの作成

```bash
# D1 データベースを作成
wrangler d1 create esa-to-page

# KV namespace を作成
wrangler kv:namespace create "ESA_CACHE"

# データベーススキーマを適用
wrangler d1 execute esa-to-page --file=./schema.sql
```

### 3. wrangler.jsonc の設定

`wrangler.jsonc` で作成したリソースの ID を更新：

```jsonc
{
  "d1_databases": [{
    "database_id": "YOUR_DATABASE_ID"
  }],
  "kv_namespaces": [{
    "id": "YOUR_KV_NAMESPACE_ID"
  }],
  "vars": {
    "ESA_WORKSPACE": "your-workspace-name"
  }
}
```

### 4. esa OAuth の設定

1. esa ワークスペースの設定画面へアクセス
2. 新しい OAuth アプリケーションを作成
3. リダイレクト URI を設定: `https://your-domain.com/api/auth/callback`
4. Client ID と Secret をメモ

### 5. シークレットの設定

```bash
# esa API アクセストークン
wrangler secret put ESA_ACCESS_TOKEN

# OAuth クレデンシャル
wrangler secret put ESA_CLIENT_ID
wrangler secret put ESA_CLIENT_SECRET

# セッションシークレット（生成コマンド: openssl rand -base64 32）
wrangler secret put SESSION_SECRET
```

### 6. デプロイ

```bash
npm run deploy
```

## 使い方

### 管理画面

1. `https://your-domain.com/admin` にアクセス
2. esa アカウントでサインイン
3. esa の URL を貼り付けて、スラグを選択して記事を追加
4. ダッシュボードから公開記事を管理

### 公開記事

公開された記事は以下の URL でアクセスできます：
```
https://your-domain.com/[slug]
```

## 開発

```bash
# ローカル開発（D1/KV なし）
npm run dev

# Cloudflare 環境でプレビュー
npm run preview

# 型チェック
npm run check

# リンティング
npm run lint
```

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API ルート
│   ├── admin/          # 管理画面
│   └── [slug]/         # 記事ページ
├── components/         # React コンポーネント
├── lib/               # コアユーティリティ
│   ├── auth.ts        # 認証
│   ├── cache.ts       # KV キャッシング
│   ├── db.ts          # データベース操作
│   └── esa-api.ts     # esa API クライアント
└── types/             # TypeScript 型定義
```

## 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `ESA_ACCESS_TOKEN` | esa API アクセストークン | Yes |
| `ESA_CLIENT_ID` | OAuth アプリケーション ID | Yes |
| `ESA_CLIENT_SECRET` | OAuth アプリケーションシークレット | Yes |
| `SESSION_SECRET` | セッション暗号化キー | Yes |
| `ESA_WORKSPACE` | esa ワークスペース名 | Yes |

## API エンドポイント

- `GET /api/articles` - 公開記事一覧を取得
- `POST /api/articles` - 新しい記事を公開
- `PUT /api/articles/[id]` - 記事設定を更新
- `DELETE /api/articles/[id]` - 記事の公開を取り消し
- `POST /api/articles/refresh/[slug]` - 記事キャッシュを更新

## キャッシュ戦略

記事は Cloudflare KV に 24 時間キャッシュされます。以下の場合に自動的に無効化されます：
- 管理画面から記事が更新された時
- 手動でリフレッシュがトリガーされた時
- 記事の公開が取り消された時

## セキュリティ

- 管理者アクセスには esa OAuth 認証が必要
- セッショントークンは暗号化され httpOnly で保護
- API エンドポイントは認証ミドルウェアで保護
- すべてのデータは Cloudflare アカウント内に保存

## コントリビューション

開発ガイドラインについては [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## ライセンス

MIT

## クレジット

以下の技術で構築されています：
- [Next.js](https://nextjs.org)
- [Cloudflare Workers](https://workers.cloudflare.com)
- [OpenNext](https://opennext.js.org)
- [esa.io](https://esa.io)
