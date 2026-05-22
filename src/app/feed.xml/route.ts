import { blogPosts, SITE_URL, EMAIL } from "@/lib/data";

export async function GET() {
  const items = blogPosts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/en/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/en/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      ${post.tags.map((t) => `<category><![CDATA[${t}]]></category>`).join("")}
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ossama Elhakki — AI Engineer Blog</title>
    <link>${SITE_URL}</link>
    <description>Deep-dive articles on machine learning, computer vision, NLP, and AI automation by Ossama Elhakki.</description>
    <language>en-us</language>
    <managingEditor>${EMAIL} (Ossama Elhakki)</managingEditor>
    <webMaster>${EMAIL} (Ossama Elhakki)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/og-image.png</url>
      <title>Ossama Elhakki Blog</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
