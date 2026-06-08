import type { Metadata } from "next";
import { buildMetadata, pick } from "@/lib/seo";
import { SITE_URL } from "@/lib/data";
import { ServiceSchema } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/services",
    title: pick(locale, {
      en: "AI & ML Services — Custom Models, AI Agents & Automation",
      fr: "Services IA & ML — Modèles sur mesure, agents IA & automatisation",
      ar: "خدمات الذكاء الاصطناعي والتعلم الآلي — نماذج مخصصة ووكلاء وأتمتة",
    }),
    description: pick(locale, {
      en: "End-to-end AI services by Ossama Elhakki: custom machine learning models, WhatsApp AI sales agents, RAG systems, and n8n automation pipelines — delivered production-ready.",
      fr: "Services IA de bout en bout par Ossama Elhakki : modèles de machine learning sur mesure, agents commerciaux IA WhatsApp, systèmes RAG et pipelines d'automatisation n8n — prêts pour la production.",
      ar: "خدمات ذكاء اصطناعي شاملة من أسامة الحقّي: نماذج تعلم آلي مخصصة، ووكلاء مبيعات على واتساب، وأنظمة RAG، وخطوط أتمتة n8n — جاهزة للإنتاج.",
    }),
    keywords: [
      "AI services Morocco",
      "custom ML model development",
      "WhatsApp AI agent",
      "n8n automation",
      "RAG system development",
      "hire AI engineer",
    ],
  });
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceSchema
        name="AI Engineering & Machine Learning Services"
        description="Custom ML models, AI sales agents, RAG systems, and n8n automation pipelines."
        url={`${SITE_URL}/services`}
      />
      {children}
    </>
  );
}
