export class UsageLimitError extends Error {
  public readonly code: string;
  public readonly details: {
    current: number;
    max: number;
    resetTime?: string;
    resetDate?: string;
    upgradeUrl: string;
  };
  public readonly messageAr: string;
  public readonly messageEn: string;
  public readonly action: "WAIT_OR_UPGRADE" | "UPGRADE_REQUIRED";

  constructor(
    code: string,
    details: {
      current: number;
      max: number;
      resetTime?: string;
      resetDate?: string;
      upgradeUrl: string;
    },
    messageAr: string,
    messageEn: string,
    action: "WAIT_OR_UPGRADE" | "UPGRADE_REQUIRED",
  ) {
    super(messageEn);
    this.name = "UsageLimitError";
    this.code = code;
    this.details = details;
    this.messageAr = messageAr;
    this.messageEn = messageEn;
    this.action = action;
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      messageAr: this.messageAr,
      messageEn: this.messageEn,
      details: this.details,
      action: this.action,
    };
  }
}

function getResetTimeToday(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

function getResetDateNextMonth(): string {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);
  nextMonth.setHours(0, 0, 0, 0);
  return nextMonth.toISOString().split("T")[0];
}

function formatResetTime(isoString: string, lang: "ar" | "en"): string {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  if (lang === "ar") {
    return `منتصف الليل (${timeStr})`;
  }
  return `midnight (${timeStr})`;
}

export function createDailyMessageLimitError(
  current: number,
  max: number,
): UsageLimitError {
  const resetTime = getResetTimeToday();
  const resetTimeFormatted = formatResetTime(resetTime, "ar");

  return new UsageLimitError(
    "DAILY_MESSAGE_LIMIT_EXCEEDED",
    {
      current,
      max,
      resetTime,
      upgradeUrl: "/pricing",
    },
    `لقد تجاوزت الحد اليومي للرسائل (${current}/${max}). سيتم التجديد عند ${resetTimeFormatted}. قم بالترقية للحصول على المزيد من الرسائل.`,
    `Daily message limit exceeded (${current}/${max}). Resets at ${formatResetTime(resetTime, "en")}. Upgrade for more messages.`,
    "WAIT_OR_UPGRADE",
  );
}

export function createDailyImageLimitError(
  current: number,
  max: number,
): UsageLimitError {
  const resetTime = getResetTimeToday();
  const resetTimeFormatted = formatResetTime(resetTime, "ar");

  return new UsageLimitError(
    "DAILY_IMAGE_LIMIT_EXCEEDED",
    {
      current,
      max,
      resetTime,
      upgradeUrl: "/pricing",
    },
    `لقد تجاوزت الحد اليومي لتوليد الصور (${current}/${max}). سيتم التجديد عند ${resetTimeFormatted}. قم بالترقية لتوليد المزيد من الصور.`,
    `Daily image generation limit exceeded (${current}/${max}). Resets at ${formatResetTime(resetTime, "en")}. Upgrade to generate more images.`,
    "WAIT_OR_UPGRADE",
  );
}

export function createMonthlyImageLimitError(
  current: number,
  max: number,
): UsageLimitError {
  const resetDate = getResetDateNextMonth();

  return new UsageLimitError(
    "MONTHLY_IMAGE_LIMIT_EXCEEDED",
    {
      current,
      max,
      resetDate,
      upgradeUrl: "/pricing",
    },
    `لقد استنفدت حصتك الشهرية لتوليد الصور (${current}/${max}). قم بالترقية للخطة الأعلى أو انتظر حتى ${resetDate} لتجديد الحصة.`,
    `Monthly image generation quota exhausted (${current}/${max}). Upgrade your plan or wait until ${resetDate} for quota reset.`,
    "UPGRADE_REQUIRED",
  );
}

export function createMonthlyTokenLimitError(
  current: number,
  max: number,
): UsageLimitError {
  const resetDate = getResetDateNextMonth();

  return new UsageLimitError(
    "MONTHLY_TOKEN_LIMIT_EXCEEDED",
    {
      current,
      max,
      resetDate,
      upgradeUrl: "/pricing",
    },
    `لقد استنفدت حصتك الشهرية من الرموز (${current.toLocaleString()}/${max.toLocaleString()}). قم بالترقية للخطة الأعلى أو انتظر حتى ${resetDate}.`,
    `Monthly token quota exhausted (${current.toLocaleString()}/${max.toLocaleString()}). Upgrade your plan or wait until ${resetDate}.`,
    "UPGRADE_REQUIRED",
  );
}

