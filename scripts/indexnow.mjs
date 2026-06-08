#!/usr/bin/env node
/**
 * IndexNow submitter — notifies Bing, Yandex, Seznam, etc. of new/updated URLs.
 * (Google does not use IndexNow but discovers via sitemap + Search Console.)
 *
 * Usage:
 *   node scripts/indexnow.mjs            # fetch live sitemap and submit all URLs
 *   node scripts/indexnow.mjs --dry      # print the payload, submit nothing
 *
 * Run it as a post-deploy step (CI / Vercel deploy hook / GitHub Action).
 */

const HOST = "ossamaelhakki.com";
const KEY = process.env.INDEXNOW_KEY || "8e4b1d7a9c2f43e6b0a5d8c1f6e3a92b";
const SITE = `https://${HOST}`;
// Where to read the sitemap from (override for local testing).
const SITEMAP_ORIGIN = process.env.INDEXNOW_SITEMAP_ORIGIN || SITE;
const DRY = process.argv.includes("--dry");

async function getUrls() {
  const res = await fetch(`${SITEMAP_ORIGIN}/sitemap.xml`, { headers: { "User-Agent": "indexnow-script" } });
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const urlList = await getUrls();
  if (!urlList.length) throw new Error("no URLs found in sitemap");
  console.log(`Found ${urlList.length} URLs.`);

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  };

  if (DRY) {
    console.log(JSON.stringify(body, null, 2).slice(0, 1200) + "\n…(dry run, nothing submitted)");
    return;
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow responded: ${res.status} ${res.statusText}`);
  if (!res.ok && res.status !== 202) process.exit(1);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
