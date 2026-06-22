import type { Project } from './types';

// ── GitHub repositories (AI HR + distributed-systems / backend coursework) ─────
// Added from the public repos at https://github.com/ELHAKKI-OSSAMA.
// AI HR platform + Master SDIA (Systèmes Distribués & IA, ENSET) engineering work.
// Every entry is trilingual (EN/FR/AR) and links to its own GitHub repo.

const GH = "https://github.com/ELHAKKI-OSSAMA";

export const projectsPart3: Project[] = [
  // ── AI ────────────────────────────────────────────────────────────────────
  {
    id: "ai-hr-platform",
    title: "AI HR Platform — 20 LLM Tools, ATS & MCP",
    titleFr: "Plateforme RH IA — 20 outils LLM, ATS & MCP",
    titleAr: "منصة موارد بشرية بالذكاء الاصطناعي — 20 أداة LLM وATS وMCP",
    description: "Full HR platform powered by gpt-oss:120b (Ollama Cloud): 20 AI tools across 7 HR domains, persistent ATS pipeline, NL-to-SQL data assistant, voice pre-screening, Gmail automation and an MCP server — FastAPI + SQLite, multilingual FR/EN/AR/Darija.",
    descriptionFr: "Plateforme RH complète propulsée par gpt-oss:120b (Ollama Cloud) : 20 outils IA sur 7 domaines RH, pipeline ATS persistant, assistant data langage-naturel→SQL, pré-entretien vocal, automatisation Gmail et serveur MCP — FastAPI + SQLite, multilingue FR/EN/AR/Darija.",
    descriptionAr: "منصة موارد بشرية كاملة مدعومة بـ gpt-oss:120b (Ollama Cloud): 20 أداة ذكاء اصطناعي عبر 7 مجالات موارد بشرية، خط ATS دائم، مساعد بيانات يحوّل اللغة الطبيعية إلى SQL، فرز صوتي مسبق، أتمتة Gmail وخادم MCP — FastAPI + SQLite، متعدد اللغات FR/EN/AR/الدارجة.",
    longDescription: `A production-style HR platform that wraps a single open-weight LLM (\`gpt-oss:120b\` via Ollama Cloud) into 20 specialized AI tools, reachable from both a FastAPI web dashboard and a CLI.

**Seven HR domains**
\`\`\`
Recruitment  → CV scoring · job offers · interview kits · email drafting
Onboarding   → chatbot · checklists · document generation
HR Admin     → leave management · internal communication
Performance  → evaluations · improvement plans · 360° summaries
L&D          → skills-gap analysis · training plans · quiz generation
Retention    → attrition risk · sentiment analysis · exit interviews
Analytics    → HR KPIs · executive reporting
\`\`\`

**Specialized modules**
| Module | What it does |
|--------|-------------|
| ATS / Pipeline | SQLite tracks candidates across stages (Kanban-style) |
| Data Assistant | Natural-language → read-only SQL, streamed answers, CSV/PDF export |
| Automated Interviews | Voice pre-screening, adaptive questions, scored reports |
| Gmail Automation | Auto-classify applications, extract CVs, score, label, reply |
| MCP Server | Exposes HR queries to Claude Desktop & MCP-compatible clients |

**Engineering choices**
- Multi-user auth with role-based access (admin / recruiter)
- **Objective scoring** that ignores demographic signals to reduce bias
- **Read-only SQL** execution with password masking for safety
- Multilingual responses: **FR / EN / Arabic / Darija**
- **65 unit tests, 100% offline** — the LLM is mocked, no network calls in CI`,
    longDescriptionFr: `Une plateforme RH de style production qui transforme un seul LLM open-weight (\`gpt-oss:120b\` via Ollama Cloud) en 20 outils IA spécialisés, accessibles depuis un tableau de bord web FastAPI et une CLI.

**Sept domaines RH**
\`\`\`
Recrutement  → scoring de CV · offres d'emploi · kits d'entretien · rédaction d'emails
Onboarding   → chatbot · checklists · génération de documents
Admin RH     → gestion des congés · communication interne
Performance  → évaluations · plans d'amélioration · synthèses 360°
Formation    → analyse des écarts de compétences · plans de formation · quiz
Rétention    → risque d'attrition · analyse de sentiment · entretiens de départ
Analytique   → KPIs RH · reporting exécutif
\`\`\`

**Modules spécialisés**
| Module | Rôle |
|--------|-------------|
| ATS / Pipeline | SQLite suit les candidats par étapes (style Kanban) |
| Assistant Data | Langage naturel → SQL lecture seule, réponses en streaming, export CSV/PDF |
| Entretiens automatisés | Pré-entretien vocal, questions adaptatives, rapports notés |
| Automatisation Gmail | Classe les candidatures, extrait les CV, score, étiquette, répond |
| Serveur MCP | Expose les requêtes RH à Claude Desktop & clients compatibles MCP |

**Choix d'ingénierie**
- Authentification multi-utilisateurs avec accès par rôles (admin / recruteur)
- **Scoring objectif** ignorant les signaux démographiques pour réduire le biais
- Exécution **SQL en lecture seule** avec masquage des mots de passe
- Réponses multilingues : **FR / EN / Arabe / Darija**
- **65 tests unitaires, 100% hors-ligne** — le LLM est mocké, aucun appel réseau en CI`,
    longDescriptionAr: `منصة موارد بشرية بأسلوب إنتاجي تحوّل نموذجاً لغوياً مفتوح الأوزان واحداً (\`gpt-oss:120b\` عبر Ollama Cloud) إلى 20 أداة ذكاء اصطناعي متخصصة، يمكن الوصول إليها من لوحة تحكم ويب FastAPI ومن واجهة سطر الأوامر.

**سبعة مجالات للموارد البشرية**
\`\`\`
التوظيف     → تقييم السير الذاتية · عروض العمل · حقائب المقابلات · صياغة الرسائل
الإدماج     → روبوت محادثة · قوائم تحقق · توليد المستندات
الإدارة     → إدارة الإجازات · التواصل الداخلي
الأداء      → التقييمات · خطط التحسين · ملخصات 360°
التكوين     → تحليل فجوات المهارات · خطط التدريب · الاختبارات
الاحتفاظ    → خطر التسرب · تحليل المشاعر · مقابلات المغادرة
التحليلات   → مؤشرات الأداء · التقارير التنفيذية
\`\`\`

**وحدات متخصصة**
| الوحدة | الوظيفة |
|--------|-------------|
| ATS / خط المرشحين | SQLite يتتبع المرشحين عبر المراحل (بأسلوب كانبان) |
| مساعد البيانات | لغة طبيعية → SQL للقراءة فقط، إجابات متدفقة، تصدير CSV/PDF |
| المقابلات الآلية | فرز صوتي مسبق، أسئلة تكيّفية، تقارير مُقيَّمة |
| أتمتة Gmail | تصنيف الطلبات، استخراج السير الذاتية، التقييم، الوسم، الرد |
| خادم MCP | يعرض استعلامات الموارد البشرية لـ Claude Desktop والعملاء المتوافقين مع MCP |

**القرارات الهندسية**
- مصادقة متعددة المستخدمين مع وصول حسب الأدوار (مدير / موظف توظيف)
- **تقييم موضوعي** يتجاهل الإشارات الديموغرافية للحد من التحيز
- تنفيذ **SQL للقراءة فقط** مع إخفاء كلمات المرور للأمان
- إجابات متعددة اللغات: **FR / EN / العربية / الدارجة**
- **65 اختبار وحدة، 100% دون اتصال** — يتم محاكاة النموذج، لا استدعاءات شبكة في CI`,
    category: ["agents", "genai"],
    tags: ["LLM", "Ollama", "FastAPI", "MCP", "ATS", "Gmail API", "SQLite", "NL2SQL"],
    githubUrl: `${GH}/ai_rh`,
    featured: false,
    metrics: "20 AI tools · 7 HR domains · 65 tests",
    results: [
      { label: "AI tools", value: "20" },
      { label: "HR domains", value: "7" },
      { label: "Unit tests (offline)", value: "65" },
      { label: "Languages", value: "FR/EN/AR/Darija" },
    ],
    techStack: ["Python", "FastAPI", "Ollama Cloud (gpt-oss:120b)", "SQLite", "Gmail API", "MCP", "pytest"],
    approach: "One LLM exposed as 20 role-specific agents + persistent ATS, NL-to-SQL assistant and an MCP server",
    approachFr: "Un LLM exposé en 20 agents spécialisés par rôle + ATS persistant, assistant langage-naturel→SQL et serveur MCP",
    approachAr: "نموذج لغوي واحد معروض كـ 20 وكيلاً متخصصاً + ATS دائم، مساعد لغة طبيعية→SQL وخادم MCP",
  },

  // ── DISTRIBUTED SYSTEMS / MICROSERVICES ─────────────────────────────────────
  {
    id: "sdia-conference-microservices",
    title: "Conference Platform — Spring Cloud Microservices",
    titleFr: "Plateforme de Conférences — Microservices Spring Cloud",
    titleAr: "منصة المؤتمرات — خدمات مصغّرة Spring Cloud",
    description: "Full Spring Cloud microservices system for conferences & keynotes: Config Server, Eureka discovery, API Gateway, two JWT resource servers secured by Keycloak (OAuth2/OIDC), OpenFeign inter-service calls with token propagation, and an Angular client.",
    descriptionFr: "Système de microservices Spring Cloud complet pour conférences & keynotes : Config Server, découverte Eureka, API Gateway, deux resource servers JWT sécurisés par Keycloak (OAuth2/OIDC), appels inter-services OpenFeign avec propagation de token, et un client Angular.",
    descriptionAr: "نظام خدمات مصغّرة Spring Cloud كامل للمؤتمرات والكلمات الرئيسية: Config Server، اكتشاف Eureka، بوابة API، خادما موارد JWT مؤمَّنان بـ Keycloak (OAuth2/OIDC)، استدعاءات بين الخدمات عبر OpenFeign مع تمرير الرمز، وعميل Angular.",
    longDescription: `A complete distributed system (SDIA mock-exam solution) managing **conferences and keynotes** with the full Spring Cloud stack: centralized config, service discovery, gateway routing and end-to-end OAuth2 security.

**Architecture**
\`\`\`
                         ┌──────────────┐
                         │   Keycloak   │  realm: exam-realm
                         │ (OAuth2/OIDC)│
                         └──────┬───────┘
                                │ JWT
        ┌───────────────┐       ▼
        │  Angular SPA  │ ──► Gateway :8888 ──► Eureka :8761 (discovery)
        └───────────────┘       │                    ▲
                                 ├──► keynote-service :8081
                                 └──► conference-service :8082 ──(OpenFeign)──┐
                                                                              │
                          Config Server :8088  ◄── all services pull config   │
                          keynote-service ◄───────────────────────────────────┘
\`\`\`

**Services**
| Service | Port | Role |
|---------|------|------|
| config-service | 8088 | Spring Cloud Config Server (Git-backed) |
| discovery-service | 8761 | Eureka service registry |
| gateway-service | 8888 | API Gateway + CORS |
| keynote-service | 8081 | Keynotes resource server (H2) |
| conference-service | 8082 | Conferences resource server (H2), calls keynotes via Feign |

**Security & resilience**
- Every microservice is a **JWT resource server**; \`JwtAuthConverter\` maps Keycloak roles → Spring authorities
- \`FeignInterceptor\` **propagates the bearer token** across inter-service calls
- Environment-variable-driven config Git path → portable across machines
- All 5 services compile and **pass tests without a running Keycloak**`,
    longDescriptionFr: `Un système distribué complet (corrigé d'examen blanc SDIA) gérant **conférences et keynotes** avec toute la stack Spring Cloud : config centralisée, découverte de services, routage gateway et sécurité OAuth2 de bout en bout.

**Architecture**
\`\`\`
                         ┌──────────────┐
                         │   Keycloak   │  realm: exam-realm
                         │ (OAuth2/OIDC)│
                         └──────┬───────┘
                                │ JWT
        ┌───────────────┐       ▼
        │  SPA Angular  │ ──► Gateway :8888 ──► Eureka :8761 (découverte)
        └───────────────┘       │                    ▲
                                 ├──► keynote-service :8081
                                 └──► conference-service :8082 ──(OpenFeign)──┐
                                                                              │
                          Config Server :8088  ◄── tous les services          │
                          keynote-service ◄───────────────────────────────────┘
\`\`\`

**Services**
| Service | Port | Rôle |
|---------|------|------|
| config-service | 8088 | Spring Cloud Config Server (basé Git) |
| discovery-service | 8761 | Registre Eureka |
| gateway-service | 8888 | API Gateway + CORS |
| keynote-service | 8081 | Resource server keynotes (H2) |
| conference-service | 8082 | Resource server conférences (H2), appelle keynotes via Feign |

**Sécurité & résilience**
- Chaque microservice est un **resource server JWT** ; \`JwtAuthConverter\` mappe les rôles Keycloak → autorités Spring
- \`FeignInterceptor\` **propage le token Bearer** entre les appels inter-services
- Chemin Git de config piloté par variable d'environnement → portable entre machines
- Les 5 services compilent et **passent les tests sans Keycloak démarré**`,
    longDescriptionAr: `نظام موزّع كامل (حلّ امتحان تجريبي SDIA) يدير **المؤتمرات والكلمات الرئيسية** بكامل حزمة Spring Cloud: إعداد مركزي، اكتشاف الخدمات، توجيه عبر البوابة وأمان OAuth2 من طرف إلى طرف.

**البنية**
\`\`\`
                         ┌──────────────┐
                         │   Keycloak   │  realm: exam-realm
                         │ (OAuth2/OIDC)│
                         └──────┬───────┘
                                │ JWT
        ┌───────────────┐       ▼
        │  واجهة Angular │ ──► Gateway :8888 ──► Eureka :8761 (الاكتشاف)
        └───────────────┘       │                    ▲
                                 ├──► keynote-service :8081
                                 └──► conference-service :8082 ──(OpenFeign)──┐
                                                                              │
                          Config Server :8088  ◄── كل الخدمات                  │
                          keynote-service ◄───────────────────────────────────┘
\`\`\`

**الخدمات**
| الخدمة | المنفذ | الدور |
|---------|------|------|
| config-service | 8088 | خادم إعداد Spring Cloud (مدعوم بـ Git) |
| discovery-service | 8761 | سجل خدمات Eureka |
| gateway-service | 8888 | بوابة API + CORS |
| keynote-service | 8081 | خادم موارد الكلمات (H2) |
| conference-service | 8082 | خادم موارد المؤتمرات (H2)، يستدعي الكلمات عبر Feign |

**الأمان والمرونة**
- كل خدمة مصغّرة هي **خادم موارد JWT**؛ \`JwtAuthConverter\` يربط أدوار Keycloak ← صلاحيات Spring
- \`FeignInterceptor\` **يمرّر رمز Bearer** عبر الاستدعاءات بين الخدمات
- مسار Git للإعداد مُدار بمتغيّر بيئة ← قابل للنقل بين الأجهزة
- الخدمات الخمس تُترجم و**تنجح في الاختبارات دون تشغيل Keycloak**`,
    category: ["backend"],
    tags: ["Spring Cloud", "Eureka", "API Gateway", "Keycloak", "OAuth2", "OpenFeign", "Angular", "Microservices"],
    githubUrl: `${GH}/examen_blanc_sdia`,
    featured: false,
    metrics: "5 microservices · OAuth2 · Eureka · Gateway",
    results: [
      { label: "Microservices", value: "5" },
      { label: "Discovery", value: "Eureka" },
      { label: "Auth", value: "Keycloak JWT" },
      { label: "Frontend", value: "Angular" },
    ],
    techStack: ["Java 17", "Spring Boot 3.4", "Spring Cloud 2024", "Eureka", "Spring Cloud Gateway", "Config Server", "Keycloak", "OpenFeign", "Angular", "H2"],
    approach: "Config Server + Eureka + Gateway pattern, each service a JWT resource server, Feign with token propagation",
    approachFr: "Pattern Config Server + Eureka + Gateway, chaque service en resource server JWT, Feign avec propagation de token",
    approachAr: "نمط Config Server + Eureka + Gateway، كل خدمة خادم موارد JWT، Feign مع تمرير الرمز",
  },
  {
    id: "oauth2-keycloak-microservices",
    title: "Secured Microservices — OAuth2 / OIDC / Keycloak",
    titleFr: "Microservices Sécurisés — OAuth2 / OIDC / Keycloak",
    titleAr: "خدمات مصغّرة مؤمَّنة — OAuth2 / OIDC / Keycloak",
    description: "Secured e-commerce microservices where Keycloak is the central authorization server. Two Spring Boot resource servers (inventory, order) validate Keycloak-issued JWTs; order-service calls inventory via OpenFeign with bearer-token propagation; an Angular client logs in via OIDC.",
    descriptionFr: "Microservices e-commerce sécurisés où Keycloak est le serveur d'autorisation central. Deux resource servers Spring Boot (inventaire, commandes) valident les JWT émis par Keycloak ; order-service appelle inventory via OpenFeign avec propagation du token ; un client Angular se connecte via OIDC.",
    descriptionAr: "خدمات مصغّرة للتجارة الإلكترونية مؤمَّنة حيث يكون Keycloak خادم التفويض المركزي. خادما موارد Spring Boot (المخزون، الطلبات) يتحققان من رموز JWT الصادرة عن Keycloak؛ تستدعي خدمة الطلبات المخزون عبر OpenFeign مع تمرير الرمز؛ عميل Angular يسجّل الدخول عبر OIDC.",
    longDescription: `A focused study of **OAuth2 / OpenID Connect** security for microservices, with Keycloak as the identity provider for an e-commerce domain.

**Architecture**
\`\`\`
                    ┌──────────────┐
                    │   Keycloak   │  realm: sdia-realm  (:8080)
                    │ (OAuth2/OIDC)│
                    └──────┬───────┘
                           │ JWT (Bearer)
        ┌──────────────────┼──────────────────────────┐
        ▼                  ▼                            ▼
  ┌───────────────┐  ┌───────────────────┐     ┌───────────────┐
  │  ecom-app     │  │  order-service     │ ──► │  inventory-   │
  │  (Angular)    │  │  :8088 (OpenFeign) │     │  service :8087│
  └───────────────┘  └───────────────────┘     └───────────────┘
                     propagates the token via FeignInterceptor
\`\`\`

**Security details**
- \`SecurityConfig\` registers each service as a **resource server** (\`oauth2ResourceServer().jwt()\`)
- \`JwtAuthConverter\` converts **Keycloak realm/client roles** into Spring Security authorities
- \`FeignInterceptor\` on order-service **forwards the bearer token** to inventory-service
- Both services use **H2** in-memory databases; order-service ships Swagger UI

**Modules:** \`inventory-service\` (products, :8087) · \`order-service\` (orders, :8088) · \`ecom-app-angular\` (OIDC login client, :4200).`,
    longDescriptionFr: `Une étude ciblée de la sécurité **OAuth2 / OpenID Connect** pour microservices, avec Keycloak comme fournisseur d'identité d'un domaine e-commerce.

**Architecture**
\`\`\`
                    ┌──────────────┐
                    │   Keycloak   │  realm: sdia-realm  (:8080)
                    │ (OAuth2/OIDC)│
                    └──────┬───────┘
                           │ JWT (Bearer)
        ┌──────────────────┼──────────────────────────┐
        ▼                  ▼                            ▼
  ┌───────────────┐  ┌───────────────────┐     ┌───────────────┐
  │  ecom-app     │  │  order-service     │ ──► │  inventory-   │
  │  (Angular)    │  │  :8088 (OpenFeign) │     │  service :8087│
  └───────────────┘  └───────────────────┘     └───────────────┘
                     propage le token via FeignInterceptor
\`\`\`

**Détails de sécurité**
- \`SecurityConfig\` enregistre chaque service en **resource server** (\`oauth2ResourceServer().jwt()\`)
- \`JwtAuthConverter\` convertit les **rôles realm/client Keycloak** en autorités Spring Security
- \`FeignInterceptor\` sur order-service **transmet le token Bearer** à inventory-service
- Les deux services utilisent des bases **H2** en mémoire ; order-service embarque Swagger UI

**Modules :** \`inventory-service\` (produits, :8087) · \`order-service\` (commandes, :8088) · \`ecom-app-angular\` (client login OIDC, :4200).`,
    longDescriptionAr: `دراسة مركّزة لأمان **OAuth2 / OpenID Connect** للخدمات المصغّرة، مع Keycloak كمزوّد هوية لمجال تجارة إلكترونية.

**البنية**
\`\`\`
                    ┌──────────────┐
                    │   Keycloak   │  realm: sdia-realm  (:8080)
                    │ (OAuth2/OIDC)│
                    └──────┬───────┘
                           │ JWT (Bearer)
        ┌──────────────────┼──────────────────────────┐
        ▼                  ▼                            ▼
  ┌───────────────┐  ┌───────────────────┐     ┌───────────────┐
  │  ecom-app     │  │  order-service     │ ──► │  inventory-   │
  │  (Angular)    │  │  :8088 (OpenFeign) │     │  service :8087│
  └───────────────┘  └───────────────────┘     └───────────────┘
                     يمرّر الرمز عبر FeignInterceptor
\`\`\`

**تفاصيل الأمان**
- \`SecurityConfig\` يسجّل كل خدمة كـ **خادم موارد** (\`oauth2ResourceServer().jwt()\`)
- \`JwtAuthConverter\` يحوّل **أدوار realm/client في Keycloak** إلى صلاحيات Spring Security
- \`FeignInterceptor\` في خدمة الطلبات **يمرّر رمز Bearer** إلى خدمة المخزون
- تستخدم الخدمتان قواعد **H2** في الذاكرة؛ وتتضمن خدمة الطلبات Swagger UI

**الوحدات:** \`inventory-service\` (المنتجات، :8087) · \`order-service\` (الطلبات، :8088) · \`ecom-app-angular\` (عميل تسجيل دخول OIDC، :4200).`,
    category: ["backend"],
    tags: ["Keycloak", "OAuth2", "OIDC", "JWT", "Spring Security", "OpenFeign", "Angular", "Microservices"],
    githubUrl: `${GH}/S-curit-des-syst-mes-distribu-s-Oauth2-OIDC-Keycloak`,
    featured: false,
    metrics: "2 resource servers · Keycloak JWT · Feign",
    results: [
      { label: "Resource servers", value: "2" },
      { label: "Identity provider", value: "Keycloak" },
      { label: "Inter-service", value: "OpenFeign" },
      { label: "Client", value: "Angular OIDC" },
    ],
    techStack: ["Java 17", "Spring Boot 3.2", "Spring Security", "Keycloak", "OAuth2/OIDC", "OpenFeign", "Angular", "H2", "Swagger"],
    approach: "Keycloak as central IdP; JWT resource servers + role-mapping converter + Feign token propagation",
    approachFr: "Keycloak comme IdP central ; resource servers JWT + converter de rôles + propagation de token Feign",
    approachAr: "Keycloak كمزوّد هوية مركزي؛ خوادم موارد JWT + محوّل أدوار + تمرير رمز عبر Feign",
  },
  {
    id: "kafka-spring-cloud-stream",
    title: "Real-Time Event Streaming — Kafka + Spring Cloud Stream",
    titleFr: "Streaming d'Événements Temps Réel — Kafka + Spring Cloud Stream",
    titleAr: "بثّ الأحداث في الزمن الحقيقي — Kafka + Spring Cloud Stream",
    description: "Functional event-stream processing with Spring Cloud Stream and Kafka Streams: a supplier produces page events, a function transforms them, and a KStream pipeline applies 5-second sliding windows for real-time per-page analytics streamed to the browser via Server-Sent Events.",
    descriptionFr: "Traitement fonctionnel de flux d'événements avec Spring Cloud Stream et Kafka Streams : un supplier produit des page-events, une function les transforme, et un pipeline KStream applique des fenêtres glissantes de 5 s pour des analytics par page en temps réel diffusées au navigateur via Server-Sent Events.",
    descriptionAr: "معالجة وظيفية لتدفّق الأحداث باستخدام Spring Cloud Stream وKafka Streams: مزوّد يُنتج أحداث صفحات، ودالة تحوّلها، وخط KStream يطبّق نوافذ منزلقة من 5 ثوانٍ لتحليلات لحظية لكل صفحة تُبَثّ إلى المتصفح عبر Server-Sent Events.",
    longDescription: `An event-driven pipeline built around the **functional programming model** of Spring Cloud Stream, with stateful **Kafka Streams** aggregations.

**Pipeline**
\`\`\`
pageEvent1Supplier ──► topic R2 ──► pageEvent1Consumer (logs)
                                └─► pageEvent1Function (transform)
       StreamBridge
GET /publish/{topic}/{name} ─────► topic
                                     │
KStream1Function: filter ──► 5s sliding window ──► count by page ──► topic R4
                                                                       │
GET /analytics  ◄── Server-Sent Events ◄── interactive query (state store)
\`\`\`

**Functional beans**
| Bean | Type | Job |
|------|------|-----|
| \`pageEvent1Supplier\` | Supplier | Emits PageEvent1 to topic R2 continuously |
| \`pageEvent1Consumer\` | Consumer | Consumes & displays events |
| \`pageEvent1Function\` | Function | Transforms events |
| \`KStream1Function\` | KStream | Filters, windows (5s), counts by page → R4 |

**Highlights**
- Stateful **windowed aggregation** with interactive queries over the state store
- Real-time analytics pushed to the UI via **Server-Sent Events**
- Kafka brokers spun up with **Docker Compose** for one-command local dev`,
    longDescriptionFr: `Un pipeline orienté événements bâti autour du **modèle de programmation fonctionnelle** de Spring Cloud Stream, avec des agrégations **Kafka Streams** à état.

**Pipeline**
\`\`\`
pageEvent1Supplier ──► topic R2 ──► pageEvent1Consumer (logs)
                                └─► pageEvent1Function (transformation)
       StreamBridge
GET /publish/{topic}/{name} ─────► topic
                                     │
KStream1Function: filtre ──► fenêtre 5s ──► comptage par page ──► topic R4
                                                                     │
GET /analytics  ◄── Server-Sent Events ◄── requête interactive (state store)
\`\`\`

**Beans fonctionnels**
| Bean | Type | Rôle |
|------|------|-----|
| \`pageEvent1Supplier\` | Supplier | Émet des PageEvent1 vers R2 en continu |
| \`pageEvent1Consumer\` | Consumer | Consomme & affiche les événements |
| \`pageEvent1Function\` | Function | Transforme les événements |
| \`KStream1Function\` | KStream | Filtre, fenêtre (5s), compte par page → R4 |

**Points forts**
- **Agrégation fenêtrée** à état avec requêtes interactives sur le state store
- Analytics temps réel poussées vers l'UI via **Server-Sent Events**
- Brokers Kafka démarrés avec **Docker Compose** pour un dev local en une commande`,
    longDescriptionAr: `خط معالجة موجَّه بالأحداث مبنيّ حول **نموذج البرمجة الوظيفية** في Spring Cloud Stream، مع تجميعات **Kafka Streams** ذات الحالة.

**خط المعالجة**
\`\`\`
pageEvent1Supplier ──► topic R2 ──► pageEvent1Consumer (سجلات)
                                └─► pageEvent1Function (تحويل)
       StreamBridge
GET /publish/{topic}/{name} ─────► topic
                                     │
KStream1Function: تصفية ──► نافذة 5ث ──► عدّ حسب الصفحة ──► topic R4
                                                                │
GET /analytics  ◄── Server-Sent Events ◄── استعلام تفاعلي (state store)
\`\`\`

**الـ Beans الوظيفية**
| Bean | النوع | الوظيفة |
|------|------|-----|
| \`pageEvent1Supplier\` | Supplier | يُصدر PageEvent1 إلى R2 باستمرار |
| \`pageEvent1Consumer\` | Consumer | يستهلك ويعرض الأحداث |
| \`pageEvent1Function\` | Function | يحوّل الأحداث |
| \`KStream1Function\` | KStream | تصفية، نافذة (5ث)، عدّ حسب الصفحة → R4 |

**أبرز النقاط**
- **تجميع نافذي** ذو حالة مع استعلامات تفاعلية على مخزن الحالة
- تحليلات لحظية تُدفَع إلى الواجهة عبر **Server-Sent Events**
- وسطاء Kafka يُشغَّلون عبر **Docker Compose** لتطوير محلي بأمر واحد`,
    category: ["backend"],
    tags: ["Apache Kafka", "Kafka Streams", "Spring Cloud Stream", "Event-Driven", "SSE", "Docker", "Windowing"],
    githubUrl: `${GH}/kafka-spring-cloud-stream`,
    featured: false,
    metrics: "Kafka Streams · 5s windows · SSE analytics",
    results: [
      { label: "Streaming engine", value: "Kafka Streams" },
      { label: "Window size", value: "5s sliding" },
      { label: "Live transport", value: "SSE" },
      { label: "Functional beans", value: "4" },
    ],
    techStack: ["Java 17", "Spring Boot 3.3", "Spring Cloud Stream", "Apache Kafka", "Kafka Streams", "Docker Compose"],
    approach: "Functional supplier/function/consumer beans + windowed KStream aggregation streamed live over SSE",
    approachFr: "Beans fonctionnels supplier/function/consumer + agrégation KStream fenêtrée diffusée en direct via SSE",
    approachAr: "Beans وظيفية supplier/function/consumer + تجميع KStream نافذي يُبَثّ مباشرة عبر SSE",
  },
  {
    id: "multi-connector-microservice",
    title: "Multi-Connector Service — REST · GraphQL · SOAP · gRPC",
    titleFr: "Service Multi-Connecteurs — REST · GraphQL · SOAP · gRPC",
    titleAr: "خدمة متعددة الموصّلات — REST · GraphQL · SOAP · gRPC",
    description: "One business service exposed through four communication styles at once — REST, GraphQL, SOAP and gRPC — then consumed by a second microservice over REST (OpenFeign) and gRPC. A side-by-side study of API protocols on the same Customer domain.",
    descriptionFr: "Un même service métier exposé simultanément via quatre styles de communication — REST, GraphQL, SOAP et gRPC — puis consommé par un second microservice en REST (OpenFeign) et gRPC. Une étude comparative des protocoles d'API sur le même domaine Customer.",
    descriptionAr: "خدمة أعمال واحدة معروضة في آنٍ واحد عبر أربعة أنماط تواصل — REST وGraphQL وSOAP وgRPC — ثم تستهلكها خدمة مصغّرة ثانية عبر REST (OpenFeign) وgRPC. دراسة موازِنة لبروتوكولات الـ API على نفس مجال العملاء.",
    longDescription: `A protocol-comparison project: the same \`Customer\` domain is published over **four connectors at once**, then consumed by a second service — ideal for understanding the trade-offs between REST, GraphQL, SOAP and gRPC.

**Architecture**
\`\`\`
┌──────────────────────────────────────────┐
│  customer-data-service  (provider, H2)     │
│  ├── 🟢 REST     CustomerRestController     │ + Swagger UI
│  ├── 🔵 GraphQL  CustomerGraphQLController  │ schema.graphqls
│  ├── 🟠 SOAP     CustomerSoapService        │ Apache CXF
│  └── 🟣 gRPC     CustomerGrpcService        │ CustomerService.proto
└───────────────┬───────────────┬────────────┘
                │ REST (Feign)   │ gRPC (stub)
                ▼                ▼
        ┌──────────────────────────────┐
        │  account-data-service (client)│
        └──────────────────────────────┘
\`\`\`

**What it shows**
- The **same entity** served four ways → directly comparable controllers/contracts
- gRPC contract defined in \`CustomerService.proto\` (Protocol Buffers); SOAP via **Apache CXF**
- Consumer demonstrates two integration modes: **OpenFeign** (REST) and a **gRPC stub client**
- Single in-memory **H2** store backing every connector`,
    longDescriptionFr: `Un projet de comparaison de protocoles : le même domaine \`Customer\` est publié via **quatre connecteurs en même temps**, puis consommé par un second service — idéal pour comprendre les compromis entre REST, GraphQL, SOAP et gRPC.

**Architecture**
\`\`\`
┌──────────────────────────────────────────┐
│  customer-data-service  (fournisseur, H2)  │
│  ├── 🟢 REST     CustomerRestController     │ + Swagger UI
│  ├── 🔵 GraphQL  CustomerGraphQLController  │ schema.graphqls
│  ├── 🟠 SOAP     CustomerSoapService        │ Apache CXF
│  └── 🟣 gRPC     CustomerGrpcService        │ CustomerService.proto
└───────────────┬───────────────┬────────────┘
                │ REST (Feign)   │ gRPC (stub)
                ▼                ▼
        ┌──────────────────────────────┐
        │  account-data-service (client)│
        └──────────────────────────────┘
\`\`\`

**Ce qu'il démontre**
- La **même entité** servie de quatre façons → contrôleurs/contrats directement comparables
- Contrat gRPC défini dans \`CustomerService.proto\` (Protocol Buffers) ; SOAP via **Apache CXF**
- Le consommateur illustre deux modes d'intégration : **OpenFeign** (REST) et un **client stub gRPC**
- Un seul magasin **H2** en mémoire derrière chaque connecteur`,
    longDescriptionAr: `مشروع لمقارنة البروتوكولات: نفس مجال \`Customer\` يُنشَر عبر **أربعة موصّلات في آنٍ واحد**، ثم تستهلكه خدمة ثانية — مثاليّ لفهم المفاضلات بين REST وGraphQL وSOAP وgRPC.

**البنية**
\`\`\`
┌──────────────────────────────────────────┐
│  customer-data-service  (المزوّد، H2)       │
│  ├── 🟢 REST     CustomerRestController     │ + Swagger UI
│  ├── 🔵 GraphQL  CustomerGraphQLController  │ schema.graphqls
│  ├── 🟠 SOAP     CustomerSoapService        │ Apache CXF
│  └── 🟣 gRPC     CustomerGrpcService        │ CustomerService.proto
└───────────────┬───────────────┬────────────┘
                │ REST (Feign)   │ gRPC (stub)
                ▼                ▼
        ┌──────────────────────────────┐
        │  account-data-service (العميل)│
        └──────────────────────────────┘
\`\`\`

**ما يوضّحه**
- **نفس الكيان** يُقدَّم بأربع طرق → وحدات تحكم/عقود قابلة للمقارنة مباشرة
- عقد gRPC مُعرَّف في \`CustomerService.proto\` (Protocol Buffers)؛ وSOAP عبر **Apache CXF**
- يوضّح العميل نمطَي تكامل: **OpenFeign** (REST) و**عميل stub لـ gRPC**
- مخزن **H2** واحد في الذاكرة خلف كل موصّل`,
    category: ["backend"],
    tags: ["REST", "GraphQL", "SOAP", "gRPC", "Protocol Buffers", "Apache CXF", "OpenFeign", "Spring Boot"],
    githubUrl: `${GH}/GRPC`,
    featured: false,
    metrics: "1 service · 4 protocols · 2 microservices",
    results: [
      { label: "Protocols exposed", value: "4" },
      { label: "Provider store", value: "H2" },
      { label: "gRPC contract", value: "Protobuf" },
      { label: "SOAP stack", value: "Apache CXF" },
    ],
    techStack: ["Java 17", "Spring Boot 3.1", "gRPC", "Protocol Buffers", "GraphQL", "SOAP (Apache CXF)", "OpenFeign", "H2"],
    approach: "Expose one Customer domain over REST/GraphQL/SOAP/gRPC; consume it via Feign and a gRPC stub",
    approachFr: "Exposer un domaine Customer en REST/GraphQL/SOAP/gRPC ; le consommer via Feign et un stub gRPC",
    approachAr: "عرض مجال Customer عبر REST/GraphQL/SOAP/gRPC؛ واستهلاكه عبر Feign وstub لـ gRPC",
  },
  {
    id: "bank-account-microservice",
    title: "Bank Account Microservice — REST · GraphQL · Data REST",
    titleFr: "Microservice de Comptes Bancaires — REST · GraphQL · Data REST",
    titleAr: "خدمة حسابات بنكية مصغّرة — REST · GraphQL · Data REST",
    description: "A bank-account microservice exposing the same domain through three interfaces — a hand-written REST API, a GraphQL API, and auto-generated Spring Data REST — with DTO/mapper layering, OpenAPI/Swagger docs and an H2 store.",
    descriptionFr: "Un microservice de comptes bancaires exposant le même domaine via trois interfaces — une API REST écrite à la main, une API GraphQL, et Spring Data REST auto-généré — avec couche DTO/mapper, documentation OpenAPI/Swagger et base H2.",
    descriptionAr: "خدمة حسابات بنكية مصغّرة تعرض نفس المجال عبر ثلاث واجهات — واجهة REST مكتوبة يدوياً، وواجهة GraphQL، وSpring Data REST المُولَّد تلقائياً — مع طبقة DTO/mapper، وتوثيق OpenAPI/Swagger، ومخزن H2.",
    longDescription: `A clean layered microservice for managing **bank accounts and customers**, exposing the same data three ways so you can compare hand-written vs. auto-generated APIs.

**Layered architecture**
\`\`\`
Web (REST controllers + GraphQL resolvers + Spring Data REST)
   │
Service layer  (business logic, @Transactional)
   │
Repositories (Spring Data JPA)
   │
Entities  (BankAccount ── Customer, AccountType enum)
\`\`\`

**Domain**
| Entity | Fields |
|--------|--------|
| BankAccount | id, date, balance, currency, AccountType, → Customer |
| Customer | owns many BankAccounts |
| AccountType | enum (e.g. CURRENT / SAVINGS) |

**Interfaces**
- **REST** \`/api/bankAccounts\` — full CRUD (GET/POST/PUT/DELETE) + Swagger UI
- **GraphQL** — \`accountsList\`, \`bankAccountById(id)\`, \`customersList\` queries + add/update/delete mutations (GraphiQL)
- **Spring Data REST** — repository auto-exposed as hypermedia endpoints
- **DTO + mapper** layer keeps entities decoupled from the API surface`,
    longDescriptionFr: `Un microservice en couches propre pour gérer **comptes bancaires et clients**, exposant les mêmes données de trois façons pour comparer API écrites à la main vs auto-générées.

**Architecture en couches**
\`\`\`
Web (contrôleurs REST + resolvers GraphQL + Spring Data REST)
   │
Couche service  (logique métier, @Transactional)
   │
Repositories (Spring Data JPA)
   │
Entités  (BankAccount ── Customer, enum AccountType)
\`\`\`

**Domaine**
| Entité | Champs |
|--------|--------|
| BankAccount | id, date, solde, devise, AccountType, → Customer |
| Customer | possède plusieurs BankAccounts |
| AccountType | enum (ex. CURRENT / SAVINGS) |

**Interfaces**
- **REST** \`/api/bankAccounts\` — CRUD complet (GET/POST/PUT/DELETE) + Swagger UI
- **GraphQL** — requêtes \`accountsList\`, \`bankAccountById(id)\`, \`customersList\` + mutations add/update/delete (GraphiQL)
- **Spring Data REST** — repository auto-exposé en endpoints hypermédia
- Couche **DTO + mapper** qui découple les entités de la surface API`,
    longDescriptionAr: `خدمة مصغّرة نظيفة ذات طبقات لإدارة **الحسابات البنكية والعملاء**، تعرض نفس البيانات بثلاث طرق لمقارنة الواجهات المكتوبة يدوياً مع المُولَّدة تلقائياً.

**البنية الطبقية**
\`\`\`
الويب (وحدات تحكم REST + resolvers لـ GraphQL + Spring Data REST)
   │
طبقة الخدمة  (منطق الأعمال، @Transactional)
   │
المستودعات (Spring Data JPA)
   │
الكيانات  (BankAccount ── Customer، تعداد AccountType)
\`\`\`

**المجال**
| الكيان | الحقول |
|--------|--------|
| BankAccount | المعرّف، التاريخ، الرصيد، العملة، AccountType، → Customer |
| Customer | يملك عدة حسابات |
| AccountType | تعداد (مثلاً CURRENT / SAVINGS) |

**الواجهات**
- **REST** \`/api/bankAccounts\` — CRUD كامل (GET/POST/PUT/DELETE) + Swagger UI
- **GraphQL** — استعلامات \`accountsList\`، \`bankAccountById(id)\`، \`customersList\` + عمليات add/update/delete (GraphiQL)
- **Spring Data REST** — مستودع معروض تلقائياً كنقاط نهاية hypermedia
- طبقة **DTO + mapper** تفصل الكيانات عن سطح الـ API`,
    category: ["backend"],
    tags: ["Spring Boot", "REST", "GraphQL", "Spring Data REST", "JPA", "DTO", "Swagger", "H2"],
    githubUrl: `${GH}/D-veloppement-d-un-micro-service`,
    featured: false,
    metrics: "3 API styles · DTO/mapper · Swagger",
    results: [
      { label: "API interfaces", value: "3" },
      { label: "CRUD endpoints", value: "5" },
      { label: "Store", value: "H2" },
      { label: "Docs", value: "Swagger/GraphiQL" },
    ],
    techStack: ["Java 17", "Spring Boot 3.3", "Spring Data JPA", "GraphQL", "Spring Data REST", "H2", "OpenAPI/Swagger", "Maven"],
    approach: "Layered web→service→repository design exposing one domain via REST, GraphQL and Spring Data REST",
    approachFr: "Conception en couches web→service→repository exposant un domaine via REST, GraphQL et Spring Data REST",
    approachAr: "تصميم طبقي web→service→repository يعرض مجالاً واحداً عبر REST وGraphQL وSpring Data REST",
  },
  {
    id: "blockchain-spring-boot",
    title: "Blockchain from Scratch — Spring Boot",
    titleFr: "Blockchain de Zéro — Spring Boot",
    titleAr: "بلوكشين من الصفر — Spring Boot",
    description: "A pedagogical blockchain in Java/Spring Boot: blocks, a transaction pool (mempool), SHA-256 hashing, Proof-of-Work mining and full chain validation — all driven through a REST API, plus AES and asymmetric-encryption crypto demos.",
    descriptionFr: "Une blockchain pédagogique en Java/Spring Boot : blocs, pool de transactions (mempool), hachage SHA-256, minage Proof-of-Work et validation complète de la chaîne — le tout piloté par une API REST, avec des démos crypto AES et chiffrement asymétrique.",
    descriptionAr: "بلوكشين تعليمية بلغة Java/Spring Boot: كتل، تجمّع معاملات (mempool)، تجزئة SHA-256، تعدين Proof-of-Work وتحقّق كامل من السلسلة — كل ذلك عبر واجهة REST، مع عروض تشفير AES والتشفير غير المتماثل.",
    longDescription: `A from-scratch blockchain implementation that makes the core mechanics visible and testable through a REST API.

**Core components**
| Component | Role |
|-----------|------|
| \`Block\` | index, timestamp, previous/current hash, nonce, data |
| \`Blockchain\` | \`addBlock\`, \`mineBlock\`, \`validateChain\` |
| \`Transaction\` / \`TransactionPool\` | pending transactions (mempool) |
| \`HashUtil\` | SHA-256 hashing |
| \`examples/\` | hashing, symmetric (AES) & asymmetric encryption demos |

**REST API**
\`\`\`
GET  /blockchain                 → full chain
POST /blockchain/transaction     → add tx to the pool
POST /blockchain/mine            → mine a new block (Proof of Work)
GET  /blockchain/block/{index}   → block at index
GET  /blockchain/transaction-pool→ pending transactions
GET  /blockchain/validate        → verify chain integrity
\`\`\`

**Concepts demonstrated**
- **Blocks** chained by hash (each block stores the previous hash)
- **SHA-256** for cryptographic integrity
- **Proof of Work** — nonce search until the hash meets the difficulty target
- **Mempool** of pending transactions consumed at mining time
- **Chain validation** detects any tampering by re-hashing the whole chain

Runs on \`:9999\` via \`./mvnw spring-boot:run\`; \`WORKSHOP.md\` is a step-by-step build guide.`,
    longDescriptionFr: `Une implémentation de blockchain de zéro qui rend les mécanismes fondamentaux visibles et testables via une API REST.

**Composants principaux**
| Composant | Rôle |
|-----------|------|
| \`Block\` | index, timestamp, hash précédent/courant, nonce, données |
| \`Blockchain\` | \`addBlock\`, \`mineBlock\`, \`validateChain\` |
| \`Transaction\` / \`TransactionPool\` | transactions en attente (mempool) |
| \`HashUtil\` | hachage SHA-256 |
| \`examples/\` | démos hachage, chiffrement symétrique (AES) & asymétrique |

**API REST**
\`\`\`
GET  /blockchain                 → chaîne complète
POST /blockchain/transaction     → ajoute une tx au pool
POST /blockchain/mine            → mine un bloc (Proof of Work)
GET  /blockchain/block/{index}   → bloc à l'index
GET  /blockchain/transaction-pool→ transactions en attente
GET  /blockchain/validate        → vérifie l'intégrité de la chaîne
\`\`\`

**Concepts démontrés**
- **Blocs** chaînés par hash (chaque bloc stocke le hash précédent)
- **SHA-256** pour l'intégrité cryptographique
- **Proof of Work** — recherche de nonce jusqu'à atteindre la difficulté
- **Mempool** de transactions consommées au minage
- **Validation de chaîne** détectant toute altération par re-hachage complet

Tourne sur \`:9999\` via \`./mvnw spring-boot:run\` ; \`WORKSHOP.md\` est un guide pas-à-pas.`,
    longDescriptionAr: `تطبيق بلوكشين من الصفر يجعل الآليات الأساسية مرئية وقابلة للاختبار عبر واجهة REST.

**المكوّنات الأساسية**
| المكوّن | الدور |
|-----------|------|
| \`Block\` | المؤشر، الطابع الزمني، الهاش السابق/الحالي، nonce، البيانات |
| \`Blockchain\` | \`addBlock\`، \`mineBlock\`، \`validateChain\` |
| \`Transaction\` / \`TransactionPool\` | المعاملات المعلّقة (mempool) |
| \`HashUtil\` | تجزئة SHA-256 |
| \`examples/\` | عروض التجزئة والتشفير المتماثل (AES) وغير المتماثل |

**واجهة REST**
\`\`\`
GET  /blockchain                 → السلسلة الكاملة
POST /blockchain/transaction     → إضافة معاملة إلى التجمّع
POST /blockchain/mine            → تعدين كتلة (Proof of Work)
GET  /blockchain/block/{index}   → كتلة عند المؤشر
GET  /blockchain/transaction-pool→ المعاملات المعلّقة
GET  /blockchain/validate        → التحقق من سلامة السلسلة
\`\`\`

**المفاهيم الموضَّحة**
- **كتل** مترابطة بالهاش (كل كتلة تخزّن الهاش السابق)
- **SHA-256** للسلامة التشفيرية
- **Proof of Work** — البحث عن nonce حتى بلوغ الصعوبة المطلوبة
- **mempool** للمعاملات المعلّقة تُستهلَك عند التعدين
- **التحقق من السلسلة** يكشف أي تلاعب بإعادة تجزئة السلسلة كاملة

يعمل على \`:9999\` عبر \`./mvnw spring-boot:run\`؛ و\`WORKSHOP.md\` دليل بناء خطوة بخطوة.`,
    category: ["backend"],
    tags: ["Blockchain", "Proof of Work", "SHA-256", "Cryptography", "Spring Boot", "REST", "AES"],
    githubUrl: `${GH}/Blockchain`,
    featured: false,
    metrics: "PoW mining · SHA-256 · chain validation",
    results: [
      { label: "Consensus", value: "Proof of Work" },
      { label: "Hashing", value: "SHA-256" },
      { label: "REST endpoints", value: "6" },
      { label: "Crypto demos", value: "AES + RSA" },
    ],
    techStack: ["Java 17", "Spring Boot 3.0", "SHA-256", "AES / asymmetric crypto", "Maven"],
    approach: "Implement blocks + mempool + PoW mining + chain validation, all exposed and testable via REST",
    approachFr: "Implémenter blocs + mempool + minage PoW + validation de chaîne, le tout exposé et testable via REST",
    approachAr: "تنفيذ الكتل + mempool + تعدين PoW + التحقق من السلسلة، كلها معروضة وقابلة للاختبار عبر REST",
  },
  {
    id: "session-reservation-system",
    title: "Session Reservation System — Angular + Spring Boot",
    titleFr: "Système de Réservation de Sessions — Angular + Spring Boot",
    titleAr: "نظام حجز الجلسات — Angular + Spring Boot",
    description: "Full-stack reservation app: an Angular 17 UI over a Spring Boot 3.3 REST API (JPA, MySQL/H2) managing users, bookable sessions with capacity, reservations with status tracking, and jury members assigned to sessions.",
    descriptionFr: "Application de réservation full-stack : une UI Angular 17 sur une API REST Spring Boot 3.3 (JPA, MySQL/H2) gérant utilisateurs, sessions réservables avec capacité, réservations avec suivi de statut, et membres de jury affectés aux sessions.",
    descriptionAr: "تطبيق حجز متكامل: واجهة Angular 17 فوق واجهة REST بـ Spring Boot 3.3 (JPA، MySQL/H2) تدير المستخدمين، والجلسات القابلة للحجز بسعة محددة، والحجوزات مع تتبّع الحالة، وأعضاء لجنة التحكيم المعيَّنين للجلسات.",
    longDescription: `A full-stack booking system pairing an **Angular 17** front end with a **Spring Boot 3.3** REST back end.

**Structure**
\`\`\`
frontend/  → Angular 17 SPA (users, sessions, reservations, jury)
backend/   → Spring Boot 3.3 REST API (JPA, MySQL in prod / H2 in test)
\`\`\`

**Data model**
| Entity | Description |
|--------|-------------|
| User | name, email, Role |
| Session | bookable session (date, time slots, capacity) |
| Reservation | links a User to a Session, with ReservationStatus |
| JuryMember | jury member attached to a session |

**REST endpoints**
\`\`\`
GET /users         → list users
GET /Sessions      → list bookable sessions
GET /Reservations  → list reservations
GET /JuryMembers   → list jury members
\`\`\`

Backend runs on \`:8087\`; the Angular client on \`:4200\`. Status tracking on reservations supports the booking lifecycle, and capacity on sessions guards over-booking.`,
    longDescriptionFr: `Un système de réservation full-stack associant un front **Angular 17** à un back REST **Spring Boot 3.3**.

**Structure**
\`\`\`
frontend/  → SPA Angular 17 (utilisateurs, sessions, réservations, jury)
backend/   → API REST Spring Boot 3.3 (JPA, MySQL en prod / H2 en test)
\`\`\`

**Modèle de données**
| Entité | Description |
|--------|-------------|
| User | nom, email, Role |
| Session | session réservable (date, horaires, capacité) |
| Reservation | relie un User à une Session, avec ReservationStatus |
| JuryMember | membre de jury rattaché à une session |

**Endpoints REST**
\`\`\`
GET /users         → liste des utilisateurs
GET /Sessions      → liste des sessions réservables
GET /Reservations  → liste des réservations
GET /JuryMembers   → liste des membres du jury
\`\`\`

Le backend tourne sur \`:8087\` ; le client Angular sur \`:4200\`. Le suivi de statut gère le cycle de vie des réservations, et la capacité des sessions évite la surréservation.`,
    longDescriptionAr: `نظام حجز متكامل يجمع واجهة **Angular 17** مع خلفية REST بـ **Spring Boot 3.3**.

**الهيكل**
\`\`\`
frontend/  → واجهة Angular 17 (المستخدمون، الجلسات، الحجوزات، اللجنة)
backend/   → واجهة REST بـ Spring Boot 3.3 (JPA، MySQL في الإنتاج / H2 في الاختبار)
\`\`\`

**نموذج البيانات**
| الكيان | الوصف |
|--------|-------------|
| User | الاسم، البريد، الدور |
| Session | جلسة قابلة للحجز (التاريخ، الأوقات، السعة) |
| Reservation | تربط مستخدماً بجلسة، مع ReservationStatus |
| JuryMember | عضو لجنة مرتبط بجلسة |

**نقاط نهاية REST**
\`\`\`
GET /users         → قائمة المستخدمين
GET /Sessions      → قائمة الجلسات القابلة للحجز
GET /Reservations  → قائمة الحجوزات
GET /JuryMembers   → قائمة أعضاء اللجنة
\`\`\`

تعمل الخلفية على \`:8087\`؛ وعميل Angular على \`:4200\`. يدير تتبّع الحالة دورة حياة الحجوزات، وتمنع سعة الجلسة تجاوز الحجز.`,
    category: ["backend"],
    tags: ["Angular", "Spring Boot", "REST", "JPA", "MySQL", "Full-Stack", "TypeScript"],
    githubUrl: `${GH}/Reservation_System`,
    featured: false,
    metrics: "Full-stack · Angular 17 + Spring Boot 3.3",
    results: [
      { label: "Frontend", value: "Angular 17" },
      { label: "Backend", value: "Spring Boot 3.3" },
      { label: "Core entities", value: "4" },
      { label: "Database", value: "MySQL / H2" },
    ],
    techStack: ["Angular 17", "TypeScript", "Java 17", "Spring Boot 3.3", "Spring Data JPA", "MySQL", "H2"],
    approach: "Angular SPA over a Spring Boot REST API with status-tracked reservations and capacity-bounded sessions",
    approachFr: "SPA Angular sur une API REST Spring Boot avec réservations à statut suivi et sessions à capacité limitée",
    approachAr: "واجهة Angular فوق واجهة REST بـ Spring Boot مع حجوزات متتبَّعة الحالة وجلسات محدودة السعة",
  },
  {
    id: "soap-microbank",
    title: "MicroBank — SOAP Web Service (JAX-WS)",
    titleFr: "MicroBank — Web Service SOAP (JAX-WS)",
    titleAr: "MicroBank — خدمة ويب SOAP (JAX-WS)",
    description: "A SOAP web service built with JAX-WS: a standalone 'MicroBank' endpoint exposing currency conversion and account operations, plus a client that consumes it through a stub generated from the WSDL with wsimport.",
    descriptionFr: "Un web service SOAP avec JAX-WS : un endpoint « MicroBank » standalone exposant conversion de devises et opérations de compte, plus un client qui le consomme via un stub généré depuis le WSDL avec wsimport.",
    descriptionAr: "خدمة ويب SOAP مبنية بـ JAX-WS: نقطة نهاية «MicroBank» مستقلة تعرض تحويل العملات وعمليات الحسابات، إضافة إلى عميل يستهلكها عبر stub مُولَّد من WSDL باستخدام wsimport.",
    longDescription: `A classic **SOAP / WSDL** exercise: a banking service published as a standalone JAX-WS endpoint, and a separate client that talks to it through contract-first generated stubs.

**Structure**
\`\`\`
microbank-soap-service/   → publishes the @WebService Endpoint on :9090
  └── service/MicroBank   → toMAD, getAccount, getAccounts
  └── entities/Account
microbank-soap-client/    → BankWSClient
  └── proxy/              → classes generated from the WSDL (wsimport)
\`\`\`

**Operations (@WebService BankWS)**
| Operation | Param | Returns | Description |
|-----------|-------|---------|-------------|
| toMAD | double euroAmount | double | EUR → MAD conversion (×15) |
| getAccount | int code | Account | one account (random balance) |
| getAccounts | — | List<Account> | all accounts |

**Workflow**
1. Publish the service: \`mvn exec:java -Dexec.mainClass=…BankWSApp\`
2. Generate the client stub from the live WSDL: \`wsimport -keep -p …proxy http://localhost:9090/?wsdl\`
3. Run the client to invoke the remote operations

The build was modernized: swapped the wrong \`jaxws-maven-plugin\` for \`jaxws-rt\`, aligned to Java 17, flattened the layout.`,
    longDescriptionFr: `Un exercice **SOAP / WSDL** classique : un service bancaire publié comme endpoint JAX-WS standalone, et un client séparé qui le consomme via des stubs générés contract-first.

**Structure**
\`\`\`
microbank-soap-service/   → publie l'Endpoint @WebService sur :9090
  └── service/MicroBank   → toMAD, getAccount, getAccounts
  └── entities/Account
microbank-soap-client/    → BankWSClient
  └── proxy/              → classes générées depuis le WSDL (wsimport)
\`\`\`

**Opérations (@WebService BankWS)**
| Opération | Param | Retour | Description |
|-----------|-------|--------|-------------|
| toMAD | double euroAmount | double | conversion EUR → MAD (×15) |
| getAccount | int code | Account | un compte (solde aléatoire) |
| getAccounts | — | List<Account> | tous les comptes |

**Workflow**
1. Publier le service : \`mvn exec:java -Dexec.mainClass=…BankWSApp\`
2. Générer le stub client depuis le WSDL : \`wsimport -keep -p …proxy http://localhost:9090/?wsdl\`
3. Lancer le client pour invoquer les opérations distantes

Le build a été modernisé : remplacement du mauvais \`jaxws-maven-plugin\` par \`jaxws-rt\`, alignement Java 17, aplatissement de l'arborescence.`,
    longDescriptionAr: `تمرين **SOAP / WSDL** كلاسيكي: خدمة بنكية تُنشَر كنقطة نهاية JAX-WS مستقلة، وعميل منفصل يتواصل معها عبر stubs مُولَّدة وفق العقد أولاً.

**الهيكل**
\`\`\`
microbank-soap-service/   → ينشر نقطة @WebService على :9090
  └── service/MicroBank   → toMAD، getAccount، getAccounts
  └── entities/Account
microbank-soap-client/    → BankWSClient
  └── proxy/              → فئات مُولَّدة من WSDL (wsimport)
\`\`\`

**العمليات (@WebService BankWS)**
| العملية | المُدخل | المُخرَج | الوصف |
|-----------|-------|--------|-------------|
| toMAD | double euroAmount | double | تحويل EUR → MAD (×15) |
| getAccount | int code | Account | حساب واحد (رصيد عشوائي) |
| getAccounts | — | List<Account> | كل الحسابات |

**سير العمل**
1. نشر الخدمة: \`mvn exec:java -Dexec.mainClass=…BankWSApp\`
2. توليد stub العميل من WSDL: \`wsimport -keep -p …proxy http://localhost:9090/?wsdl\`
3. تشغيل العميل لاستدعاء العمليات البعيدة

جرى تحديث البناء: استبدال \`jaxws-maven-plugin\` الخاطئ بـ \`jaxws-rt\`، والمواءمة مع Java 17، وتبسيط الهيكل.`,
    category: ["backend"],
    tags: ["SOAP", "JAX-WS", "WSDL", "wsimport", "Web Services", "Java"],
    githubUrl: `${GH}/Web-services-SOAP2`,
    featured: false,
    metrics: "JAX-WS · WSDL contract-first · standalone endpoint",
    results: [
      { label: "Protocol", value: "SOAP" },
      { label: "Stack", value: "JAX-WS" },
      { label: "Operations", value: "3" },
      { label: "Client", value: "WSDL stub" },
    ],
    techStack: ["Java 17", "JAX-WS (jaxws-rt)", "SOAP / WSDL", "wsimport", "Maven"],
    approach: "Publish a standalone JAX-WS endpoint, then consume it via contract-first stubs generated from the WSDL",
    approachFr: "Publier un endpoint JAX-WS standalone, puis le consommer via des stubs contract-first générés depuis le WSDL",
    approachAr: "نشر نقطة نهاية JAX-WS مستقلة، ثم استهلاكها عبر stubs وفق العقد مُولَّدة من WSDL",
  },
  {
    id: "hospital-mvc-security",
    title: "Hospital Management — Spring MVC + Security",
    titleFr: "Gestion d'Hôpital — Spring MVC + Security",
    titleAr: "إدارة مستشفى — Spring MVC + Security",
    description: "A complete patient-management web app: Spring MVC + Spring Data JPA + Thymeleaf with paginated search, form validation, and Spring Security 6 form login with remember-me and role-based authorization (USER vs ADMIN).",
    descriptionFr: "Une application web complète de gestion de patients : Spring MVC + Spring Data JPA + Thymeleaf avec recherche paginée, validation de formulaires, et Spring Security 6 (login formulaire, remember-me, autorisation par rôles USER vs ADMIN).",
    descriptionAr: "تطبيق ويب كامل لإدارة المرضى: Spring MVC + Spring Data JPA + Thymeleaf مع بحث مُقسَّم لصفحات، والتحقق من النماذج، وSpring Security 6 (تسجيل دخول بنموذج، remember-me، وتفويض حسب الأدوار USER مقابل ADMIN).",
    longDescription: `A full server-rendered web app for managing hospital **patients**, secured end-to-end with Spring Security 6.

**Features**
- 📋 Paginated patient list + search by name
- ➕ Add patient with validation (\`@NotEmpty\`, \`@Size\`, \`@DecimalMin\`)
- ✏️ Edit / 🗑️ delete — **restricted to admins**
- 🔐 Form login, remember-me, custom "not authorized" page
- 👥 Role-based routes: \`/user/**\` → USER, \`/admin/**\` → ADMIN

**Architecture**
\`\`\`
security/    → SecurityConfig (filter chain), SecurityController
web/         → PatientController (CRUD, pagination, @PreAuthorize)
repository/  → PatientRepository (JpaRepository)
entities/    → Patient (JPA + Bean Validation)
templates/   → Thymeleaf views with a shared layout (Bootstrap 5)
\`\`\`

**Auth model**
In-memory users with **BCrypt** hashing: \`user1/user2\` (USER) and \`admin\` (USER + ADMIN). Method-level \`@PreAuthorize\` guards mutations while read views stay open to authenticated users. Runs on \`:8084\` with a MySQL \`hopital\` schema (auto-created), H2 for tests.`,
    longDescriptionFr: `Une application web entièrement rendue côté serveur pour gérer les **patients** d'un hôpital, sécurisée de bout en bout avec Spring Security 6.

**Fonctionnalités**
- 📋 Liste paginée + recherche par nom
- ➕ Ajout de patient avec validation (\`@NotEmpty\`, \`@Size\`, \`@DecimalMin\`)
- ✏️ Édition / 🗑️ suppression — **réservées aux admins**
- 🔐 Login formulaire, remember-me, page « non autorisé » personnalisée
- 👥 Routes par rôle : \`/user/**\` → USER, \`/admin/**\` → ADMIN

**Architecture**
\`\`\`
security/    → SecurityConfig (filter chain), SecurityController
web/         → PatientController (CRUD, pagination, @PreAuthorize)
repository/  → PatientRepository (JpaRepository)
entities/    → Patient (JPA + Bean Validation)
templates/   → vues Thymeleaf avec layout commun (Bootstrap 5)
\`\`\`

**Modèle d'authentification**
Utilisateurs en mémoire avec hachage **BCrypt** : \`user1/user2\` (USER) et \`admin\` (USER + ADMIN). Les \`@PreAuthorize\` au niveau méthode protègent les mutations tandis que les vues en lecture restent ouvertes aux utilisateurs authentifiés. Tourne sur \`:8084\` avec un schéma MySQL \`hopital\` (auto-créé), H2 pour les tests.`,
    longDescriptionAr: `تطبيق ويب مُصيَّر بالكامل من الخادم لإدارة **مرضى** المستشفى، مؤمَّن من طرف إلى طرف بـ Spring Security 6.

**الميزات**
- 📋 قائمة مرضى مُقسَّمة لصفحات + بحث بالاسم
- ➕ إضافة مريض مع التحقق (\`@NotEmpty\`، \`@Size\`، \`@DecimalMin\`)
- ✏️ تعديل / 🗑️ حذف — **مقتصر على المدراء**
- 🔐 تسجيل دخول بنموذج، remember-me، صفحة «غير مصرّح» مخصّصة
- 👥 مسارات حسب الدور: \`/user/**\` → USER، \`/admin/**\` → ADMIN

**البنية**
\`\`\`
security/    → SecurityConfig (سلسلة المرشّحات)، SecurityController
web/         → PatientController (CRUD، ترقيم، @PreAuthorize)
repository/  → PatientRepository (JpaRepository)
entities/    → Patient (JPA + التحقق)
templates/   → واجهات Thymeleaf بتخطيط مشترك (Bootstrap 5)
\`\`\`

**نموذج المصادقة**
مستخدمون في الذاكرة بتجزئة **BCrypt**: \`user1/user2\` (USER) و\`admin\` (USER + ADMIN). تحمي \`@PreAuthorize\` على مستوى الدوال عمليات التعديل بينما تبقى واجهات القراءة متاحة للمستخدمين المصادَق عليهم. يعمل على \`:8084\` مع مخطط MySQL \`hopital\` (يُنشأ تلقائياً)، وH2 للاختبارات.`,
    category: ["backend"],
    tags: ["Spring MVC", "Spring Security", "Thymeleaf", "Spring Data JPA", "RBAC", "BCrypt", "Bootstrap"],
    githubUrl: `${GH}/Spring-MVC-Spring-Data-JPA-Thymeleaf`,
    featured: false,
    metrics: "RBAC · form login · validation · pagination",
    results: [
      { label: "Security", value: "Spring Security 6" },
      { label: "Roles", value: "USER / ADMIN" },
      { label: "View engine", value: "Thymeleaf" },
      { label: "Validation", value: "Bean Validation" },
    ],
    techStack: ["Java 17", "Spring Boot 3.2", "Spring MVC", "Spring Security 6", "Spring Data JPA", "Thymeleaf", "Bootstrap 5", "MySQL", "H2"],
    approach: "Server-rendered MVC + JPA with method-level @PreAuthorize role guards and BCrypt form authentication",
    approachFr: "MVC + JPA rendu serveur avec gardes de rôle @PreAuthorize au niveau méthode et authentification BCrypt",
    approachAr: "MVC + JPA مُصيَّر من الخادم مع حراسة أدوار @PreAuthorize على مستوى الدوال ومصادقة BCrypt",
  },
  {
    id: "hospital-mvc-thymeleaf",
    title: "Hospital Patients — Spring Boot MVC + Thymeleaf",
    titleFr: "Patients d'Hôpital — Spring Boot MVC + Thymeleaf",
    titleAr: "مرضى المستشفى — Spring Boot MVC + Thymeleaf",
    description: "A focused Spring Boot MVC + Thymeleaf web app: a paginated patient table (3 per page), search by name via a derived query, delete with confirmation, and a shared decorated layout — seeded with a profile-guarded CommandLineRunner and tested with MockMvc on H2.",
    descriptionFr: "Une application web Spring Boot MVC + Thymeleaf ciblée : table de patients paginée (3 par page), recherche par nom via requête dérivée, suppression avec confirmation, et layout décoré partagé — initialisée par un CommandLineRunner gardé par profil et testée avec MockMvc sur H2.",
    descriptionAr: "تطبيق ويب Spring Boot MVC + Thymeleaf مركّز: جدول مرضى مُقسَّم لصفحات (3 لكل صفحة)، بحث بالاسم عبر استعلام مُشتق، حذف مع تأكيد، وتخطيط مزخرف مشترك — مُهيَّأ عبر CommandLineRunner محميّ بالملف الشخصي ومُختبَر بـ MockMvc على H2.",
    longDescription: `A compact, well-tested **Spring MVC + Thymeleaf** patient app — the clean MVC baseline before security and validation are layered on.

**Features**
- 📋 Paginated patient list (3 per page)
- 🔎 Search by name via the derived query \`findByNomContains\`
- 🗑️ Delete a patient (with confirmation)
- 🎨 Shared layout (\`template1.html\`) applied through layout decoration

**Architecture**
\`\`\`
web/         → PatientController (@Controller, pagination & search)
repository/  → PatientRepository (JpaRepository + query derivation)
entities/    → Patient (JPA entity, Lombok @Data/@Builder)
templates/   → patients.html decorated by template1.html
\`\`\`

**Engineering polish**
- Fixed Thymeleaf layout syntax: \`layout:decorate="template1"\` → \`layout:decorate="~{template1}"\`
- Moved data rows into \`<tbody>\`
- Seed data via \`@Bean CommandLineRunner\` guarded with \`@Profile("!test")\`
- Added an **H2 test profile** and **MockMvc** web tests

Runs on \`:8084/index\` with MySQL (or H2 for tests), Bootstrap 5 via WebJars.`,
    longDescriptionFr: `Une application patients **Spring MVC + Thymeleaf** compacte et bien testée — la base MVC propre avant l'ajout de la sécurité et de la validation.

**Fonctionnalités**
- 📋 Liste de patients paginée (3 par page)
- 🔎 Recherche par nom via la requête dérivée \`findByNomContains\`
- 🗑️ Suppression d'un patient (avec confirmation)
- 🎨 Layout partagé (\`template1.html\`) appliqué par décoration de layout

**Architecture**
\`\`\`
web/         → PatientController (@Controller, pagination & recherche)
repository/  → PatientRepository (JpaRepository + dérivation de requête)
entities/    → Patient (entité JPA, Lombok @Data/@Builder)
templates/   → patients.html décoré par template1.html
\`\`\`

**Finitions d'ingénierie**
- Correction syntaxe layout Thymeleaf : \`layout:decorate="template1"\` → \`layout:decorate="~{template1}"\`
- Déplacement des lignes de données vers \`<tbody>\`
- Données d'amorçage via \`@Bean CommandLineRunner\` gardé par \`@Profile("!test")\`
- Ajout d'un **profil de test H2** et de tests web **MockMvc**

Tourne sur \`:8084/index\` avec MySQL (ou H2 pour les tests), Bootstrap 5 via WebJars.`,
    longDescriptionAr: `تطبيق مرضى **Spring MVC + Thymeleaf** مُدمج ومُختبَر جيداً — قاعدة MVC النظيفة قبل إضافة الأمان والتحقق.

**الميزات**
- 📋 قائمة مرضى مُقسَّمة لصفحات (3 لكل صفحة)
- 🔎 بحث بالاسم عبر الاستعلام المُشتق \`findByNomContains\`
- 🗑️ حذف مريض (مع تأكيد)
- 🎨 تخطيط مشترك (\`template1.html\`) مطبَّق عبر زخرفة التخطيط

**البنية**
\`\`\`
web/         → PatientController (@Controller، ترقيم وبحث)
repository/  → PatientRepository (JpaRepository + اشتقاق الاستعلام)
entities/    → Patient (كيان JPA، Lombok @Data/@Builder)
templates/   → patients.html مزخرف بـ template1.html
\`\`\`

**لمسات هندسية**
- تصحيح صيغة تخطيط Thymeleaf: \`layout:decorate="template1"\` → \`layout:decorate="~{template1}"\`
- نقل صفوف البيانات إلى \`<tbody>\`
- بيانات أولية عبر \`@Bean CommandLineRunner\` محميّ بـ \`@Profile("!test")\`
- إضافة **ملف اختبار H2** واختبارات ويب **MockMvc**

يعمل على \`:8084/index\` مع MySQL (أو H2 للاختبارات)، وBootstrap 5 عبر WebJars.`,
    category: ["backend"],
    tags: ["Spring MVC", "Thymeleaf", "Spring Data JPA", "Pagination", "MockMvc", "Lombok", "Bootstrap"],
    githubUrl: `${GH}/Spring-Boot-Spring-MVC`,
    featured: false,
    metrics: "MVC + Thymeleaf · pagination · MockMvc tests",
    results: [
      { label: "View engine", value: "Thymeleaf" },
      { label: "Page size", value: "3 / page" },
      { label: "Tests", value: "MockMvc + H2" },
      { label: "Search", value: "derived query" },
    ],
    techStack: ["Java 17", "Spring Boot 3.2", "Spring MVC", "Thymeleaf + Layout Dialect", "Spring Data JPA", "Lombok", "MySQL", "H2", "MockMvc"],
    approach: "Clean MVC baseline: controller + derived-query repository + decorated Thymeleaf views, MockMvc-tested",
    approachFr: "Base MVC propre : contrôleur + repository à requête dérivée + vues Thymeleaf décorées, testée via MockMvc",
    approachAr: "قاعدة MVC نظيفة: وحدة تحكم + مستودع باستعلام مُشتق + واجهات Thymeleaf مزخرفة، مُختبَرة بـ MockMvc",
  },
  {
    id: "hospital-jpa-relations",
    title: "Hospital Domain — Spring Data JPA Relations",
    titleFr: "Domaine Hôpital — Relations Spring Data JPA",
    titleAr: "مجال المستشفى — علاقات Spring Data JPA",
    description: "A Spring Data JPA modeling study on a hospital domain: Patient, Medecin, RendezVous and Consultation entities wired with @OneToMany, @ManyToOne and @OneToOne, a transactional service layer, derived repositories and a REST endpoint.",
    descriptionFr: "Une étude de modélisation Spring Data JPA sur un domaine hospitalier : entités Patient, Medecin, RendezVous et Consultation reliées par @OneToMany, @ManyToOne et @OneToOne, couche service transactionnelle, repositories dérivés et endpoint REST.",
    descriptionAr: "دراسة نمذجة بـ Spring Data JPA على مجال مستشفى: كيانات Patient وMedecin وRendezVous وConsultation مرتبطة بـ @OneToMany و@ManyToOne و@OneToOne، طبقة خدمة معامِلاتية، مستودعات مُشتقة، ونقطة نهاية REST.",
    longDescription: `A focused study of **JPA relationship mapping** on a healthcare domain — the data-modeling foundation behind the hospital web apps.

**Data model**
\`\`\`
Patient 1 ───< RendezVous >─── 1 Medecin
                  │ 1
                  ▼ 1
            Consultation
\`\`\`

| Entity | Description | Relations |
|--------|-------------|-----------|
| Patient | name, date of birth, sick flag | \`@OneToMany\` → RendezVous |
| Medecin | name, email, specialty | \`@OneToMany\` → RendezVous |
| RendezVous | date, status | \`@ManyToOne\` Patient & Medecin, \`@OneToOne\` Consultation |
| Consultation | date, report | \`@OneToOne\` RendezVous |
| StatusRDV | enum: PENDING / CANCELED / DONE | — |

**Layered architecture**
\`\`\`
Web (REST controllers) → Service (@Transactional) → Repositories (Spring Data JPA) → Entities
\`\`\`

Demonstrates bidirectional associations, an enum-typed status, derived-query repositories and a \`GET /patients\` endpoint. Runs on \`:8087\` with MySQL (auto-creates \`hospital-db\`); H2 for tests.`,
    longDescriptionFr: `Une étude ciblée du **mapping de relations JPA** sur un domaine de santé — la fondation de modélisation derrière les apps web hôpital.

**Modèle de données**
\`\`\`
Patient 1 ───< RendezVous >─── 1 Medecin
                  │ 1
                  ▼ 1
            Consultation
\`\`\`

| Entité | Description | Relations |
|--------|-------------|-----------|
| Patient | nom, date de naissance, malade | \`@OneToMany\` → RendezVous |
| Medecin | nom, email, spécialité | \`@OneToMany\` → RendezVous |
| RendezVous | date, statut | \`@ManyToOne\` Patient & Medecin, \`@OneToOne\` Consultation |
| Consultation | date, rapport | \`@OneToOne\` RendezVous |
| StatusRDV | enum : PENDING / CANCELED / DONE | — |

**Architecture en couches**
\`\`\`
Web (contrôleurs REST) → Service (@Transactional) → Repositories (Spring Data JPA) → Entités
\`\`\`

Démontre les associations bidirectionnelles, un statut typé enum, des repositories à requêtes dérivées et un endpoint \`GET /patients\`. Tourne sur \`:8087\` avec MySQL (crée \`hospital-db\`) ; H2 pour les tests.`,
    longDescriptionAr: `دراسة مركّزة لـ **ربط علاقات JPA** على مجال صحي — أساس النمذجة خلف تطبيقات ويب المستشفى.

**نموذج البيانات**
\`\`\`
Patient 1 ───< RendezVous >─── 1 Medecin
                  │ 1
                  ▼ 1
            Consultation
\`\`\`

| الكيان | الوصف | العلاقات |
|--------|-------------|-----------|
| Patient | الاسم، تاريخ الميلاد، مريض | \`@OneToMany\` → RendezVous |
| Medecin | الاسم، البريد، التخصص | \`@OneToMany\` → RendezVous |
| RendezVous | التاريخ، الحالة | \`@ManyToOne\` Patient وMedecin، \`@OneToOne\` Consultation |
| Consultation | التاريخ، التقرير | \`@OneToOne\` RendezVous |
| StatusRDV | تعداد: PENDING / CANCELED / DONE | — |

**البنية الطبقية**
\`\`\`
الويب (وحدات تحكم REST) → الخدمة (@Transactional) → المستودعات (Spring Data JPA) → الكيانات
\`\`\`

يوضّح الارتباطات ثنائية الاتجاه، وحالة من نوع تعداد، ومستودعات باستعلامات مُشتقة، ونقطة \`GET /patients\`. يعمل على \`:8087\` مع MySQL (يُنشئ \`hospital-db\`)؛ وH2 للاختبارات.`,
    category: ["backend"],
    tags: ["Spring Data JPA", "Hibernate", "JPA Relations", "Entity Modeling", "Spring Boot", "MySQL"],
    githubUrl: `${GH}/Spring-Data-JPA`,
    featured: false,
    metrics: "4 entities · @OneToMany/@ManyToOne/@OneToOne",
    results: [
      { label: "Entities", value: "4" },
      { label: "Relation types", value: "3" },
      { label: "ORM", value: "Hibernate" },
      { label: "Service layer", value: "@Transactional" },
    ],
    techStack: ["Java 17", "Spring Boot 3.2", "Spring Data JPA", "Hibernate", "MySQL", "H2", "Maven"],
    approach: "Model a healthcare domain with bidirectional JPA relations behind a transactional service layer",
    approachFr: "Modéliser un domaine de santé avec des relations JPA bidirectionnelles derrière une couche service transactionnelle",
    approachAr: "نمذجة مجال صحي بعلاقات JPA ثنائية الاتجاه خلف طبقة خدمة معامِلاتية",
  },
  {
    id: "spring-dependency-injection",
    title: "Dependency Injection & IoC — Four Techniques",
    titleFr: "Injection de Dépendances & IoC — Quatre Techniques",
    titleAr: "حقن التبعيات وعكس التحكّم — أربع تقنيات",
    description: "A hands-on study of Inversion of Control in Java: the same DAO/business layering wired four ways — manual setter injection, reflection-based dynamic loading from a config file, Spring XML container config, and Spring annotation scanning (@Component/@Autowired).",
    descriptionFr: "Une étude pratique de l'inversion de contrôle en Java : le même découpage DAO/métier câblé de quatre façons — injection par setter manuelle, chargement dynamique par réflexion depuis un fichier de config, config conteneur Spring XML, et scan d'annotations Spring (@Component/@Autowired).",
    descriptionAr: "دراسة عملية لعكس التحكّم في Java: نفس تقسيم DAO/الأعمال موصولاً بأربع طرق — حقن يدوي عبر setter، تحميل ديناميكي بالـ reflection من ملف إعداد، إعداد حاوية Spring XML، ومسح تعليقات Spring (@Component/@Autowired).",
    longDescription: `A foundational walkthrough of **Inversion of Control & Dependency Injection** — "depend on interfaces, not implementations" — building the same app four different ways.

**Structure**
\`\`\`
java-ioc-1/   (Maven + Spring 6)
  ├── dao/          IDao + implementations
  ├── metier/       IMetier + implementations
  └── presentation/ 4 injection demos
enset_ioc/    (pure-Java starting point)
\`\`\`

**Four injection techniques**
| Demo | Method | How |
|------|--------|-----|
| Presentation | Static | manual \`new\` + setter injection |
| Presentation2 | Dynamic | reflection-based class loading from \`config.txt\` |
| Presentationxml | Spring XML | container wiring via \`applicationContext.xml\` |
| PresentationAnnotation | Spring Annotations | \`@Component\` + \`@Autowired\` component scanning |

**Why it matters**
The \`IDao\` (data-access contract) and \`IMetier\` (business contract) are coupled only through interfaces, so the container — not the code — decides which implementation is injected. This is the principle every later Spring project in this collection relies on.`,
    longDescriptionFr: `Un parcours fondamental de l'**inversion de contrôle & injection de dépendances** — « dépendre des interfaces, pas des implémentations » — en construisant la même app de quatre façons.

**Structure**
\`\`\`
java-ioc-1/   (Maven + Spring 6)
  ├── dao/          IDao + implémentations
  ├── metier/       IMetier + implémentations
  └── presentation/ 4 démos d'injection
enset_ioc/    (point de départ Java pur)
\`\`\`

**Quatre techniques d'injection**
| Démo | Méthode | Comment |
|------|---------|---------|
| Presentation | Statique | \`new\` manuel + injection par setter |
| Presentation2 | Dynamique | chargement de classe par réflexion depuis \`config.txt\` |
| Presentationxml | Spring XML | câblage conteneur via \`applicationContext.xml\` |
| PresentationAnnotation | Annotations Spring | scan \`@Component\` + \`@Autowired\` |

**Pourquoi c'est important**
\`IDao\` (contrat d'accès aux données) et \`IMetier\` (contrat métier) ne sont couplés que par interfaces, donc c'est le conteneur — pas le code — qui décide quelle implémentation injecter. C'est le principe sur lequel reposent tous les projets Spring suivants de cette collection.`,
    longDescriptionAr: `جولة تأسيسية في **عكس التحكّم وحقن التبعيات** — «اعتمِد على الواجهات لا على التنفيذ» — ببناء نفس التطبيق بأربع طرق.

**الهيكل**
\`\`\`
java-ioc-1/   (Maven + Spring 6)
  ├── dao/          IDao + التنفيذات
  ├── metier/       IMetier + التنفيذات
  └── presentation/ 4 عروض للحقن
enset_ioc/    (نقطة بداية بـ Java الخالص)
\`\`\`

**أربع تقنيات حقن**
| العرض | الطريقة | الكيفية |
|------|---------|---------|
| Presentation | ثابتة | \`new\` يدوي + حقن عبر setter |
| Presentation2 | ديناميكية | تحميل فئة بالـ reflection من \`config.txt\` |
| Presentationxml | Spring XML | ربط عبر الحاوية بـ \`applicationContext.xml\` |
| PresentationAnnotation | تعليقات Spring | مسح \`@Component\` + \`@Autowired\` |

**لماذا يهمّ**
\`IDao\` (عقد الوصول للبيانات) و\`IMetier\` (عقد الأعمال) مرتبطان عبر الواجهات فقط، فالحاوية — لا الكود — هي من تقرر أي تنفيذ يُحقَن. هذا هو المبدأ الذي تعتمد عليه كل مشاريع Spring اللاحقة في هذه المجموعة.`,
    category: ["backend"],
    tags: ["Spring", "IoC", "Dependency Injection", "Reflection", "XML Config", "Annotations", "Java"],
    githubUrl: `${GH}/Mise-en-oeuvre-de-l-injection-des-d-pendances`,
    featured: false,
    metrics: "4 DI techniques · interface-driven design",
    results: [
      { label: "Injection techniques", value: "4" },
      { label: "Framework", value: "Spring 6" },
      { label: "Contracts", value: "IDao + IMetier" },
      { label: "Wiring", value: "XML + annotations" },
    ],
    techStack: ["Java 17", "Spring 6.1", "Maven", "Reflection API"],
    approach: "Implement one interface-driven app four ways: static, dynamic reflection, Spring XML, Spring annotations",
    approachFr: "Implémenter une app pilotée par interfaces de quatre façons : statique, réflexion dynamique, XML Spring, annotations Spring",
    approachAr: "تنفيذ تطبيق واحد موجَّه بالواجهات بأربع طرق: ثابتة، reflection ديناميكي، XML لـ Spring، تعليقات Spring",
  },
  {
    id: "js-calculator-labs",
    title: "Scientific Calculator & DOM Labs — Vanilla JS",
    titleFr: "Calculatrice Scientifique & Labos DOM — JS Vanilla",
    titleAr: "حاسبة علمية ومختبرات DOM — JavaScript خام",
    description: "A set of dependency-free HTML/CSS/JavaScript mini-projects covering the fundamentals: a CSS-Grid scientific calculator (trig, log, roots, π/e), plus DOM-manipulation and event-handling exercises (field swapping, arithmetic, BMI). No build tools — just open in a browser.",
    descriptionFr: "Un ensemble de mini-projets HTML/CSS/JavaScript sans dépendances couvrant les fondamentaux : une calculatrice scientifique en CSS Grid (trigo, log, racines, π/e), plus des exercices de manipulation du DOM et de gestion d'événements (échange de champs, arithmétique, IMC). Aucun outil de build — il suffit d'ouvrir dans un navigateur.",
    descriptionAr: "مجموعة من المشاريع المصغّرة بـ HTML/CSS/JavaScript دون تبعيات تغطّي الأساسيات: حاسبة علمية بـ CSS Grid (مثلثات، لوغاريتمات، جذور، π/e)، إضافة إلى تمارين معالجة DOM وإدارة الأحداث (تبديل الحقول، الحساب، مؤشر كتلة الجسم). دون أدوات بناء — يكفي فتحها في المتصفح.",
    longDescription: `A small collection of **vanilla front-end** exercises focused on the fundamentals of the DOM and browser JavaScript — no frameworks, no build step.

**What's inside**
| File | Builds |
|------|--------|
| \`index.html\` + \`calculator.js\` | CSS-Grid **scientific calculator** |
| \`javascripttd.html\` + \`td2js.js\` | DOM-manipulation tutorial exercises |
| \`testjs.html\` | a simple calculator prototype |
| \`style.css\` | shared styling |

**Scientific calculator** — trigonometric functions (sin, cos, tan), logarithms (ln, log), square root, exponentiation, the constants π and e, and percentage operations, laid out with CSS Grid.

**DOM tutorial** — field swapping, arithmetic operations and a BMI calculator, all wired with plain event handling; also touches regular expressions.

A clean illustration of core web fundamentals before reaching for a framework — HTML 57% / JS 37% / CSS 6%.`,
    longDescriptionFr: `Une petite collection d'exercices **front-end vanilla** centrés sur les fondamentaux du DOM et du JavaScript navigateur — sans framework, sans étape de build.

**Contenu**
| Fichier | Construit |
|---------|-----------|
| \`index.html\` + \`calculator.js\` | **calculatrice scientifique** en CSS Grid |
| \`javascripttd.html\` + \`td2js.js\` | exercices de manipulation du DOM |
| \`testjs.html\` | prototype de calculatrice simple |
| \`style.css\` | style partagé |

**Calculatrice scientifique** — fonctions trigonométriques (sin, cos, tan), logarithmes (ln, log), racine carrée, exponentiation, constantes π et e, et pourcentages, disposées en CSS Grid.

**Tutoriel DOM** — échange de champs, opérations arithmétiques et calculateur d'IMC, le tout câblé en gestion d'événements pure ; aborde aussi les expressions régulières.

Une illustration nette des fondamentaux du web avant de recourir à un framework — HTML 57% / JS 37% / CSS 6%.`,
    longDescriptionAr: `مجموعة صغيرة من تمارين **الواجهة الأمامية الخام** تركّز على أساسيات DOM وJavaScript في المتصفح — دون أُطُر عمل، ودون خطوة بناء.

**المحتوى**
| الملف | يبني |
|------|--------|
| \`index.html\` + \`calculator.js\` | **حاسبة علمية** بـ CSS Grid |
| \`javascripttd.html\` + \`td2js.js\` | تمارين معالجة DOM |
| \`testjs.html\` | نموذج حاسبة بسيطة |
| \`style.css\` | تنسيق مشترك |

**الحاسبة العلمية** — دوال مثلثية (sin، cos، tan)، لوغاريتمات (ln، log)، الجذر التربيعي، الأُسّ، الثابتان π وe، وعمليات النسبة المئوية، مرتّبة بـ CSS Grid.

**درس DOM** — تبديل الحقول، العمليات الحسابية وحاسبة مؤشر كتلة الجسم، كلها موصولة بإدارة أحداث خالصة؛ ويتطرّق أيضاً للتعابير النمطية.

توضيح نظيف لأساسيات الويب قبل اللجوء لإطار عمل — HTML 57% / JS 37% / CSS 6%.`,
    category: ["backend"],
    tags: ["JavaScript", "HTML5", "CSS3", "DOM", "CSS Grid", "Vanilla JS", "Fundamentals"],
    githubUrl: `${GH}/html-css-javascipt-test`,
    featured: false,
    metrics: "Vanilla JS · scientific calculator · DOM labs",
    results: [
      { label: "Dependencies", value: "0" },
      { label: "Mini-projects", value: "3" },
      { label: "Layout", value: "CSS Grid" },
      { label: "Stack", value: "HTML/CSS/JS" },
    ],
    techStack: ["HTML5", "CSS3", "JavaScript (vanilla)"],
    approach: "Framework-free DOM, event-handling and regex exercises built around a CSS-Grid scientific calculator",
    approachFr: "Exercices DOM, gestion d'événements et regex sans framework, autour d'une calculatrice scientifique en CSS Grid",
    approachAr: "تمارين DOM وإدارة الأحداث والتعابير النمطية دون إطار عمل، حول حاسبة علمية بـ CSS Grid",
  },
];
