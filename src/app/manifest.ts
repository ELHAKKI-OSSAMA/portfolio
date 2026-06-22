import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ossama Elhakki | AI Engineer",
    short_name: "ossamaelhakki.com",
    description:
      "AI Engineer specializing in ML, computer vision, NLP, and AI automation. Based in Morocco.",
    start_url: "/",
    display: "standalone",
    background_color: "#050816",
    theme_color: "#6c63ff",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
