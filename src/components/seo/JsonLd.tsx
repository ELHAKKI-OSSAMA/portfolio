import { PERSON, SITE_URL, EMAIL, LINKEDIN_URL, GITHUB_URL, KAGGLE_URL } from "@/lib/data";

export function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: PERSON.name,
    alternateName: [PERSON.nameAr, "Oussama Elhakki", "Ossama El Hakki"],
    jobTitle: ["AI Engineer", "Machine Learning Engineer", "Data Scientist", "AI Automation Engineer"],
    description: PERSON.description,
    url: SITE_URL,
    mainEntityOfPage: `${SITE_URL}/about`,
    email: EMAIL,
    telephone: "+212673105217",
    image: `${SITE_URL}/og-image.png`,
    sameAs: [LINKEDIN_URL, GITHUB_URL, KAGGLE_URL],
    nationality: { "@type": "Country", name: "Morocco" },
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA",
      addressLocality: "Casablanca",
      addressRegion: "Casablanca-Settat",
    },
    homeLocation: { "@type": "Place", name: "Casablanca, Morocco" },
    knowsLanguage: [
      { "@type": "Language", name: "French" },
      { "@type": "Language", name: "Arabic" },
      { "@type": "Language", name: "English" },
    ],
    worksFor: { "@type": "Organization", name: "Freelance / Independent AI Engineer" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "ENSET Mohammedia", sameAs: "https://enset-media.ac.ma/" },
      { "@type": "CollegeOrUniversity", name: "FST Mohammedia" },
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "AI Engineer & Data Scientist",
      occupationalCategory: "15-2051.00", // Data Scientists (O*NET)
      skills: "Machine Learning, Deep Learning, Computer Vision, NLP, MLOps, AI Automation",
    },
    seeks: {
      "@type": "Demand",
      name: "AI/ML engineering roles, freelance ML projects, AI automation, and consulting",
    },
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Science",
      "Computer Vision",
      "Natural Language Processing",
      "Deep Learning",
      "Generative AI",
      "AI Automation",
      "MLOps",
      "Large Language Models",
      "RAG systems",
      "Stable Diffusion",
      "n8n",
      "LangChain",
      "PyTorch",
      "TensorFlow",
      "Arabic NLP",
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
  locale = "en",
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags: string[];
  locale?: string;
}) {
  const url = `${SITE_URL}/${locale}/blog/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    datePublished: date,
    dateModified: date,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    keywords: tags.join(", "),
    image: `${SITE_URL}/og-image.png`,
    inLanguage: locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Organization entity — strengthens brand/knowledge-graph signals. */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Ossama Elhakki",
    url: SITE_URL,
    email: EMAIL,
    logo: `${SITE_URL}/og-image.png`,
    image: `${SITE_URL}/og-image.png`,
    founder: { "@id": `${SITE_URL}/#person` },
    sameAs: [LINKEDIN_URL, GITHUB_URL, KAGGLE_URL],
    areaServed: "Worldwide",
    address: { "@type": "PostalAddress", addressCountry: "MA", addressLocality: "Casablanca" },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

/** Breadcrumb trail for a page. Pass localized {name, url} items in order. */
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

/** ProfilePage wrapper for the About page. */
export function ProfilePageSchema({ url }: { url: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    mainEntity: { "@id": `${SITE_URL}/#person` },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

/** Generic ItemList (for collection pages like /projects, /blog, /games). */
export function ItemListSchema({
  name,
  items,
}: {
  name: string;
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

/** LearningResource / Course for a learning topic. */
export function LearningResourceSchema({
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
    "@type": "LearningResource",
    name,
    description,
    url,
    learningResourceType: "Visual guide",
    educationalLevel: "Beginner to Advanced",
    inLanguage: ["en", "fr", "ar"],
    provider: { "@id": `${SITE_URL}/#person` },
    isAccessibleForFree: true,
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
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
