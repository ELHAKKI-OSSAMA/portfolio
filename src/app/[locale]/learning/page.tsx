import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import LearningClient from "./LearningClient";
import HireCTA from "@/components/sections/HireCTA";
import { buildMetadata, pick } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/learning",
    title: pick(locale, {
      en: "ML Learning Hub — Visual Machine Learning Explanations | Ossama Elhakki",
      fr: "Centre d'apprentissage ML — Explications visuelles du machine learning | Ossama Elhakki",
      ar: "مركز تعلم الآلة — شروحات بصرية لتعلم الآلة | أسامة الحقّي",
    }),
    description: pick(locale, {
      en: "Hand-crafted visual explanations of machine learning: regression, classification, ensembles, neural networks, transformers — with math derivations and runnable Python.",
      fr: "Explications visuelles du machine learning : régression, classification, ensembles, réseaux de neurones, transformers — avec démonstrations mathématiques et Python exécutable.",
      ar: "شروحات بصرية لتعلم الآلة: الانحدار والتصنيف والمجموعات والشبكات العصبية والمحوّلات — مع اشتقاقات رياضية وأكواد Python قابلة للتشغيل.",
    }),
    keywords: [
      "machine learning diagrams",
      "ML visual learning",
      "gradient boosting explained",
      "neural network diagram",
      "transformers explained",
      "Ossama Elhakki",
    ],
  });
}

export default async function LearningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <LearningClient />
      <HireCTA locale={locale} />
    </>
  );
}
