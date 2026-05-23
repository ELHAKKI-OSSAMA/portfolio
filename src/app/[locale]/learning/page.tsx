import type { Metadata } from "next";
import LearningClient from "./LearningClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "ML Learning Hub | Visual Diagrams — Ossama Elhakki",
    description:
      "Hand-crafted visual explanations of machine learning concepts: regression, classification, ensemble methods, model evaluation. 100+ diagrams from Miro.",
    keywords: [
      "machine learning diagrams",
      "ML visual learning",
      "gradient boosting explained",
      "decision tree visual",
      "neural network diagram",
      "Ossama Elhakki",
    ],
    alternates: {
      canonical: `https://ismmax.com/${locale}/learning`,
    },
    openGraph: {
      title: "ML Learning Hub | Visual Explanations",
      description:
        "Visual ML concept diagrams covering regression, boosting, transformers, and model evaluation. Built by Ossama Elhakki.",
      type: "website",
    },
  };
}

export default function LearningPage() {
  return <LearningClient />;
}
