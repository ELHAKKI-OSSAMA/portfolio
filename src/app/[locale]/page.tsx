import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata, pick } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import SkillsSection from "@/components/sections/SkillsSection";
import GamesTeaser from "@/components/sections/GamesTeaser";
import ServicesCTA from "@/components/sections/ServicesCTA";
import FAQSection from "@/components/sections/FAQSection";
import { FAQSchema } from "@/components/seo/JsonLd";
import { getFaq } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "",
    title: pick(locale, {
      en: "Ossama Elhakki — AI Engineer & ML Systems Builder",
      fr: "Ossama Elhakki — Ingénieur IA & Concepteur de Systèmes ML",
      ar: "أسامة الحقّي — مهندس ذكاء اصطناعي وباني أنظمة تعلم آلي",
    }),
    description: pick(locale, {
      en: "AI Engineer specializing in machine learning, computer vision, NLP, and AI automation. 42+ production-grade projects. Based in Casablanca, Morocco — available worldwide and remote.",
      fr: "Ingénieur IA spécialisé en machine learning, vision par ordinateur, NLP et automatisation IA. Plus de 42 projets de niveau production. Basé à Casablanca, Maroc — disponible à distance partout.",
      ar: "مهندس ذكاء اصطناعي متخصص في تعلم الآلة ورؤية الحاسوب ومعالجة اللغات وأتمتة الذكاء الاصطناعي. أكثر من 42 مشروعاً بمستوى إنتاجي. مقيم في الدار البيضاء، المغرب — متاح عن بُعد عالمياً.",
    }),
    keywords: [
      "AI Engineer",
      "Machine Learning Engineer",
      "Computer Vision",
      "NLP",
      "AI Automation",
      "MLOps",
      "Morocco",
      "Ossama Elhakki",
      "أسامة الحقّي",
    ],
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <FAQSchema items={getFaq(locale)} />
      <Hero />
      <Stats />
      <FeaturedProjects />
      <SkillsSection />
      <GamesTeaser locale={locale} />
      <ServicesCTA />
      <FAQSection locale={locale} />
    </>
  );
}
