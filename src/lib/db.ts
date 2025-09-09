import { PublishedArticle, CreateArticleInput } from '@/types/article';
import { ParsedEsaUrl } from '@/types/esa';

export function parseEsaUrl(url: string): ParsedEsaUrl | null {
  const match = url.match(/https:\/\/([^.]+)\.esa\.io\/posts\/(\d+)/);
  if (!match) return null;
  
  return {
    workspace: match[1],
    postId: parseInt(match[2], 10)
  };
}

export async function getArticleBySlug(
  db: D1Database,
  slug: string
): Promise<PublishedArticle | null> {
  const result = await db
    .prepare('SELECT * FROM published_articles WHERE slug = ?')
    .bind(slug)
    .first<PublishedArticle>();
  
  return result;
}

export async function getArticleById(
  db: D1Database,
  id: number
): Promise<PublishedArticle | null> {
  const result = await db
    .prepare('SELECT * FROM published_articles WHERE id = ?')
    .bind(id)
    .first<PublishedArticle>();
  
  return result;
}

export async function getAllArticles(
  db: D1Database
): Promise<PublishedArticle[]> {
  const result = await db
    .prepare('SELECT * FROM published_articles ORDER BY created_at DESC')
    .all<PublishedArticle>();
  
  return result.results || [];
}

export async function createArticle(
  db: D1Database,
  input: CreateArticleInput
): Promise<PublishedArticle> {
  const parsed = parseEsaUrl(input.esaUrl);
  if (!parsed) {
    throw new Error('Invalid esa URL format');
  }
  
  const result = await db
    .prepare(`
      INSERT INTO published_articles (slug, esa_post_id, workspace, esa_url, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `)
    .bind(input.slug, parsed.postId, parsed.workspace, input.esaUrl)
    .run();
  
  if (!result.meta.last_row_id) {
    throw new Error('Failed to create article');
  }
  
  const article = await getArticleById(db, result.meta.last_row_id);
  if (!article) {
    throw new Error('Failed to retrieve created article');
  }
  
  return article;
}

export async function updateArticle(
  db: D1Database,
  id: number,
  input: { esaUrl?: string; slug?: string }
): Promise<PublishedArticle> {
  const existing = await getArticleById(db, id);
  if (!existing) {
    throw new Error('Article not found');
  }
  
  const updates: string[] = ['updated_at = datetime(\'now\')'];
  const values: (string | number)[] = [];
  
  if (input.esaUrl) {
    const parsed = parseEsaUrl(input.esaUrl);
    if (!parsed) {
      throw new Error('Invalid esa URL format');
    }
    updates.push('esa_url = ?', 'esa_post_id = ?', 'workspace = ?');
    values.push(input.esaUrl, parsed.postId, parsed.workspace);
  }
  
  if (input.slug) {
    updates.push('slug = ?');
    values.push(input.slug);
  }
  
  values.push(id);
  
  await db
    .prepare(`UPDATE published_articles SET ${updates.join(', ')} WHERE id = ?`)
    .bind(...values)
    .run();
  
  const article = await getArticleById(db, id);
  if (!article) {
    throw new Error('Failed to retrieve updated article');
  }
  
  return article;
}

export async function deleteArticle(
  db: D1Database,
  id: number
): Promise<void> {
  await db
    .prepare('DELETE FROM published_articles WHERE id = ?')
    .bind(id)
    .run();
}