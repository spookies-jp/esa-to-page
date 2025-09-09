export function getRuntime() {
  // @ts-expect-error globalThis.__env is Cloudflare specific
  if (typeof globalThis.__env !== 'undefined') {
    // Cloudflare Workers runtime
    // @ts-expect-error globalThis.__env is Cloudflare specific
    return globalThis.__env as CloudflareEnv;
  }
  
  // Development fallback
  return {
    DB: undefined,
    KV: undefined,
    ASSETS: undefined,
    ESA_ACCESS_TOKEN: process.env.ESA_ACCESS_TOKEN || '',
    ESA_WORKSPACE: process.env.ESA_WORKSPACE || '',
    ESA_CLIENT_ID: process.env.ESA_CLIENT_ID || '',
    ESA_CLIENT_SECRET: process.env.ESA_CLIENT_SECRET || '',
    SESSION_SECRET: process.env.SESSION_SECRET || '',
  } as unknown as CloudflareEnv;
}

export function isProductionRuntime(): boolean {
  // @ts-expect-error globalThis.__env is Cloudflare specific
  return typeof globalThis.__env !== 'undefined';
}