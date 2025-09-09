# esa to page セットアップガイド

このプロジェクトは、esaの記事を外部に公開するためのNext.js + Cloudflare Workersアプリケーションです。

## セットアップ手順

### 1. Cloudflare D1データベースの作成

```bash
# D1データベースを作成
wrangler d1 create esa-to-page

# 作成されたデータベースIDをメモしておく
```

### 2. データベーススキーマの適用

```bash
# スキーマを適用
wrangler d1 execute esa-to-page --file=./schema.sql
```

### 3. Cloudflare KV Namespaceの作成

```bash
# KV Namespaceを作成
wrangler kv:namespace create "ESA_CACHE"

# 作成されたNamespace IDをメモしておく
```

### 4. wrangler.jsonc の設定

`wrangler.jsonc`ファイルを編集し、以下の値を更新：

- `d1_databases[0].database_id`: 手順1で作成したデータベースID
- `kv_namespaces[0].id`: 手順3で作成したNamespace ID
- `vars.ESA_WORKSPACE`: あなたのesaワークスペース名

### 5. esa OAuthアプリケーションの作成

1. esaの設定画面にアクセス
2. 「アプリケーション」→「新規作成」
3. 以下の情報を入力：
   - アプリケーション名: esa to page
   - リダイレクトURI: `https://your-domain.com/api/auth/callback`
   - スコープ: read, write
4. 作成後、Client IDとClient Secretをメモ

### 6. 環境変数（シークレット）の設定

```bash
# esa APIアクセストークン
wrangler secret put ESA_ACCESS_TOKEN
# → esaの個人設定から発行したアクセストークンを入力

# OAuth Client ID
wrangler secret put ESA_CLIENT_ID
# → 手順5で取得したClient IDを入力

# OAuth Client Secret
wrangler secret put ESA_CLIENT_SECRET
# → 手順5で取得したClient Secretを入力

# セッション管理用シークレット
wrangler secret put SESSION_SECRET
# → ランダムな文字列を生成して入力（例: openssl rand -base64 32）
```

### 7. 依存関係のインストールとビルド

```bash
# 依存関係をインストール
npm install

# アプリケーションをビルド
npm run build
```

### 8. デプロイ

```bash
# Cloudflare Workersにデプロイ
npm run deploy
```

## 使い方

### 管理画面へのアクセス

1. `https://your-domain.com/admin`にアクセス
2. esaアカウントでログイン
3. 記事のURLとSlugを入力して公開

### 記事の表示

公開した記事は`https://your-domain.com/[slug]`でアクセスできます。

## トラブルシューティング

### ログインできない場合

- OAuth設定のリダイレクトURIが正しいか確認
- ESA_WORKSPACEが正しく設定されているか確認

### 記事が表示されない場合

- D1データベースに記事が登録されているか確認
- esaのアクセストークンが有効か確認
- KVキャッシュをクリアしてみる

## 開発環境での実行

```bash
# 開発サーバーを起動
npm run dev

# プレビュー（Cloudflare Workers環境をローカルで再現）
npm run preview
```