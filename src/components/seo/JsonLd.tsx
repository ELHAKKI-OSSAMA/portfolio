import { PERSON, SITE_URL, EMAIL, LINKEDIN_URL, GITHUB_URL, KAGGLE_URL } from "@/lib/data";

export function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: PERSON.name,
    alternateName: PERSON.nameAr,
    jobTitle: "AI Engineer & ML Systems Builder",
    description: PERSON.description,
    url: SITE_URL,
    email: EMAIL,
    image: `${SITE_URL}/og-image.png`,
    sameAs: [LINKEDIN_URL, GITHUB_URL, KAGGLE_URL],
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
      addressLocality: "Morocco",
    },
    knowsAbout: [
      "Machine Learning",
      "Computer Vision",
      "Natural Language Processing",
      "Deep Learning",
      "AI Automation",
      "MLOps",
      "Stable Diffusion",
      "n8n",
      "LangChain",
      "PyTorch",
      "TensorFlow",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "Master in Distributed Systems & AI",
        credentialCategory: "degree",
        educationalLevel: "Master",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Ossama Elhakki | AI Engineer",
    description:
      "AI Engineer specializing in ML, computer vision, NLP, and AI automation. Based in Morocco.",
    author: { "@id": `${SITE_URL}/#person` },
    inLanguage: ["en", "fr", "ar"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/en/projects?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ items }: { items: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogPostingSchema({
  title,
  description,
  slug,
  date,
  tags,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags: string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: `${SITE_URL}/en/blog/${slug}`,
    datePublished: date,
    dateModified: date,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    keywords: tags.join(", "),
    image: `${SITE_URL}/og-image.png`,
    inLanguage: "en",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: { "@id": `${SITE_URL}/#person` },
    areaServed: "Worldwide",
    serviceType: "AI Engineering",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
