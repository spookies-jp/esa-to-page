import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { generateOAuthUrl } from '@/lib/auth';

export async function GET(request: Request) {
  const { env } = getCloudflareContext();
  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/api/auth/callback`;
  
  const authUrl = generateOAuthUrl(env.ESA_CLIENT_ID, redirectUri);
  
  return NextResponse.redirect(authUrl);
}