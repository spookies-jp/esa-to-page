export interface PublishedArticle {
  id: number;
  slug: string;
  esa_post_id: number;
  workspace: string;
  esa_url: string;
  created_at: string;
  updated_at: string;
  title?: string;
  excerpt?: string;
  tags?: string[];
  category?: string;
}

export interface CreateArticleInput {
  esaUrl: string;
  slug: string;
}

export interface UpdateArticleInput {
  esaUrl?: string;
  slug?: string;
}
