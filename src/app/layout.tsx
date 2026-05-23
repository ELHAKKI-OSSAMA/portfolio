import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ossama Elhakki | AI Engineer & ML Systems Builder",
  description:
    "AI Engineer specializing in machine learning, computer vision, NLP, and AI automation agents. Based in Morocco. Available for remote positions and freelance.",
  keywords:
    "AI Engineer, Machine Learning, NLP, Computer Vision, n8n, AI Agents, Morocco, Freelance ML",
  openGraph: {
    title: "Ossama Elhakki | AI Engineer",
    description:
      "AI Engineer with 35+ ML projects across fraud detection, medical imaging, NLP, and generative AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
