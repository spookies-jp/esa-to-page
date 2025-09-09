import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { exchangeCodeForToken, setSession } from '@/lib/auth';
import { createEsaApiClient } from '@/lib/esa-api';

export async function GET(request: Request) {
  const { env } = getCloudflareContext();
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=no_code`);
  }
  
  try {
    const redirectUri = `${origin}/api/auth/callback`;
    const tokenData = await exchangeCodeForToken(
      code,
      env.ESA_CLIENT_ID,
      env.ESA_CLIENT_SECRET,
      redirectUri
    );
    
    const client = createEsaApiClient(tokenData.access_token, env.ESA_WORKSPACE);
    const user = await client.getCurrentUser();
    
    await setSession({
      user,
      workspace: env.ESA_WORKSPACE,
    });
    
    return NextResponse.redirect(`${origin}/admin`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`);
  }
}