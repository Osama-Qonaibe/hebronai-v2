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

interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
  locale?: "en" | "ar";
}

export const PasswordResetEmail = ({
  userName,
  resetUrl,
  locale = "en",
}: PasswordResetEmailProps) => {
  const isArabic = locale === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  const content = {
    en: {
      preview: "Reset your HebronAI password",
      greeting: `Hi ${userName}!`,
      title: "Reset Your Password 🔐",
      paragraph1:
        "We received a request to reset your password for your HebronAI account.",
      paragraph2:
        "Click the button below to reset your password. This link will expire in 1 hour for security reasons.",
      ctaButton: "Reset Password",
      paragraph3:
        "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.",
      securityNote:
        "For security reasons, never share this link with anyone. If you're concerned about your account security, please contact our support team immediately.",
      footer: "Stay safe!",
      regards: "Best regards,",
      team: "The HebronAI Team",
    },
    ar: {
      preview: "إعادة تعيين كلمة مرور HebronAI",
      greeting: `مرحباً ${userName}!`,
      title: "إعادة تعيين كلمة المرور 🔐",
      paragraph1:
        "تلقينا طلباً لإعادة تعيين كلمة المرور لحساب HebronAI الخاص بك.",
      paragraph2:
        "انقر على الزر أدناه لإعادة تعيين كلمة المرور. سينتهي صلاحية هذا الرابط خلال ساعة واحدة لأسباب أمنية.",
      ctaButton: "إعادة تعيين كلمة المرور",
      paragraph3:
        "إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني بأمان. ستبقى كلمة المرور الخاصة بك دون تغيير.",
      securityNote:
        "لأسباب أمنية، لا تشارك هذا الرابط مع أي شخص أبداً. إذا كنت قلقاً بشأن أمان حسابك، يرجى الاتصال بفريق الدعم لدينا على الفور.",
      footer: "ابق آمناً!",
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

            <Button style={button} href={resetUrl}>
              {t.ctaButton}
            </Button>

            <Text style={text}>{t.paragraph3}</Text>

            <Section style={securityBox}>
              <Text style={securityText}>⚠️ {t.securityNote}</Text>
            </Section>
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

export default PasswordResetEmail;

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
  backgroundColor: "#3b82f6",
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

const button = {
  backgroundColor: "#3b82f6",
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

const securityBox = {
  backgroundColor: "#fef2f2",
  border: "2px solid #ef4444",
  borderRadius: "8px",
  padding: "16px",
  margin: "24px 0",
};

const securityText = {
  color: "#991b1b",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
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
