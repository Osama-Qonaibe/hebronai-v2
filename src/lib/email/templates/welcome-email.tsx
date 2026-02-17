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

interface WelcomeEmailProps {
  userName: string;
  userEmail: string;
  locale?: "en" | "ar";
  loginUrl?: string;
}

export const WelcomeEmail = ({
  userName,
  userEmail,
  locale = "en",
  loginUrl = "https://hebronai.com/sign-in",
}: WelcomeEmailProps) => {
  const isArabic = locale === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  const content = {
    en: {
      preview: "Welcome to HebronAI - Your AI Assistant",
      greeting: `Hi ${userName}!`,
      title: "Welcome to HebronAI! 🚀",
      paragraph1:
        "We're excited to have you on board! HebronAI is your powerful AI assistant that helps you accomplish tasks faster and smarter.",
      paragraph2:
        "You can now access all the features available in your Free plan:",
      features: [
        "Chat with AI models",
        "Create up to 3 AI agents",
        "Build 2 workflows",
        "Connect 1 MCP server",
      ],
      paragraph3:
        "Want more? Upgrade to a paid plan to unlock advanced AI models and increased limits.",
      ctaButton: "Get Started",
      footer:
        "If you have any questions, feel free to reach out to our support team.",
      regards: "Best regards,",
      team: "The HebronAI Team",
    },
    ar: {
      preview: "مرحباً بك في HebronAI - مساعدك الذكي",
      greeting: `مرحباً ${userName}!`,
      title: "مرحباً بك في HebronAI! 🚀",
      paragraph1:
        "نحن سعداء بانضمامك إلينا! HebronAI هو مساعدك الذكي القوي الذي يساعدك على إنجاز المهام بشكل أسرع وأذكى.",
      paragraph2:
        "يمكنك الآن الوصول إلى جميع الميزات المتاحة في خطتك المجانية:",
      features: [
        "الدردشة مع نماذج الذكاء الاصطناعي",
        "إنشاء ما يصل إلى 3 وكلاء ذكاء اصطناعي",
        "بناء 2 سير عمل",
        "ربط خادم MCP واحد",
      ],
      paragraph3:
        "تريد المزيد؟ قم بالترقية إلى خطة مدفوعة لفتح نماذج ذكاء اصطناعي متقدمة وحدود أعلى.",
      ctaButton: "ابدأ الآن",
      footer: "إذا كان لديك أي أسئلة، لا تتردد في التواصل مع فريق الدعم لدينا.",
      regards: "مع أطيب التحيات،",
      team: "فريق HebronAI",
    },
  };

  const t = content[locale];

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
              {t.features.map((feature, index) => (
                <li key={index} style={listItem}>
                  {feature}
                </li>
              ))}
            </ul>

            <Text style={text}>{t.paragraph3}</Text>

            <Button style={button} href={loginUrl}>
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

export default WelcomeEmail;

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
  backgroundColor: "#0a0a0a",
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

const button = {
  backgroundColor: "#0a0a0a",
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
