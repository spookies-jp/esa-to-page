# Contributing to esa to page

esa to page への貢献をありがとうございます！このガイドラインに従って、プロジェクトに貢献してください。

## 行動規範

このプロジェクトでは、すべての参加者が敬意を持って協力的な環境を維持することを期待しています。

## 貢献の方法

### バグ報告

1. 既存の Issue に同じ問題がないか確認
2. 新しい Issue を作成し、以下を含める：
   - 明確で説明的なタイトル
   - 再現手順
   - 期待される動作
   - 実際の動作
   - 環境情報（OS、ブラウザ、Node.js バージョンなど）

### 機能提案

1. 既存の Issue に同じ提案がないか確認
2. 新しい Issue を作成し、以下を含める：
   - 機能の詳細な説明
   - なぜこの機能が必要か
   - 可能な実装方法

### プルリクエスト

1. プロジェクトをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/mattyatea/esa-to-page.git
cd esa-to-page

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

## コーディング規約

### TypeScript

- 厳格な型付けを使用
- `any` 型の使用を避ける
- インターフェースと型エイリアスを適切に使用

### React/Next.js

- 関数コンポーネントを使用
- React Hooks を適切に使用
- Server Components と Client Components を適切に使い分ける

### スタイル

- Tailwind CSS のユーティリティクラスを使用
- カスタム CSS は最小限に
- レスポンシブデザインを考慮

### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) に従ってください：

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメントのみの変更
- `style:` コードの意味に影響しない変更
- `refactor:` バグ修正や機能追加を含まないコード変更
- `perf:` パフォーマンス改善
- `test:` テストの追加や修正
- `chore:` ビルドプロセスやツールの変更

例：
```
feat: 記事のプレビュー機能を追加
fix: 管理画面でのログイン失敗を修正
docs: README にセットアップ手順を追加
```

## テスト

プルリクエストを送信する前に、以下を確認してください：

```bash
# 型チェック
npm run check

# リンティング
npm run lint

# ビルド
npm run build

# プレビュー環境でテスト
npm run preview
```

## プルリクエストのレビュープロセス

1. CI のチェックがすべて通過していることを確認
2. コードレビューを受ける
3. フィードバックに対応
4. 承認後、メンテナーがマージ

## リリースプロセス

1. `main` ブランチへのマージ後、自動的にバージョンタグが作成されます
2. GitHub Actions により自動的にデプロイされます

## 質問がある場合

- Issue を作成して質問
- ディスカッションセクションを使用
- メンテナーに直接連絡

## ライセンス

貢献することで、あなたのコードが MIT ライセンスの下でライセンスされることに同意したことになります。

## 謝辞

時間を割いて貢献してくださることに感謝します！ 🎉