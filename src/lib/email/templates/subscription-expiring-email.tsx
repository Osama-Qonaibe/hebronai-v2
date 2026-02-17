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

interface SubscriptionExpiringEmailProps {
  userName: string;
  plan: string;
  expiresAt: string;
  daysLeft: number;
  locale?: "en" | "ar";
  renewUrl?: string;
}

export const SubscriptionExpiringEmail = ({
  userName,
  plan,
  expiresAt,
  daysLeft,
  locale = "en",
  renewUrl = "https://hebronai.com/subscription",
}: SubscriptionExpiringEmailProps) => {
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
      preview: `Your ${planName} subscription expires in ${daysLeft} days`,
      greeting: `Hi ${userName}!`,
      title: "Subscription Expiring Soon ⏰",
      paragraph1: `Your ${planName} subscription will expire in ${daysLeft} day${daysLeft > 1 ? "s" : ""}.`,
      expiresText: `Expiration date: ${expiresAt}`,
      paragraph2:
        "After expiration, you will lose access to premium features and your account will be downgraded to the Free plan.",
      paragraph3:
        "Don't lose access to your premium features! Renew your subscription now to continue enjoying:",
      features: {
        basic: [
          "25+ AI models",
          "10 AI agents",
          "5 workflows",
          "500K tokens per month",
        ],
        pro: [
          "35+ AI models",
          "50 AI agents",
          "20 workflows",
          "2M tokens per month",
        ],
        enterprise: [
          "All 45+ AI models",
          "Unlimited agents & workflows",
          "Unlimited tokens",
        ],
      },
      ctaButton: "Renew Subscription",
      footer:
        "If you have any questions or need assistance, please contact our support team.",
      regards: "Best regards,",
      team: "The HebronAI Team",
    },
    ar: {
      preview: `اشتراكك في خطة ${planName} ينتهي خلال ${daysLeft} يوم`,
      greeting: `مرحباً ${userName}!`,
      title: "اشتراكك على وشك الانتهاء ⏰",
      paragraph1: `سينتهي اشتراكك في خطة ${planName} خلال ${daysLeft} يوم${daysLeft > 1 ? "" : ""}.`,
      expiresText: `تاريخ الانتهاء: ${expiresAt}`,
      paragraph2:
        "بعد انتهاء الاشتراك، ستفقد الوصول إلى الميزات المميزة وسيتم تخفيض حسابك إلى الخطة المجانية.",
      paragraph3:
        "لا تفقد الوصول إلى ميزاتك المميزة! جدد اشتراكك الآن لمواصلة الاستمتاع بـ:",
      features: {
        basic: [
          "25+ نموذج ذكاء اصطناعي",
          "10 وكلاء ذكاء اصطناعي",
          "5 سير عمل",
          "500 ألف token شهرياً",
        ],
        pro: [
          "35+ نموذج ذكاء اصطناعي",
          "50 وكيل ذكاء اصطناعي",
          "20 سير عمل",
          "2 مليون token شهرياً",
        ],
        enterprise: [
          "جميع الـ 45+ نموذج ذكاء اصطناعي",
          "وكلاء وسير عمل غير محدودة",
          "tokens غير محدودة",
        ],
      },
      ctaButton: "تجديد الاشتراك",
      footer:
        "إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، يرجى الاتصال بفريق الدعم لدينا.",
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

            <Section style={warningBox}>
              <Text style={warningText}>{t.expiresText}</Text>
            </Section>

            <Text style={text}>{t.paragraph2}</Text>
            <Text style={text}>{t.paragraph3}</Text>

            <ul style={list}>
              {features.map((feature, index) => (
                <li key={index} style={listItem}>
                  {feature}
                </li>
              ))}
            </ul>

            <Button style={button} href={renewUrl}>
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

export default SubscriptionExpiringEmail;

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
  backgroundColor: "#f59e0b",
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

const warningBox = {
  backgroundColor: "#fef3c7",
  border: "2px solid #f59e0b",
  borderRadius: "8px",
  padding: "16px",
  margin: "24px 0",
};

const warningText = {
  color: "#92400e",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#f59e0b",
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
