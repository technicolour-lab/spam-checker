import { describe, it, expect } from 'vitest';
import {
  analyzeSpamScore,
  analyzeEmail,
  getMatchSeverity,
  getOverallSeverity,
  SPAM_CONFIG,
} from './spam-words';

describe('Spam Detection - Mail Meteor Level', () => {
  // ============================================================================
  // URGENCY DETECTION
  // ============================================================================
  describe('Urgency Detection', () => {
    it('should detect standalone "now"', () => {
      const result = analyzeSpamScore('Now');
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.totalScore).toBeGreaterThan(0);
    });

    it('should detect "Now!" with exclamation', () => {
      const result = analyzeSpamScore('Now!');
      expect(result.totalScore).toBeGreaterThanOrEqual(2.0);
      expect(result.matches.some(m => m.text.toLowerCase().includes('now'))).toBe(true);
    });

    it('should detect urgency words', () => {
      const urgencyWords = ['urgent', 'immediately', 'asap', 'hurry', 'rush', 'deadline'];
      for (const word of urgencyWords) {
        const result = analyzeSpamScore(word);
        expect(result.totalScore).toBeGreaterThan(0);
      }
    });

    it('should detect urgency phrases', () => {
      const phrases = [
        'act now',
        'limited time offer',
        'last chance',
        "don't miss out",
        'expires today',
      ];
      for (const phrase of phrases) {
        const result = analyzeSpamScore(phrase);
        expect(result.totalScore).toBeGreaterThan(0);
      }
    });

    it('should detect countdown urgency', () => {
      const result = analyzeSpamScore('Only 3 hours left!');
      expect(result.totalScore).toBeGreaterThan(2);
    });
  });

  // ============================================================================
  // EXCLAMATION MARK DETECTION
  // ============================================================================
  describe('Exclamation Mark Detection', () => {
    it('should detect word with single exclamation', () => {
      const result = analyzeSpamScore('Free!');
      expect(result.matches.some(m => m.text.includes('!'))).toBe(true);
    });

    it('should detect double exclamation marks', () => {
      const result = analyzeSpamScore('Amazing!!');
      expect(result.totalScore).toBeGreaterThan(2);
    });

    it('should detect triple+ exclamation marks', () => {
      const result = analyzeSpamScore('WOW!!!');
      expect(result.totalScore).toBeGreaterThan(3);
    });

    it('should detect interrobang', () => {
      const result1 = analyzeSpamScore('Really?!');
      const result2 = analyzeSpamScore('What!?');
      expect(result1.totalScore).toBeGreaterThan(1);
      expect(result2.totalScore).toBeGreaterThan(1);
    });
  });

  // ============================================================================
  // MONEY/SCAM DETECTION
  // ============================================================================
  describe('Money and Scam Detection', () => {
    it('should detect dollar amounts', () => {
      const result = analyzeSpamScore('Earn $5000 per week');
      expect(result.totalScore).toBeGreaterThan(2);
    });

    it('should detect million/billion claims', () => {
      const result = analyzeSpamScore('Win $1 million dollars');
      expect(result.totalScore).toBeGreaterThan(5);
    });

    it('should detect free offers', () => {
      const result = analyzeSpamScore('100% free gift');
      expect(result.totalScore).toBeGreaterThan(3);
    });

    it('should detect lottery/prize scams', () => {
      const result = analyzeSpamScore('Congratulations! You won the lottery!');
      expect(result.severity).toBe('critical');
    });

    it('should detect crypto scams', () => {
      const result = analyzeSpamScore('Double your bitcoin today');
      expect(result.totalScore).toBeGreaterThan(5);
    });
  });

  // ============================================================================
  // OBFUSCATION DETECTION
  // ============================================================================
  describe('Obfuscation Detection', () => {
    it('should detect leet speak - viagra', () => {
      const result = analyzeSpamScore('v1agra');
      expect(result.totalScore).toBeGreaterThanOrEqual(5);
    });

    it('should detect leet speak - free', () => {
      const result = analyzeSpamScore('fr33');
      expect(result.totalScore).toBeGreaterThan(0);
    });

    it('should detect leet speak - winner', () => {
      const result = analyzeSpamScore('w1nner');
      expect(result.totalScore).toBeGreaterThan(1);
    });

    it('should detect character repetition', () => {
      const result = analyzeSpamScore('Freeeeee money');
      // Should detect "eeee" repeated chars and score appropriately
      expect(result.totalScore).toBeGreaterThan(2);
    });

    it('should detect spaced out words', () => {
      const result = analyzeSpamScore('F R E E');
      expect(result.totalScore).toBeGreaterThan(2);
    });

    it('should detect mixed case', () => {
      const result = analyzeSpamScore('fReE mOnEy');
      expect(result.totalScore).toBeGreaterThan(1);
    });

    it('should detect symbol substitution', () => {
      const result = analyzeSpamScore('ca$h prize');
      expect(result.totalScore).toBeGreaterThan(1);
    });
  });

  // ============================================================================
  // UNICODE/HOMOGLYPH DETECTION
  // ============================================================================
  describe('Unicode and Homoglyph Detection', () => {
    it('should detect Cyrillic lookalikes', () => {
      // Using Cyrillic 'а' (U+0430) instead of Latin 'a'
      const result = analyzeSpamScore('frее'); // Cyrillic е
      expect(result.totalScore).toBeGreaterThan(2);
    });

    it('should detect zero-width characters', () => {
      const result = analyzeSpamScore('free\u200Bmoney'); // zero-width space
      expect(result.totalScore).toBeGreaterThan(3);
    });

    it('should detect currency symbols in words', () => {
      const result = analyzeSpamScore('fr€€');
      expect(result.totalScore).toBeGreaterThan(1);
    });
  });

  // ============================================================================
  // URL/LINK DETECTION
  // ============================================================================
  describe('URL and Link Detection', () => {
    it('should detect URL shorteners', () => {
      const shorteners = ['bit.ly/abc', 'tinyurl.com/xyz', 'goo.gl/123'];
      for (const url of shorteners) {
        const result = analyzeSpamScore(url);
        expect(result.totalScore).toBeGreaterThan(1);
      }
    });

    it('should detect IP address URLs', () => {
      const result = analyzeSpamScore('http://192.168.1.1/malware');
      expect(result.totalScore).toBeGreaterThan(3);
    });

    it('should detect suspicious TLDs', () => {
      const result = analyzeSpamScore('visit cheap-deals.xyz');
      expect(result.totalScore).toBeGreaterThan(1);
    });

    it('should detect click directives', () => {
      const result = analyzeSpamScore('Click here now!');
      expect(result.totalScore).toBeGreaterThan(2);
    });
  });

  // ============================================================================
  // PHISHING DETECTION
  // ============================================================================
  describe('Phishing Detection', () => {
    it('should detect account threats', () => {
      const threats = [
        'Your account will be suspended',
        'Account locked',
        'Suspicious activity detected',
      ];
      for (const threat of threats) {
        const result = analyzeSpamScore(threat);
        expect(result.totalScore).toBeGreaterThan(2);
      }
    });

    it('should detect verification requests', () => {
      const result = analyzeSpamScore('Verify your account immediately');
      expect(result.totalScore).toBeGreaterThan(4);
    });

    it('should detect sensitive info requests', () => {
      const result = analyzeSpamScore('Please provide your password');
      expect(result.totalScore).toBeGreaterThan(3);
    });
  });

  // ============================================================================
  // EMAIL STRUCTURE PATTERNS
  // ============================================================================
  describe('Email Structure Detection', () => {
    it('should detect generic greetings', () => {
      const greetings = ['Dear Sir', 'Dear Customer', 'Dear Friend', 'Dear Winner'];
      for (const greeting of greetings) {
        const result = analyzeSpamScore(greeting);
        expect(result.totalScore).toBeGreaterThan(1);
      }
    });

    it('should detect pressure tactics', () => {
      const result = analyzeSpamScore('You must act now or your account will be closed');
      expect(result.totalScore).toBeGreaterThan(3);
    });

    it('should detect fake trust signals', () => {
      const result = analyzeSpamScore('100% safe and legitimate offer');
      expect(result.totalScore).toBeGreaterThan(3);
    });
  });

  // ============================================================================
  // ALL CAPS DETECTION
  // ============================================================================
  describe('ALL CAPS Detection', () => {
    it('should detect ALL CAPS words', () => {
      const result = analyzeSpamScore('FREE MONEY NOW');
      expect(result.totalScore).toBeGreaterThan(3);
    });

    it('should detect ALL CAPS phrases', () => {
      const result = analyzeSpamScore('ACT NOW LIMITED TIME OFFER');
      expect(result.totalScore).toBeGreaterThan(5);
    });
  });

  // ============================================================================
  // SHADINESS DETECTION
  // ============================================================================
  describe('Shadiness Detection', () => {
    it('should detect shady words', () => {
      const shadyWords = ['secret', 'exclusive', 'selected', 'chosen', 'won'];
      for (const word of shadyWords) {
        const result = analyzeSpamScore(word);
        expect(result.totalScore).toBeGreaterThan(0);
      }
    });

    it('should detect hyperbole', () => {
      const hyperbole = ['amazing', 'incredible', 'unbelievable', 'insane'];
      for (const word of hyperbole) {
        const result = analyzeSpamScore(word);
        expect(result.totalScore).toBeGreaterThan(0);
      }
    });

    it('should detect FOMO triggers', () => {
      const result = analyzeSpamScore("Don't miss out on this opportunity");
      expect(result.totalScore).toBeGreaterThan(2);
    });
  });

  // ============================================================================
  // SEVERITY CLASSIFICATION
  // ============================================================================
  describe('Severity Classification', () => {
    it('should classify individual match severity correctly', () => {
      expect(getMatchSeverity(2.5)).toBe('critical');
      expect(getMatchSeverity(1.5)).toBe('warning');
      expect(getMatchSeverity(0.5)).toBe('mild');
    });

    it('should classify overall severity correctly', () => {
      expect(getOverallSeverity(7)).toBe('critical');
      expect(getOverallSeverity(4)).toBe('warning');
      expect(getOverallSeverity(1)).toBe('mild');
    });
  });

  // ============================================================================
  // SUBJECT LINE MULTIPLIER
  // ============================================================================
  describe('Subject Line Multiplier', () => {
    it('should apply 1.5x multiplier to subject line', () => {
      const bodyResult = analyzeSpamScore('Free money', false);
      const subjectResult = analyzeSpamScore('Free money', true);
      // Use toBeCloseTo for floating point comparison
      expect(subjectResult.totalScore).toBeCloseTo(bodyResult.totalScore * SPAM_CONFIG.subjectMultiplier, 2);
    });
  });

  // ============================================================================
  // COMBINED EMAIL ANALYSIS
  // ============================================================================
  describe('Combined Email Analysis', () => {
    it('should combine subject and body scores', () => {
      const result = analyzeEmail('FREE OFFER!', 'Act now to claim your prize');
      expect(result.combinedScore).toBeGreaterThan(result.subjectAnalysis.totalScore);
      expect(result.combinedScore).toBeGreaterThan(result.bodyAnalysis.totalScore);
    });

    it('should detect obvious spam email', () => {
      const result = analyzeEmail(
        'CONGRATULATIONS! You Won $1,000,000!!!',
        'Dear Winner, You have been selected to receive $1 million dollars. Click here now to claim your prize! This is not spam. Act immediately or your reward will expire.'
      );
      expect(result.overallSeverity).toBe('critical');
      expect(result.combinedScore).toBeGreaterThan(20);
    });

    it('should handle legitimate email', () => {
      const result = analyzeEmail(
        'Meeting tomorrow at 3pm',
        'Hi team, just a reminder about our meeting tomorrow. Please review the attached document beforehand. Thanks!'
      );
      expect(result.combinedScore).toBeLessThan(SPAM_CONFIG.thresholds.warning);
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================
  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      const result = analyzeSpamScore('');
      expect(result.totalScore).toBe(0);
      expect(result.matches).toHaveLength(0);
    });

    it('should handle null-like input', () => {
      const result = analyzeEmail('', '');
      expect(result.combinedScore).toBe(0);
    });

    it('should not double-count overlapping matches', () => {
      // "buy now" contains "now" - should not count both at same position
      const result = analyzeSpamScore('buy now');
      const positions = result.matches.map(m => `${m.position.start}-${m.position.end}`);
      const uniquePositions = new Set(positions);
      expect(positions.length).toBe(uniquePositions.size);
    });
  });

  // ============================================================================
  // REAL-WORLD SPAM EXAMPLES
  // ============================================================================
  describe('Real-World Spam Examples', () => {
    it('should catch Nigerian prince scam', () => {
      const result = analyzeEmail(
        'Urgent: Confidential Business Proposal',
        'Dear Friend, I am a Nigerian prince seeking your assistance to transfer $15 million dollars. You will receive 30% commission. Please reply immediately with your bank details.'
      );
      expect(result.overallSeverity).toBe('critical');
    });

    it('should catch lottery scam', () => {
      const result = analyzeEmail(
        'YOU WON THE LOTTERY!!!',
        'Congratulations! Your email was selected in our online lottery. You have won $500,000. To claim your prize, click here and verify your identity immediately.'
      );
      expect(result.overallSeverity).toBe('critical');
    });

    it('should catch phishing attempt', () => {
      const result = analyzeEmail(
        'Your Account Has Been Compromised',
        'Dear Customer, We detected suspicious activity on your account. Your account will be suspended unless you verify your identity now. Click here to confirm your password.'
      );
      expect(result.overallSeverity).toBe('critical');
    });

    it('should catch crypto scam', () => {
      const result = analyzeEmail(
        'Double Your Bitcoin Today!',
        'Amazing opportunity! Send us your Bitcoin and we will double it instantly. This is 100% guaranteed and risk-free. Only 24 hours left!'
      );
      expect(result.overallSeverity).toBe('critical');
    });

    it('should catch MLM pitch', () => {
      const result = analyzeEmail(
        'Work From Home - Unlimited Income Potential',
        'Be your own boss! Join our network marketing opportunity and earn while you sleep. No experience needed. Build your downline and achieve financial freedom!'
      );
      expect(result.combinedScore).toBeGreaterThan(10);
    });
  });
});
