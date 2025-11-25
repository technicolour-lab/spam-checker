// Types for weighted spam scoring system
export type SpamSeverity = 'critical' | 'warning' | 'mild';

export interface SpamTrigger {
  phrase: string;
  score: number;
  category: string;
}

export interface RegexTrigger {
  pattern: RegExp;
  score: number;
  description: string;
}

export interface ScoredMatch {
  text: string;
  score: number;
  severity: SpamSeverity;
  position: { start: number; end: number };
}

export interface SpamAnalysis {
  totalScore: number;
  matches: ScoredMatch[];
  severity: SpamSeverity;
  shouldHighlight: boolean;
}

// Configuration (Mail Meteor level - aggressive thresholds)
export const SPAM_CONFIG = {
  thresholds: {
    highlight: 0.5,   // Start showing any highlights (very sensitive)
    warning: 3.0,     // Overall orange status
    critical: 6.0,    // Overall red status
  },
  subjectMultiplier: 1.5,
};

// ============================================================================
// CRITICAL TRIGGERS (3.0 - 5.0) - Almost always spam
// ============================================================================
export const criticalTriggers: SpamTrigger[] = [
  // Pharmaceutical spam
  { phrase: "viagra", score: 5.0, category: "pharma" },
  { phrase: "cialis", score: 5.0, category: "pharma" },
  { phrase: "human growth hormone", score: 4.5, category: "pharma" },
  { phrase: "online pharmacy", score: 4.5, category: "pharma" },

  // Classic scams
  { phrase: "nigerian", score: 5.0, category: "scam" },
  { phrase: "nigerian prince", score: 5.0, category: "scam" },
  { phrase: "lottery", score: 4.0, category: "scam" },
  { phrase: "you won", score: 4.5, category: "scam" },
  { phrase: "you're a winner", score: 4.5, category: "scam" },
  { phrase: "you are a winner", score: 4.5, category: "scam" },
  { phrase: "you have been selected", score: 4.0, category: "scam" },
  { phrase: "you have been chosen", score: 4.0, category: "scam" },
  { phrase: "congratulations you won", score: 4.5, category: "scam" },
  { phrase: "claim your prize", score: 4.0, category: "scam" },
  { phrase: "claim your reward", score: 4.0, category: "scam" },

  // Money claims
  { phrase: "100% free", score: 4.5, category: "money" },
  { phrase: "one hundred percent free", score: 4.5, category: "money" },
  { phrase: "million dollars", score: 4.0, category: "money" },
  { phrase: "billion dollars", score: 4.0, category: "money" },
  { phrase: "double your money", score: 4.0, category: "money" },
  { phrase: "double your income", score: 4.0, category: "money" },

  // MLM / Pyramid
  { phrase: "mlm", score: 4.0, category: "mlm" },
  { phrase: "multi level marketing", score: 3.5, category: "mlm" },
  { phrase: "multi-level marketing", score: 3.5, category: "mlm" },
  { phrase: "network marketing", score: 3.0, category: "mlm" },
  { phrase: "downline", score: 3.5, category: "mlm" },
  { phrase: "pyramid", score: 4.0, category: "mlm" },

  // Spam meta-references
  { phrase: "this is not spam", score: 4.0, category: "meta" },
  { phrase: "this isn't spam", score: 4.0, category: "meta" },
  { phrase: "not spam", score: 3.5, category: "meta" },
  { phrase: "notspam", score: 3.5, category: "meta" },
  { phrase: "we hate spam", score: 3.0, category: "meta" },
  { phrase: "sent in compliance", score: 3.0, category: "meta" },

  // Work from home scams
  { phrase: "work from home", score: 3.0, category: "wfh" },
  { phrase: "work at home", score: 3.0, category: "wfh" },
  { phrase: "income from home", score: 3.5, category: "wfh" },
  { phrase: "while you sleep", score: 3.5, category: "wfh" },
  { phrase: "be your own boss", score: 3.0, category: "wfh" },

  // Fake credentials
  { phrase: "university diploma", score: 4.0, category: "fake" },
  { phrase: "online degree", score: 3.5, category: "fake" },
  { phrase: "rolex", score: 3.5, category: "fake" },

  // Crypto scams (modern)
  { phrase: "crypto opportunity", score: 4.0, category: "crypto" },
  { phrase: "bitcoin giveaway", score: 4.5, category: "crypto" },
  { phrase: "double your crypto", score: 4.5, category: "crypto" },
  { phrase: "double your bitcoin", score: 4.5, category: "crypto" },
  { phrase: "wallet verification", score: 4.0, category: "crypto" },
  { phrase: "seed phrase", score: 4.0, category: "crypto" },

  // Account takeover attempts
  { phrase: "verify your account", score: 3.5, category: "phishing" },
  { phrase: "confirm your identity", score: 3.5, category: "phishing" },
  { phrase: "account will be suspended", score: 4.0, category: "phishing" },
  { phrase: "account suspended", score: 3.5, category: "phishing" },
  { phrase: "suspicious activity detected", score: 3.5, category: "phishing" },
  { phrase: "unauthorized login", score: 3.5, category: "phishing" },
  { phrase: "security alert", score: 3.0, category: "phishing" },
];

