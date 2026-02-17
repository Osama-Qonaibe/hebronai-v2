import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SubscriptionActivatedEmailProps {
  userName: string;
  plan: string;
  expiresAt: string;
  locale?: "en" | "ar";
  dashboardUrl?: string;
}

export const SubscriptionActivatedEmail = ({
  userName,
  plan,
  expiresAt,
  locale = "en",
  dashboardUrl = "https://hebronai.com",
}: SubscriptionActivatedEmailProps) => {
  const isArabic = locale === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  const planNames = {
    basic: { en: "Basic", ar: "أساسي" },
    pro: { en: "Pro", ar: "احترافي" },
    enterprise: { en: "Enterprise", ar: "مؤسسات" },
  };

  const planName = planNames[plan as keyof typeof planNames]?.[locale] || plan;

  const content = {
    en: {
      preview: `Your ${planName} subscription is now active!`,
      greeting: `Hi ${userName}!`,
      title: "Subscription Activated! ✅",
      paragraph1: `Great news! Your ${planName} subscription has been activated successfully.`,
      paragraph2: "You now have access to:",
      features: {
        basic: [
          "25+ AI models including GPT-4.1 Mini",
          "10 AI agents",
          "5 workflows",
          "3 MCP servers",
          "500K tokens per month",
        ],
        pro: [
          "35+ AI models including GPT-5 Mini",
          "50 AI agents",
          "20 workflows",
          "10 MCP servers",
          "2M tokens per month",
        ],
        enterprise: [
          "All 45+ AI models including GPT-5.2 Pro",
          "Unlimited AI agents",
          "Unlimited workflows",
          "Unlimited MCP servers",
          "Unlimited tokens",
        ],
      },
      expiresText: `Your subscription will expire on: ${expiresAt}`,
      paragraph3: "Start using your new features right away!",
      ctaButton: "Go to Dashboard",
      footer:
        "If you have any questions about your subscription, feel free to contact our support team.",
      regards: "Best regards,",
      team: "The HebronAI Team",
    },
    ar: {
      preview: `اشتراكك في خطة ${planName} نشط الآن!`,
      greeting: `مرحباً ${userName}!`,
      title: "تم تفعيل الاشتراك! ✅",
      paragraph1: `أخبار رائعة! تم تفعيل اشتراكك في خطة ${planName} بنجاح.`,
      paragraph2: "لديك الآن إمكانية الوصول إلى:",
      features: {
        basic: [
          "25+ نموذج ذكاء اصطناعي بما في ذلك GPT-4.1 Mini",
          "10 وكلاء ذكاء اصطناعي",
          "5 سير عمل",
          "3 خوادم MCP",
          "500 ألف token شهرياً",
        ],
        pro: [
          "35+ نموذج ذكاء اصطناعي بما في ذلك GPT-5 Mini",
          "50 وكيل ذكاء اصطناعي",
          "20 سير عمل",
          "10 خوادم MCP",
          "2 مليون token شهرياً",
        ],
        enterprise: [
          "جميع الـ 45+ نموذج ذكاء اصطناعي بما في ذلك GPT-5.2 Pro",
          "وكلاء ذكاء اصطناعي غير محدودة",
          "سير عمل غير محدودة",
          "خوادم MCP غير محدودة",
          "tokens غير محدودة",
        ],
      },
      expiresText: `سينتهي اشتراكك في: ${expiresAt}`,
      paragraph3: "ابدأ باستخدام ميزاتك الجديدة الآن!",
      ctaButton: "الذهاب إلى لوحة التحكم",
      footer:
        "إذا كان لديك أي أسئلة حول اشتراكك، لا تتردد في التواصل مع فريق الدعم لدينا.",
      regards: "مع أطيب التحيات،",
      team: "فريق HebronAI",
    },
  };

  const t = content[locale];
  const features =
    t.features[plan as keyof typeof t.features] || t.features.basic;

  return (
    <Html dir={dir}>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>{t.title}</Heading>
          </Section>

          <Section style={section}>
            <Text style={text}>{t.greeting}</Text>
            <Text style={text}>{t.paragraph1}</Text>
            <Text style={text}>{t.paragraph2}</Text>

            <ul style={list}>
              {features.map((feature, index) => (
                <li key={index} style={listItem}>
                  {feature}
                </li>
              ))}
            </ul>

            <Section style={highlightBox}>
              <Text style={highlightText}>{t.expiresText}</Text>
            </Section>

            <Text style={text}>{t.paragraph3}</Text>

            <Button style={button} href={dashboardUrl}>
              {t.ctaButton}
            </Button>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>{t.footer}</Text>
            <Text style={footerText}>
              {t.regards}
              <br />
              {t.team}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default SubscriptionActivatedEmail;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 20px",
  textAlign: "center" as const,
  backgroundColor: "#10b981",
};

const h1 = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
};

const section = {
  padding: "0 48px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const list = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
  paddingLeft: "20px",
};

const listItem = {
  margin: "8px 0",
};

const highlightBox = {
  backgroundColor: "#f0fdf4",
  border: "2px solid #10b981",
  borderRadius: "8px",
  padding: "16px",
  margin: "24px 0",
};

const highlightText = {
  color: "#166534",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#10b981",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "200px",
  padding: "12px 0",
  margin: "32px auto",
};

const footer = {
  padding: "0 48px",
  marginTop: "32px",
  borderTop: "1px solid #eaeaea",
  paddingTop: "24px",
};

const footerText = {
  color: "#666",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
};
