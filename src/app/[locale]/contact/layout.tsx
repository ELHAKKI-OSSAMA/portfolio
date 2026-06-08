import type { Metadata } from "next";
import { buildMetadata, pick } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/contact",
    title: pick(locale, {
      en: "Contact Ossama Elhakki — AI Engineer in Morocco",
      fr: "Contacter Ossama Elhakki — Ingénieur IA au Maroc",
      ar: "تواصل مع أسامة الحقّي — مهندس ذكاء اصطناعي في المغرب",
    }),
    description: pick(locale, {
      en: "Get in touch with Ossama Elhakki for AI/ML engineering roles, freelance machine learning projects, AI automation, and consulting. Based in Casablanca, available worldwide and remote.",
      fr: "Contactez Ossama Elhakki pour des postes en IA/ML, des projets freelance de machine learning, l'automatisation IA et du conseil. Basé à Casablanca, disponible à distance partout dans le monde.",
      ar: "تواصل مع أسامة الحقّي لوظائف هندسة الذكاء الاصطناعي والتعلم الآلي، ومشاريع ML الحرة، وأتمتة الذكاء الاصطناعي والاستشارات. مقيم في الدار البيضاء، متاح عن بُعد عالمياً.",
    }),
    keywords: [
      "contact AI engineer",
      "hire ML engineer Morocco",
      "freelance machine learning",
      "AI consulting Casablanca",
      "Ossama Elhakki contact",
    ],
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
