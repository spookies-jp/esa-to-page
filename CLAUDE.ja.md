# CLAUDE.ja.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリのコードを扱う際のガイダンスを提供します。

## プロジェクト概要

esa to page は、選択した esa.io の記事を一般公開するための Next.js 15 アプリケーションです。OpenNext を使用して Cloudflare Workers にデプロイされ、公開記事を管理するための安全な管理画面を提供します。

## 主な目的

- esa.io の記事を選択的に公開してアクセス可能にする
- OAuth ベースの管理画面で記事を管理
- Cloudflare KV で記事をキャッシュして最適なパフォーマンスを実現
- シンタックスハイライト付きの完全な esa マークダウンレンダリングをサポート

## 開発コマンド

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動（ポート 3000）
npm run dev

# プロダクションビルドを作成
npm run build

# Cloudflare Workers ビルドをローカルでプレビュー
npm run preview

# Cloudflare Workers にデプロイ
npm run deploy

# リンティングを実行
npm run lint

# 型チェック
npm run check

# Cloudflare の型を生成
npm run cf-typegen
```

## アーキテクチャ

### コアスタック
- **フレームワーク**: Next.js 15.3.3（App Router）
- **デプロイ**: OpenNext アダプター経由で Cloudflare Workers
- **データベース**: 記事メタデータ用の Cloudflare D1
- **キャッシュ**: 記事コンテンツ用の Cloudflare KV
- **スタイリング**: PostCSS を使用した Tailwind CSS v4.1.1
- **言語**: strict モードを有効にした TypeScript
- **認証**: esa OAuth 2.0

### プロジェクト構造
```
/src/
├── app/                    # Next.js App Router
│   ├── [slug]/            # 動的記事ページ
│   ├── admin/             # 管理画面
│   │   ├── components/    # 管理 UI コンポーネント
│   │   └── login/        # OAuth ログインページ
│   ├── api/              # API ルート
│   │   ├── articles/     # 記事の CRUD 操作
│   │   └── auth/         # OAuth コールバック
│   ├── layout.tsx        # ルートレイアウト
│   └── page.tsx          # 記事一覧のホームページ
├── components/           # 共有 React コンポーネント
│   ├── ArticleCard.tsx   # 記事プレビューカード
│   ├── ArticleRenderer.tsx # マークダウンレンダラー
│   ├── Header.tsx        # サイトヘッダー
│   └── Footer.tsx        # サイトフッター
├── lib/                  # コアユーティリティ
│   ├── auth.ts          # OAuth とセッション処理
│   ├── cache.ts         # KV キャッシュ操作
│   ├── db.ts            # D1 データベースクエリ
│   └── esa-api.ts       # esa API クライアント
└── types/               # TypeScript 定義
    ├── article.ts       # 記事インターフェース
    └── esa.ts          # esa API 型
```

### 主要機能の実装

#### 認証フロー
1. 管理者が「esa でログイン」をクリック → esa OAuth にリダイレクト
2. esa がコード付きでリダイレクト → アクセストークンと交換
3. 暗号化されたセッションクッキーを作成 → 管理画面にリダイレクト
4. すべての管理ルートでセッションの有効性をチェック

#### 記事公開フロー
1. 管理者が esa URL を入力（例：`https://workspace.esa.io/posts/123`）
2. システムがワークスペースと投稿 ID を解析
3. esa API 経由で記事を取得
4. メタデータを D1 に、コンテンツを KV に保存
5. 記事が `/[slug]` でアクセス可能になる

#### キャッシュ戦略
- 記事は KV に 24 時間キャッシュ
- キャッシュキー：`esa_article_${workspace}_${postId}`
- 管理画面から手動リフレッシュ可能
- 記事更新時に自動無効化

### データベーススキーマ

```sql
CREATE TABLE published_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  esa_post_id INTEGER NOT NULL,
  workspace TEXT NOT NULL,
  esa_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 環境変数とシークレット

Cloudflare Workers で必要：
- `ESA_ACCESS_TOKEN` - esa API の個人アクセストークン
- `ESA_CLIENT_ID` - OAuth アプリケーションのクライアント ID
- `ESA_CLIENT_SECRET` - OAuth アプリケーションのクライアントシークレット
- `SESSION_SECRET` - セッション暗号化用のランダム文字列
- `ESA_WORKSPACE` - esa ワークスペース名（vars 内）

### API エンドポイント

#### パブリック
- `GET /[slug]` - 公開記事を表示
- `GET /` - 全公開記事を一覧表示

#### 保護されている（認証が必要）
- `GET /api/articles` - 公開記事一覧（JSON）
- `POST /api/articles` - 新規記事を公開
- `PUT /api/articles/[id]` - 記事のスラグを更新
- `DELETE /api/articles/[id]` - 記事の公開を取り消し
- `POST /api/articles/refresh/[slug]` - 記事キャッシュをリフレッシュ

#### 認証
- `GET /api/auth/login` - OAuth フローを開始
- `GET /api/auth/callback` - OAuth コールバックハンドラー
- `POST /api/auth/logout` - セッションをクリア

### 開発ガイドライン

1. **TypeScript**: 厳格な型付けを使用、`any` を避ける
2. **コンポーネント**: サーバーコンポーネントを優先、必要な場合のみクライアントコンポーネントを使用
3. **スタイリング**: Tailwind ユーティリティを使用、カスタム CSS を避ける
4. **エラーハンドリング**: API エラーを常に適切に処理
5. **セキュリティ**: シークレットを公開しない、すべての入力を検証

### ローカルテスト

開発モード（`npm run dev`）の制限事項：
- D1/KV へのアクセス不可（プレースホルダーメッセージを表示）
- 実際の OAuth なし（テストにはプレビューモードを使用）

ローカル Cloudflare 環境で完全な機能を使用するには、プレビューモード（`npm run preview`）を使用してください。

### デプロイプロセス

1. `npm run build` - Next.js プロダクションビルドを作成
2. OpenNext が Cloudflare Workers 用に変換
3. `npm run deploy` - Wrangler が Cloudflare にデプロイ
4. 設定されたカスタムドメインまたは `*.workers.dev` でアクセス

### 一般的なタスク

#### 新しい API エンドポイントを追加
1. `/src/app/api/` にルートファイルを作成
2. env アクセス用に `getCloudflareContext` をインポート
3. 必要に応じて認証チェックを追加
4. 適切なステータスコードでエラーを処理

#### 記事レンダリングを変更
1. `/src/components/ArticleRenderer.tsx` を編集
2. スタイルは `/src/app/globals.css` に記述
3. 様々な esa マークダウン機能でテスト

#### 管理 UI を更新
1. コンポーネントは `/src/app/admin/components/` 内
2. フォームとモーダルの既存パターンに従う
3. 一貫性のために Tailwind クラスを使用

### トラブルシューティング

- **「開発環境で D1 を読み取れません」**: `npm run preview` を使用
- **OAuth リダイレクトが失敗**: コールバック URL の設定を確認
- **記事が更新されない**: KV キャッシュをクリアまたはリフレッシュボタンを使用
- **ビルドが失敗**: TypeScript エラーのために `npm run check` を実行