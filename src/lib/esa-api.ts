import { EsaPost, EsaUser } from '@/types/esa';

export class EsaApiClient {
  private accessToken: string;
  private workspace: string;
  private baseUrl: string;

  constructor(accessToken: string, workspace: string) {
    this.accessToken = accessToken;
    this.workspace = workspace;
    this.baseUrl = `https://api.esa.io/v1/teams/${workspace}`;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Resource not found');
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getPost(postId: number): Promise<EsaPost> {
    return this.request<EsaPost>(`/posts/${postId}`);
  }

  async getCurrentUser(): Promise<EsaUser> {
    // esa API doesn't have team-specific user endpoint, use general API
    const response = await fetch('https://api.esa.io/v1/user', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Resource not found');
      }
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export function createEsaApiClient(accessToken: string, workspace: string): EsaApiClient {
  return new EsaApiClient(accessToken, workspace);
}