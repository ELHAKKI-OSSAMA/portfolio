import type { Metadata } from "next";
import { buildMetadata, pick } from "@/lib/seo";
import { projects, SITE_URL } from "@/lib/data";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/projects",
    title: pick(locale, {
      en: "AI & Machine Learning Projects Portfolio — Ossama Elhakki",
      fr: "Portfolio de projets IA & Machine Learning — Ossama Elhakki",
      ar: "معرض مشاريع الذكاء الاصطناعي والتعلم الآلي — أسامة الحقّي",
    }),
    description: pick(locale, {
      en: "42+ production-grade AI/ML projects by Ossama Elhakki across fraud detection, computer vision, NLP, generative AI, time series, and reinforcement learning — fully documented with code and results.",
      fr: "Plus de 42 projets IA/ML de niveau production par Ossama Elhakki : détection de fraude, vision par ordinateur, NLP, IA générative, séries temporelles et apprentissage par renforcement — documentés avec code et résultats.",
      ar: "أكثر من 42 مشروع ذكاء اصطناعي وتعلم آلي بمستوى إنتاجي من أسامة الحقّي تغطي كشف الاحتيال ورؤية الحاسوب ومعالجة اللغات والذكاء التوليدي والسلاسل الزمنية والتعلم التعزيزي — موثقة بالكود والنتائج.",
    }),
    keywords: [
      "machine learning projects",
      "AI portfolio",
      "computer vision projects",
      "NLP projects",
      "Kaggle projects",
      "Ossama Elhakki",
    ],
  });
}

export default async function ProjectsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: locale === "fr" ? "Accueil" : locale === "ar" ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
          { name: locale === "fr" ? "Projets" : locale === "ar" ? "المشاريع" : "Projects", url: `${SITE_URL}/${locale}/projects` },
        ]}
      />
      <ItemListSchema
        name="AI & Machine Learning projects"
        items={projects.slice(0, 30).map((p) => ({
          name: locale === "fr" ? (p.titleFr ?? p.title) : locale === "ar" ? (p.titleAr ?? p.title) : p.title,
          url: `${SITE_URL}/${locale}/projects/${p.id}`,
        }))}
      />
      {children}
    </>
  );
}
