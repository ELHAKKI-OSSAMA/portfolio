import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ossama Elhakki | AI Engineer",
    short_name: "Ossama.dev",
    description:
      "AI Engineer specializing in ML, computer vision, NLP, and AI automation. Based in Morocco.",
    start_url: "/",
    display: "standalone",
    background_color: "#050816",
    theme_color: "#6c63ff",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