export function createStorageLimitError(
  currentGB: number,
  maxGB: number,
): UsageLimitError {
  return new UsageLimitError(
    "STORAGE_LIMIT_EXCEEDED",
    {
      current: Math.round(currentGB * 100) / 100,
      max: maxGB,
      upgradeUrl: "/pricing",
    },
    `لقد تجاوزت حد التخزين المسموح (${currentGB.toFixed(2)}GB/${maxGB}GB). قم بحذف ملفات أو الترقية للحصول على مساحة أكبر.`,
    `Storage limit exceeded (${currentGB.toFixed(2)}GB/${maxGB}GB). Delete files or upgrade for more storage.`,
    "UPGRADE_REQUIRED",
  );
}

export function createAgentLimitError(
  current: number,
  max: number,
): UsageLimitError {
  return new UsageLimitError(
    "AGENT_LIMIT_EXCEEDED",
    {
      current,
      max,
      upgradeUrl: "/pricing",
    },
    `لقد وصلت للحد الأقصى من الوكلاء (${current}/${max}). قم بحذف وكيل موجود أو الترقية للخطة الأعلى.`,
    `Maximum agent limit reached (${current}/${max}). Delete an existing agent or upgrade your plan.`,
    "UPGRADE_REQUIRED",
  );
}

export function createWorkflowLimitError(
  current: number,
  max: number,
): UsageLimitError {
  return new UsageLimitError(
    "WORKFLOW_LIMIT_EXCEEDED",
    {
      current,
      max,
      upgradeUrl: "/pricing",
    },
    `لقد وصلت للحد الأقصى من سير العمل (${current}/${max}). قم بحذف سير عمل موجود أو الترقية للخطة الأعلى.`,
    `Maximum workflow limit reached (${current}/${max}). Delete an existing workflow or upgrade your plan.`,
    "UPGRADE_REQUIRED",
  );
}

export function createMCPServerLimitError(
  current: number,
  max: number,
): UsageLimitError {
  return new UsageLimitError(
    "MCP_SERVER_LIMIT_EXCEEDED",
    {
      current,
      max,
      upgradeUrl: "/pricing",
    },
    `لقد وصلت للحد الأقصى من خوادم MCP (${current}/${max}). قم بحذف خادم موجود أو الترقية للخطة الأعلى.`,
    `Maximum MCP server limit reached (${current}/${max}). Delete an existing server or upgrade your plan.`,
    "UPGRADE_REQUIRED",
  );
}

export function createAPICallLimitError(
  current: number,
  max: number,
): UsageLimitError {
  const resetTime = getResetTimeToday();
  const resetTimeFormatted = formatResetTime(resetTime, "ar");

  return new UsageLimitError(
    "DAILY_API_CALL_LIMIT_EXCEEDED",
    {
      current,
      max,
      resetTime,
      upgradeUrl: "/pricing",
    },
    `لقد تجاوزت الحد اليومي لاستدعاءات API (${current}/${max}). سيتم التجديد عند ${resetTimeFormatted}.`,
    `Daily API call limit exceeded (${current}/${max}). Resets at ${formatResetTime(resetTime, "en")}.`,
    "WAIT_OR_UPGRADE",
  );
}

export function createDocumentLimitError(
  current: number,
  max: number,
): UsageLimitError {
  const resetDate = getResetDateNextMonth();

  return new UsageLimitError(
    "MONTHLY_DOCUMENT_LIMIT_EXCEEDED",
    {
      current,
      max,
      resetDate,
      upgradeUrl: "/pricing",
    },
    `لقد استنفدت حصتك الشهرية من المستندات (${current}/${max}). قم بالترقية أو انتظر حتى ${resetDate}.`,
    `Monthly document quota exhausted (${current}/${max}). Upgrade or wait until ${resetDate}.`,
    "UPGRADE_REQUIRED",
  );
}

export function createNoSubscriptionError(): UsageLimitError {
  return new UsageLimitError(
    "NO_ACTIVE_SUBSCRIPTION",
    {
      current: 0,
      max: 0,
      upgradeUrl: "/pricing",
    },
    "لا يوجد اشتراك نشط. قم بتفعيل اشتراكك للمتابعة.",
    "No active subscription found. Activate your subscription to continue.",
    "UPGRADE_REQUIRED",
  );
}

export function createFeatureNotAvailableError(
  featureName: string,
  planName: string,
): UsageLimitError {
  return new UsageLimitError(
    "FEATURE_NOT_AVAILABLE",
    {
      current: 0,
      max: 0,
      upgradeUrl: "/pricing",
    },
    `الميزة "${featureName}" غير متاحة في خطة ${planName}. قم بالترقية للوصول إلى هذه الميزة.`,
    `Feature "${featureName}" is not available in ${planName} plan. Upgrade to access this feature.`,
    "UPGRADE_REQUIRED",
  );
}
