import "server-only";

import { createClient } from "@supabase/supabase-js";

const URL_ENV_NAMES = ["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"];
const SERVICE_ROLE_ENV_NAME = "SUPABASE_SERVICE_ROLE_KEY";

function pickEnv(names) {
  for (const name of names) {
    const value = process.env[name];
    if (value) {
      return { name, value };
    }
  }

  return { name: null, value: "" };
}

export function getSupabaseConfig() {
  const url = pickEnv(URL_ENV_NAMES);
  const serviceRoleKey = process.env[SERVICE_ROLE_ENV_NAME] || "";
  const missingVars = [];

  if (!url.value) {
    missingVars.push(URL_ENV_NAMES[0]);
  }

  if (!serviceRoleKey) {
    missingVars.push(SERVICE_ROLE_ENV_NAME);
  }

  return {
    url: url.value,
    urlEnvName: url.name,
    serviceRoleKey,
    missingVars,
    ready: missingVars.length === 0
  };
}

export function getSupabaseStatus() {
  const config = getSupabaseConfig();

  return {
    mode: config.ready ? "supabase" : "memory",
    ready: config.ready,
    missingVars: config.missingVars,
    urlEnvName: config.urlEnvName,
    usesLegacyPublicUrlFallback: config.urlEnvName === "NEXT_PUBLIC_SUPABASE_URL"
  };
}

export function getSupabaseAdmin() {
  const config = getSupabaseConfig();
  if (!config.ready) return null;

  if (!globalThis.__dakerBoardSupabaseAdmin) {
    globalThis.__dakerBoardSupabaseAdmin = createClient(config.url, config.serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  return globalThis.__dakerBoardSupabaseAdmin;
}