// ============================================================================
// WARNING TRIGGERS (1.5 - 2.9) - Strong spam signals
// ============================================================================
export const warningTriggers: SpamTrigger[] = [
  // Urgency - strong
  { phrase: "act now", score: 2.5, category: "urgency" },
  { phrase: "act immediately", score: 2.5, category: "urgency" },
  { phrase: "immediate action", score: 2.5, category: "urgency" },
  { phrase: "open immediately", score: 2.5, category: "urgency" },
  { phrase: "limited time offer", score: 2.5, category: "urgency" },
  { phrase: "once in a lifetime", score: 2.5, category: "urgency" },
  { phrase: "one time only", score: 2.0, category: "urgency" },
  { phrase: "hurry up", score: 2.0, category: "urgency" },
  { phrase: "don't miss out", score: 2.0, category: "urgency" },
  { phrase: "don't wait", score: 1.5, category: "urgency" },
  { phrase: "don't hesitate", score: 1.5, category: "urgency" },
  { phrase: "don't delete", score: 2.0, category: "urgency" },
  { phrase: "final call", score: 2.0, category: "urgency" },
  { phrase: "last chance", score: 2.0, category: "urgency" },
  { phrase: "what are you waiting for", score: 2.0, category: "urgency" },
  { phrase: "for instant access", score: 2.0, category: "urgency" },
  { phrase: "instant access", score: 1.5, category: "urgency" },

  // Money/Free - strong
  { phrase: "free money", score: 2.5, category: "money" },
  { phrase: "free gift", score: 2.0, category: "money" },
  { phrase: "free bonus", score: 2.0, category: "money" },
  { phrase: "cash prize", score: 2.5, category: "money" },
  { phrase: "cash bonus", score: 2.5, category: "money" },
  { phrase: "extra cash", score: 2.0, category: "money" },
  { phrase: "fast cash", score: 2.5, category: "money" },
  { phrase: "serious cash", score: 2.0, category: "money" },
  { phrase: "earn cash", score: 2.0, category: "money" },
  { phrase: "earn money", score: 2.0, category: "money" },
  { phrase: "make money", score: 2.0, category: "money" },
  { phrase: "pure profit", score: 2.5, category: "money" },
  { phrase: "financial freedom", score: 2.0, category: "money" },
  { phrase: "big bucks", score: 2.0, category: "money" },
  { phrase: "money making", score: 2.0, category: "money" },

  // Guarantees - suspicious
  { phrase: "guaranteed", score: 2.0, category: "guarantee" },
  { phrase: "100% guaranteed", score: 2.5, category: "guarantee" },
  { phrase: "satisfaction guaranteed", score: 1.5, category: "guarantee" },
  { phrase: "money back guarantee", score: 1.5, category: "guarantee" },
  { phrase: "risk free", score: 2.0, category: "guarantee" },
  { phrase: "risk-free", score: 2.0, category: "guarantee" },
  { phrase: "no risk", score: 1.5, category: "guarantee" },

  // Too good to be true
  { phrase: "miracle", score: 2.5, category: "tgtbt" },
  { phrase: "no investment", score: 2.0, category: "tgtbt" },
  { phrase: "no experience needed", score: 2.0, category: "tgtbt" },
  { phrase: "unlimited income", score: 2.5, category: "tgtbt" },
  { phrase: "potential earnings", score: 2.0, category: "tgtbt" },
  { phrase: "expect to earn", score: 2.0, category: "tgtbt" },
  { phrase: "join millions", score: 2.0, category: "tgtbt" },
  { phrase: "lifetime opportunity", score: 2.0, category: "tgtbt" },
  { phrase: "no gimmick", score: 2.0, category: "tgtbt" },
  { phrase: "no selling", score: 1.5, category: "tgtbt" },

  // No strings
  { phrase: "no catch", score: 2.0, category: "nostrings" },
  { phrase: "no cost", score: 1.5, category: "nostrings" },
  { phrase: "no credit check", score: 2.5, category: "nostrings" },
  { phrase: "no fees", score: 1.5, category: "nostrings" },
  { phrase: "no hidden charges", score: 1.5, category: "nostrings" },
  { phrase: "no hidden costs", score: 1.5, category: "nostrings" },
  { phrase: "no obligation", score: 1.5, category: "nostrings" },
  { phrase: "no purchase necessary", score: 1.5, category: "nostrings" },
  { phrase: "no questions asked", score: 2.0, category: "nostrings" },
  { phrase: "no strings attached", score: 2.0, category: "nostrings" },

  // Shady marketing
  { phrase: "addresses for sale", score: 2.5, category: "shady" },
  { phrase: "mass mailing", score: 2.5, category: "shady" },
  { phrase: "email marketing", score: 1.5, category: "shady" },
  { phrase: "direct email", score: 1.5, category: "shady" },
  { phrase: "email list", score: 2.0, category: "shady" },
  { phrase: "you are eligible", score: 2.0, category: "shady" },
  { phrase: "dear friend", score: 2.5, category: "shady" },
  { phrase: "dear winner", score: 2.5, category: "shady" },
  { phrase: "dear customer", score: 1.5, category: "shady" },
  { phrase: "dear valued", score: 1.5, category: "shady" },

  // Debt/Financial
  { phrase: "eliminate debt", score: 2.0, category: "debt" },
  { phrase: "get out of debt", score: 2.0, category: "debt" },
  { phrase: "debt relief", score: 2.0, category: "debt" },
  { phrase: "consolidate debt", score: 1.5, category: "debt" },
  { phrase: "calling creditors", score: 2.0, category: "debt" },

  // Health spam
  { phrase: "lose weight", score: 2.0, category: "health" },
  { phrase: "weight loss", score: 2.0, category: "health" },
  { phrase: "meet singles", score: 2.5, category: "dating" },
  { phrase: "lonely singles", score: 2.5, category: "dating" },

  // Fake authority (modern)
  { phrase: "irs notice", score: 2.5, category: "authority" },
  { phrase: "legal action required", score: 2.5, category: "authority" },
  { phrase: "court notice", score: 2.5, category: "authority" },
  { phrase: "final warning", score: 2.0, category: "authority" },
  { phrase: "past due notice", score: 2.0, category: "authority" },
];

