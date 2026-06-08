import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOST = "ossamaelhakki.com";
const KEY = process.env.INDEXNOW_KEY || "8e4b1d7a9c2f43e6b0a5d8c1f6e3a92b";

/**
 * IndexNow submitter, callable by Vercel Cron (or manually).
 * Reads the live sitemap and notifies Bing/Yandex/Seznam of all URLs.
 * If CRON_SECRET is set, the request must include `Authorization: Bearer <CRON_SECRET>`
 * (Vercel Cron sends this automatically).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const xml = await (await fetch(`${SITE_URL}/sitemap.xml`, { cache: "no-store" })).text();
    const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (!urlList.length) {
      return NextResponse.json({ error: "no URLs in sitemap" }, { status: 500 });
    }

    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `${SITE_URL}/${KEY}.txt`,
        urlList,
      }),
    });

    return NextResponse.json({ submitted: urlList.length, indexnowStatus: res.status });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
