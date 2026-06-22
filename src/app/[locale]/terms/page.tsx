import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Ossama Elhakki",
  description:
    "Terms of service for ossamaelhakki.com and the owner's personal TikTok publishing tool.",
  robots: { index: true, follow: true },
};

const UPDATED = "June 22, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 section-padding">
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ color: "var(--text-secondary)" }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          Terms of Service
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Last updated: {UPDATED}
        </p>

        <div className="space-y-6 leading-relaxed text-[15px]">
          <p>
            These Terms govern your use of the website <strong>ossamaelhakki.com</strong> and the
            personal application <strong>&quot;Ossama Elhakki Poster&quot;</strong>, operated by Ossama
            Elhakki. By using the site you agree to these Terms.
          </p>

          <section>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Nature of the service
            </h2>
            <p>
              The website is a personal portfolio presenting projects, articles and demos. The
              &quot;Ossama Elhakki Poster&quot; application is a private, single-user automation tool used by
              the owner to publish the owner&apos;s own short-form videos to the owner&apos;s own TikTok
              account via TikTok&apos;s official APIs. It does not create, manage, or act on behalf of any
              other person&apos;s account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Acceptable use
            </h2>
            <p>
              All automated publishing complies with the TikTok Developer Terms of Service and
              Community Guidelines. Only content owned by the operator is uploaded.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Intellectual property
            </h2>
            <p>
              Unless stated otherwise, the content and source code showcased on this site belong to
              Ossama Elhakki. Third-party names and logos belong to their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Disclaimer &amp; liability
            </h2>
            <p>
              The site and tools are provided &quot;as is&quot;, without warranty of any kind. To the extent
              permitted by law, the operator is not liable for any damages arising from their use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Contact
            </h2>
            <p>
              Questions about these Terms?{" "}
              <a href="mailto:ossamaelhakki@gmail.com" className="underline">ossamaelhakki@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