// ============================================================================
// MILD TRIGGERS (0.3 - 1.4) - Context dependent, common in legit marketing
// ============================================================================
export const mildTriggers: SpamTrigger[] = [
  // Standalone urgency words (AGGRESSIVE)
  { phrase: "now", score: 1.2, category: "urgency" },
  { phrase: "today", score: 0.8, category: "urgency" },
  { phrase: "immediately", score: 1.4, category: "urgency" },
  { phrase: "urgent", score: 1.4, category: "urgency" },
  { phrase: "asap", score: 1.2, category: "urgency" },
  { phrase: "hurry", score: 1.2, category: "urgency" },
  { phrase: "quick", score: 0.8, category: "urgency" },
  { phrase: "fast", score: 0.6, category: "urgency" },
  { phrase: "rush", score: 1.0, category: "urgency" },
  { phrase: "instant", score: 0.8, category: "urgency" },
  { phrase: "deadline", score: 1.0, category: "urgency" },

  // Urgency - mild
  { phrase: "buy now", score: 1.0, category: "urgency" },
  { phrase: "call now", score: 1.0, category: "urgency" },
  { phrase: "click here", score: 0.8, category: "urgency" },
  { phrase: "click below", score: 0.5, category: "urgency" },
  { phrase: "click now", score: 1.0, category: "urgency" },
  { phrase: "order now", score: 0.8, category: "urgency" },
  { phrase: "order today", score: 0.5, category: "urgency" },
  { phrase: "sign up now", score: 0.8, category: "urgency" },
  { phrase: "get started now", score: 0.5, category: "urgency" },
  { phrase: "get it now", score: 0.8, category: "urgency" },
  { phrase: "respond now", score: 1.0, category: "urgency" },
  { phrase: "today only", score: 1.0, category: "urgency" },
  { phrase: "only today", score: 1.0, category: "urgency" },
  { phrase: "limited time", score: 0.8, category: "urgency" },
  { phrase: "limited offer", score: 0.8, category: "urgency" },
  { phrase: "while supplies last", score: 0.8, category: "urgency" },
  { phrase: "while stock lasts", score: 0.8, category: "urgency" },
  { phrase: "supplies limited", score: 0.8, category: "urgency" },
  { phrase: "take action", score: 0.5, category: "urgency" },
  { phrase: "take action now", score: 1.0, category: "urgency" },
  { phrase: "expires", score: 0.4, category: "urgency" },
  { phrase: "expire", score: 0.4, category: "urgency" },
  { phrase: "expires today", score: 0.8, category: "urgency" },
  { phrase: "offer expires", score: 0.6, category: "urgency" },
  { phrase: "deal ending", score: 0.6, category: "urgency" },
  { phrase: "this won't last", score: 0.8, category: "urgency" },
  { phrase: "action required", score: 0.5, category: "urgency" },
  { phrase: "apply now", score: 0.5, category: "urgency" },
  { phrase: "running out", score: 0.8, category: "urgency" },
  { phrase: "almost gone", score: 0.8, category: "urgency" },
  { phrase: "selling fast", score: 0.8, category: "urgency" },
  { phrase: "going fast", score: 0.8, category: "urgency" },
  { phrase: "before it's too late", score: 1.2, category: "urgency" },
  { phrase: "time sensitive", score: 1.0, category: "urgency" },
  { phrase: "time is running out", score: 1.2, category: "urgency" },

  // Free/Money - mild
  { phrase: "free", score: 0.3, category: "money" },
  { phrase: "for free", score: 0.4, category: "money" },
  { phrase: "free trial", score: 0.4, category: "money" },
  { phrase: "free sample", score: 0.4, category: "money" },
  { phrase: "free access", score: 0.5, category: "money" },
  { phrase: "free preview", score: 0.4, category: "money" },
  { phrase: "free membership", score: 0.6, category: "money" },
  { phrase: "free info", score: 0.5, category: "money" },
  { phrase: "free information", score: 0.5, category: "money" },
  { phrase: "yours free", score: 0.6, category: "money" },
  { phrase: "cost nothing", score: 0.8, category: "money" },
  { phrase: "discount", score: 0.4, category: "money" },
  { phrase: "save money", score: 0.4, category: "money" },
  { phrase: "save big", score: 0.6, category: "money" },
  { phrase: "bonus", score: 0.4, category: "money" },
  { phrase: "prize", score: 0.5, category: "money" },
  { phrase: "winner", score: 0.5, category: "money" },
  { phrase: "special offer", score: 0.6, category: "money" },
  { phrase: "great offer", score: 0.6, category: "money" },
  { phrase: "incredible deal", score: 0.8, category: "money" },
  { phrase: "unbelievable deal", score: 0.8, category: "money" },
  { phrase: "lowest price", score: 0.6, category: "money" },
  { phrase: "best price", score: 0.5, category: "money" },
  { phrase: "get paid", score: 0.8, category: "money" },
  { phrase: "giving away", score: 0.6, category: "money" },
  { phrase: "giveaway", score: 0.5, category: "money" },
  { phrase: "extra income", score: 0.8, category: "money" },
  { phrase: "double your", score: 1.0, category: "money" },

  // Common CTAs
  { phrase: "subscribe", score: 0.3, category: "cta" },
  { phrase: "register now", score: 0.6, category: "cta" },
  { phrase: "join now", score: 0.5, category: "cta" },
  { phrase: "download now", score: 0.5, category: "cta" },
  { phrase: "sign up", score: 0.3, category: "cta" },
  { phrase: "signup", score: 0.3, category: "cta" },
  { phrase: "claim now", score: 0.8, category: "cta" },
  { phrase: "get started", score: 0.3, category: "cta" },

  // Misc marketing
  { phrase: "special promotion", score: 0.5, category: "marketing" },
  { phrase: "exclusive deal", score: 0.6, category: "marketing" },
  { phrase: "special deal", score: 0.5, category: "marketing" },
  { phrase: "fantastic deal", score: 0.6, category: "marketing" },
  { phrase: "new customers only", score: 0.5, category: "marketing" },
  { phrase: "trial offer", score: 0.5, category: "marketing" },
  { phrase: "drastically reduced", score: 0.6, category: "marketing" },
  { phrase: "clearance", score: 0.4, category: "marketing" },
  { phrase: "promo", score: 0.3, category: "marketing" },
  { phrase: "promotional", score: 0.3, category: "marketing" },

  // Manipulation phrases (modern)
  { phrase: "this is not a joke", score: 1.0, category: "manipulation" },
  { phrase: "guaranteed results", score: 1.2, category: "manipulation" },
  { phrase: "proven results", score: 0.8, category: "manipulation" },
];

