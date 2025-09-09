export interface EsaPost {
  number: number;
  name: string;
  body_md: string;
  body_html: string;
  category: string;
  tags: string[];
  updated_at: string;
  created_at: string;
  url: string;
  message?: string;
  user?: {
    name: string;
    screen_name: string;
    icon: string;
  };
}

export interface EsaUser {
  id: number;
  name: string;
  screen_name: string;
  email: string;
  icon: string;
}

export interface ParsedEsaUrl {
  workspace: string;
  postId: number;
}