// ============================================================================
// WEIGHTED REGEX PATTERNS
// ============================================================================
export const weightedRegexPatterns: RegexTrigger[] = [
  // Leet speak (obfuscation = high spam signal)
  { pattern: /v[i1!][a@4]gr[a@4]/gi, score: 5.0, description: "viagra leet speak" },
  { pattern: /c[i1!][a@4]l[i1!]s/gi, score: 5.0, description: "cialis leet speak" },
  { pattern: /fr[e3][e3]/gi, score: 1.5, description: "free leet speak" },
  { pattern: /w[i1!]nn?[e3]r/gi, score: 2.0, description: "winner leet speak" },
  { pattern: /c[a@4]sh/gi, score: 1.5, description: "cash leet speak" },
  { pattern: /m[o0]n[e3]y/gi, score: 1.5, description: "money leet speak" },
  { pattern: /pr[i1!]z[e3]/gi, score: 1.5, description: "prize leet speak" },
  { pattern: /[s$]p[a@4]m/gi, score: 3.0, description: "spam obfuscation" },
  { pattern: /b[o0]nus/gi, score: 1.0, description: "bonus leet speak" },
  { pattern: /[s$][a@4]l[e3]/gi, score: 1.0, description: "sale leet speak" },
  { pattern: /c[l1][i1!]ck/gi, score: 1.0, description: "click leet speak" },

  // Exclamation mark patterns (AGGRESSIVE - Mail Meteor level)
  { pattern: /\b\w+!+/g, score: 1.5, description: "word with exclamation" },
  { pattern: /!{3,}/g, score: 2.5, description: "excessive exclamation marks" },
  { pattern: /!{2}/g, score: 2.0, description: "double exclamation marks" },
  { pattern: /(?<!\w)!(?!\!)/g, score: 1.0, description: "standalone exclamation" },
  { pattern: /\?!+/g, score: 1.8, description: "interrobang style" },
  { pattern: /!+\?/g, score: 1.8, description: "reverse interrobang" },

  // Question mark patterns
  { pattern: /\?{2,}/g, score: 1.5, description: "multiple question marks" },

  // Money symbol abuse
  { pattern: /\${2,}/g, score: 2.0, description: "multiple dollar signs" },
  { pattern: /\$\s*\d/g, score: 0.6, description: "dollar amount" },

  // Ellipsis and dots
  { pattern: /\.{3,}/g, score: 0.8, description: "ellipsis or excessive dots" },

  // ALL CAPS phrases (more aggressive - 4+ letters)
  { pattern: /\b[A-Z]{4,}\b/g, score: 1.2, description: "ALL CAPS word" },
  { pattern: /\b[A-Z][A-Z\s]{8,}[A-Z]\b/g, score: 2.0, description: "ALL CAPS phrase" },

  // Money patterns
  { pattern: /\$\d+[,.]?\d*\s*(million|billion)/gi, score: 3.5, description: "million/billion dollar claim" },
  { pattern: /\$\d+[,.]?\d*\s*thousand/gi, score: 2.0, description: "thousand dollar claim" },
  { pattern: /earn\s*\$?\d{3,}/gi, score: 2.5, description: "earn large amount" },
  { pattern: /make\s*\$?\d{3,}/gi, score: 2.5, description: "make large amount" },
  { pattern: /\d+%\s*off/gi, score: 0.4, description: "percent off" },
  { pattern: /\$\d+\s*per\s*(day|week|month|hour)/gi, score: 1.5, description: "earnings rate" },

  // Urgency patterns
  { pattern: /\d+\s*(hours?|days?|minutes?)\s*(left|only|remaining)/gi, score: 1.5, description: "countdown urgency" },
  { pattern: /(last|final)\s*(chance|call|day|offer)/gi, score: 1.5, description: "last/final urgency" },
  { pattern: /(ends?|ending)\s*(soon|today|tomorrow|tonight)/gi, score: 1.0, description: "ending soon" },
  { pattern: /limited\s*(to\s*)?\d+/gi, score: 1.0, description: "limited quantity" },
  { pattern: /only\s*\d+\s*(left|remaining|available|spots?)/gi, score: 1.2, description: "scarcity" },

  // Guarantee patterns
  { pattern: /100%\s*(free|guaranteed|satisfaction|safe)/gi, score: 2.5, description: "100% guarantee" },
  { pattern: /\d+%\s*guaranteed/gi, score: 2.0, description: "percent guaranteed" },

  // Suspicious patterns
  { pattern: /you('ve|\s+have)\s+been\s+(selected|chosen|picked)/gi, score: 2.5, description: "selection claim" },
  { pattern: /claim\s*(your|the|this)\s*(prize|reward|gift|money)/gi, score: 2.5, description: "claim prize" },
  { pattern: /(verify|confirm|update)\s*(your\s*)?(account|identity|information)/gi, score: 2.5, description: "account verification" },
  { pattern: /account\s*(suspended|locked|compromised|will be)/gi, score: 2.5, description: "account threat" },
  { pattern: /\d+\s*people\s*(are\s*)?(viewing|watching|buying)/gi, score: 1.5, description: "fake social proof" },

  // Crypto patterns
  { pattern: /\b(bitcoin|btc|ethereum|eth|crypto)\s*(giveaway|opportunity|profit)/gi, score: 3.5, description: "crypto scam" },
  { pattern: /double\s*your\s*(bitcoin|btc|crypto|investment)/gi, score: 4.0, description: "double crypto scam" },

  // Shadiness patterns (Mail Meteor level)
  { pattern: /\bwon\b/gi, score: 1.5, description: "won claim" },
  { pattern: /\bwinning\b/gi, score: 1.2, description: "winning claim" },
  { pattern: /\bselected\b/gi, score: 1.0, description: "selection claim" },
  { pattern: /\bchosen\b/gi, score: 1.0, description: "chosen claim" },
  { pattern: /\bexclusive\b/gi, score: 0.8, description: "exclusivity claim" },
  { pattern: /\bsecret\b/gi, score: 1.0, description: "secret claim" },
  { pattern: /\bprivate\b/gi, score: 0.6, description: "private claim" },
  { pattern: /\bconfidential\b/gi, score: 0.8, description: "confidential claim" },
  { pattern: /\bspecial\b/gi, score: 0.6, description: "special claim" },
  { pattern: /\bamazing\b/gi, score: 0.8, description: "amazing claim" },
  { pattern: /\bincredible\b/gi, score: 0.8, description: "incredible claim" },
  { pattern: /\bunbelievable\b/gi, score: 1.0, description: "unbelievable claim" },
  { pattern: /\bfantastic\b/gi, score: 0.6, description: "fantastic claim" },
  { pattern: /\binsane\b/gi, score: 0.8, description: "insane claim" },
  { pattern: /\bcrazy\b/gi, score: 0.6, description: "crazy claim" },

  // Pressure tactics
  { pattern: /\bmissing\s*out\b/gi, score: 1.5, description: "FOMO trigger" },
  { pattern: /\bdon'?t\s*miss\b/gi, score: 1.5, description: "don't miss" },
  { pattern: /\bleft\s*(only|just)?\s*\d+/gi, score: 1.2, description: "scarcity number" },
  { pattern: /\bonly\s*\d+\s*(left|remaining|available)/gi, score: 1.5, description: "limited availability" },
  { pattern: /\b(last|final)\s*(few|one|day|hour|minute|chance)/gi, score: 1.8, description: "final countdown" },
  { pattern: /\btoday\s*only\b/gi, score: 1.5, description: "today only" },
  { pattern: /\bexpires?\s*(today|soon|tonight|tomorrow)/gi, score: 1.2, description: "expiration urgency" },
  { pattern: /\b(act|respond|reply|call|click)\s*(now|immediately|today|fast)/gi, score: 1.8, description: "action urgency" },
  { pattern: /\bopportunity\b/gi, score: 0.8, description: "opportunity claim" },
  { pattern: /\blimited\b/gi, score: 0.8, description: "limited claim" },

  // Spammy adjective stacking
  { pattern: /\b(free|big|huge|massive|incredible)\s+(free|big|huge|massive|incredible)/gi, score: 2.0, description: "adjective stacking" },

  // Reward/benefit language
  { pattern: /\breward\b/gi, score: 0.8, description: "reward mention" },
  { pattern: /\bbenefit\b/gi, score: 0.4, description: "benefit mention" },
  { pattern: /\bprofit\b/gi, score: 1.0, description: "profit mention" },
  { pattern: /\bearnings?\b/gi, score: 0.8, description: "earnings mention" },
  { pattern: /\bincome\b/gi, score: 0.8, description: "income mention" },
  { pattern: /\brevenue\b/gi, score: 0.6, description: "revenue mention" },

  // ============================================================================
  // ADVANCED OBFUSCATION DETECTION
  // ============================================================================

  // Unicode homoglyphs (Cyrillic/Greek lookalikes) - HIGH spam signal
  { pattern: /[аеорсухАЕОРСУХ]/g, score: 3.0, description: "Cyrillic lookalike character" },
  { pattern: /[αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]/g, score: 2.0, description: "Greek character in text" },
  { pattern: /[\u0400-\u04FF]/g, score: 2.5, description: "Cyrillic character" },

  // Zero-width and invisible characters (VERY suspicious)
  { pattern: /[\u200B-\u200D\uFEFF\u00AD]/g, score: 4.0, description: "invisible/zero-width character" },
  { pattern: /[\u2060-\u206F]/g, score: 3.5, description: "invisible formatting character" },

  // Character repetition (freeeee, amazinggggg)
  { pattern: /(.)\1{3,}/gi, score: 1.5, description: "repeated character" },
  { pattern: /\b\w*(.)\1{2,}\w*\b/gi, score: 1.2, description: "word with repeated letters" },

  // Mixed case patterns (FrEe, fReE, FREE money)
  { pattern: /\b[a-z]+[A-Z]+[a-z]+[A-Z]+/g, score: 1.5, description: "mixed case word" },
  { pattern: /\b[A-Z][a-z]+[A-Z]/g, score: 1.0, description: "camel case spam" },

  // Spaced out words (F R E E, W I N)
  { pattern: /\b[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]\b/g, score: 2.5, description: "spaced out word" },
  { pattern: /\b[A-Z]\s[A-Z]\s[A-Z]\b/g, score: 2.0, description: "spaced capitals" },

  // Symbol substitution (fr€€, ca$h, f*ck)
  { pattern: /\w*[€£¥₹₿]\w*/gi, score: 2.0, description: "currency symbol in word" },
  { pattern: /\w+[*@#$%&]\w+/gi, score: 1.5, description: "symbol inside word" },

  // ============================================================================
  // URL/LINK PATTERNS
  // ============================================================================

  // Suspicious URL patterns
  { pattern: /https?:\/\/[^\s]+/gi, score: 0.5, description: "URL in email" },
  { pattern: /\bbit\.ly\b/gi, score: 2.0, description: "bit.ly shortener" },
  { pattern: /\btinyurl\b/gi, score: 2.0, description: "tinyurl shortener" },
  { pattern: /\bgoo\.gl\b/gi, score: 2.0, description: "goo.gl shortener" },
  { pattern: /\bt\.co\b/gi, score: 1.0, description: "t.co shortener" },
  { pattern: /\bowe\.ly\b/gi, score: 2.0, description: "ow.ly shortener" },
  { pattern: /\bis\.gd\b/gi, score: 2.0, description: "is.gd shortener" },
  { pattern: /\bclck\.ru\b/gi, score: 3.0, description: "Russian shortener" },
  { pattern: /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/gi, score: 3.5, description: "IP address URL" },
  { pattern: /\.(xyz|top|club|work|click|link|win|download)\b/gi, score: 2.0, description: "suspicious TLD" },
  { pattern: /\bunsubscribe\b/gi, score: 0.8, description: "unsubscribe link" },
  { pattern: /\bclick\s*(here|this|below|now)\b/gi, score: 1.5, description: "click directive" },

  // ============================================================================
  // EMAIL STRUCTURE PATTERNS
  // ============================================================================

  // Generic greetings
  { pattern: /\bdear\s+(sir|madam|customer|user|friend|member|winner)\b/gi, score: 2.0, description: "generic greeting" },
  { pattern: /\bhello\s+(dear|friend)\b/gi, score: 1.5, description: "overly familiar greeting" },
  { pattern: /\bto\s+whom\s+it\s+may\s+concern\b/gi, score: 1.0, description: "formal generic greeting" },

  // Pressure and manipulation
  { pattern: /\b(must|need\s+to|have\s+to|required\s+to)\s+(act|respond|reply|click|call)/gi, score: 1.8, description: "pressure to act" },
  { pattern: /\bfailure\s+to\s+(act|respond|comply)/gi, score: 2.0, description: "threat of consequences" },
  { pattern: /\bif\s+you\s+(don't|do\s+not)\s+(act|respond|reply)/gi, score: 1.8, description: "conditional threat" },
  { pattern: /\byour\s+(account|access|service)\s+will\s+be/gi, score: 2.0, description: "account threat" },

  // Trust signals (often fake)
  { pattern: /\b(trusted|verified|certified|official|authorized)\s+(by|partner|seller|company)/gi, score: 1.2, description: "fake trust signal" },
  { pattern: /\blegitimate\b/gi, score: 1.5, description: "legitimacy claim" },
  { pattern: /\b100%\s*(safe|secure|legal|legit)/gi, score: 2.0, description: "safety claim" },

  // Contact urgency
  { pattern: /\bcall\s+(us\s+)?(now|today|immediately|asap)/gi, score: 1.5, description: "call urgency" },
  { pattern: /\btext\s+(us\s+)?(now|today|immediately)/gi, score: 1.5, description: "text urgency" },
  { pattern: /\breply\s+(now|immediately|asap|urgent)/gi, score: 1.8, description: "reply urgency" },

  // Personal info requests
  { pattern: /\b(send|provide|enter|confirm)\s+(your\s+)?(password|ssn|social\s+security|credit\s+card|bank)/gi, score: 4.0, description: "sensitive info request" },
  { pattern: /\bpersonal\s+(information|details|data)\b/gi, score: 1.5, description: "personal info mention" },

  // Weird formatting
  { pattern: /_{3,}/g, score: 1.0, description: "excessive underscores" },
  { pattern: /-{5,}/g, score: 1.0, description: "excessive dashes" },
  { pattern: /={3,}/g, score: 1.0, description: "excessive equals signs" },
  { pattern: /\*{3,}/g, score: 1.2, description: "excessive asterisks" },
];

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

// Combine all triggers
const allTriggers: SpamTrigger[] = [
  ...criticalTriggers,
  ...warningTriggers,
  ...mildTriggers,
];

// Escape special regex characters
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Get severity from score (Mail Meteor level - more aggressive)
export function getMatchSeverity(score: number): SpamSeverity {
  if (score >= 2.0) return 'critical';
  if (score >= 1.0) return 'warning';
  return 'mild';
}

// Get overall severity from total score
export function getOverallSeverity(totalScore: number): SpamSeverity {
  if (totalScore >= SPAM_CONFIG.thresholds.critical) return 'critical';
  if (totalScore >= SPAM_CONFIG.thresholds.warning) return 'warning';
  return 'mild';
}

// Main analysis function
export function analyzeSpamScore(text: string, isSubject: boolean = false): SpamAnalysis {
  if (!text) {
    return {
      totalScore: 0,
      matches: [],
      severity: 'mild',
      shouldHighlight: false,
    };
  }

  const matches: ScoredMatch[] = [];
  let totalScore = 0;
  const multiplier = isSubject ? SPAM_CONFIG.subjectMultiplier : 1.0;
  const seenPositions = new Set<string>();

  // Check exact phrases
  for (const trigger of allTriggers) {
    const regex = new RegExp(`\\b${escapeRegex(trigger.phrase)}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      const posKey = `${match.index}-${match.index + match[0].length}`;
      if (seenPositions.has(posKey)) continue;
      seenPositions.add(posKey);

      const finalScore = trigger.score * multiplier;
      matches.push({
        text: match[0],
        score: finalScore,
        severity: getMatchSeverity(trigger.score),
        position: { start: match.index, end: match.index + match[0].length },
      });
      totalScore += finalScore;
    }
  }

  // Check regex patterns
  for (const regexTrigger of weightedRegexPatterns) {
    const regex = new RegExp(regexTrigger.pattern.source, regexTrigger.pattern.flags);
    let match;
    while ((match = regex.exec(text)) !== null) {
      const posKey = `${match.index}-${match.index + match[0].length}`;
      if (seenPositions.has(posKey)) continue;
      seenPositions.add(posKey);

      const finalScore = regexTrigger.score * multiplier;
      matches.push({
        text: match[0],
        score: finalScore,
        severity: getMatchSeverity(regexTrigger.score),
        position: { start: match.index, end: match.index + match[0].length },
      });
      totalScore += finalScore;
    }
  }

  // Sort by position
  matches.sort((a, b) => a.position.start - b.position.start);

  return {
    totalScore,
    matches,
    severity: getOverallSeverity(totalScore),
    shouldHighlight: totalScore >= SPAM_CONFIG.thresholds.highlight,
  };
}

// Combined analysis for subject + body
export function analyzeEmail(subject: string, body: string): {
  subjectAnalysis: SpamAnalysis;
  bodyAnalysis: SpamAnalysis;
  combinedScore: number;
  overallSeverity: SpamSeverity;
  shouldHighlight: boolean;
  allMatches: ScoredMatch[];
} {
  const subjectAnalysis = analyzeSpamScore(subject, true);
  const bodyAnalysis = analyzeSpamScore(body, false);
  const combinedScore = subjectAnalysis.totalScore + bodyAnalysis.totalScore;

  return {
    subjectAnalysis,
    bodyAnalysis,
    combinedScore,
    overallSeverity: getOverallSeverity(combinedScore),
    shouldHighlight: combinedScore >= SPAM_CONFIG.thresholds.highlight,
    allMatches: [...subjectAnalysis.matches, ...bodyAnalysis.matches],
  };
}

// ============================================================================
// BACKWARDS COMPATIBLE EXPORTS (for existing code)
// ============================================================================

// Legacy: Build a combined regex for highlighting (used by HighlightWithinTextarea)
export function getHighlightRegex(): RegExp {
  const phrasePatterns = allTriggers.map(t => `\\b${escapeRegex(t.phrase)}\\b`);
  const regexStrings = weightedRegexPatterns.map(r => r.pattern.source);
  const combined = [...phrasePatterns, ...regexStrings].join('|');
  return new RegExp(combined, 'gi');
}

// Legacy: Find all matches (returns unique trigger texts)
export function findSpamMatches(text: string): string[] {
  const analysis = analyzeSpamScore(text);
  return [...new Set(analysis.matches.map(m => m.text.toLowerCase()))];
}

// Legacy: Count words
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
