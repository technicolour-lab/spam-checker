# Spam Checker

A real-time email spam checker that helps you avoid spam filters before you hit send. Paste your email content and instantly see which words and phrases might trigger spam filters.

## Features

- **Real-time highlighting** - Spam triggers are highlighted as you type
- **300+ detection patterns** - Comprehensive coverage of spam triggers
- **Weighted scoring system** - Not all triggers are equal; critical issues score higher
- **Subject line multiplier** - Subject line triggers are weighted 1.5x (where spam filters focus)
- **Advanced obfuscation detection** - Catches leet speak, unicode tricks, zero-width characters
- **No data leaves your browser** - 100% client-side analysis

## Detection Categories

| Category | Examples |
|----------|----------|
| **Urgency** | "act now", "limited time", "expires today" |
| **Money/Scams** | "free money", "you won", "million dollars" |
| **Phishing** | "verify your account", "suspended", "confirm identity" |
| **Obfuscation** | "v1agra", "fr33", "F R E E" |
| **Unicode tricks** | Cyrillic lookalikes, zero-width characters |
| **Pressure tactics** | "last chance", "don't miss out", "only 3 left" |
| **Suspicious links** | URL shorteners, IP addresses, sketchy TLDs |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/automated-lab/spam-checker.git
cd spam-checker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run
```

## Tech Stack

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Vitest** - Testing

## How It Works

The spam checker uses a weighted scoring system:

1. **Phrase matching** - 270+ known spam phrases with severity scores (0.3 - 5.0)
2. **Regex patterns** - 80+ patterns for obfuscation, formatting abuse, etc.
3. **Subject multiplier** - Subject line matches are weighted 1.5x
4. **Severity classification**:
   - **Critical** (red): Score ≥ 6.0 - High spam risk
   - **Warning** (orange): Score ≥ 3.0 - Moderate risk
   - **Mild** (yellow): Score < 3.0 - Minor indicators

## Contributing

Contributions are welcome! Here are some ways you can help:

- **Add new spam patterns** - Found a trigger we're missing? Add it to `lib/spam-words.ts`
- **Improve detection** - Better regex patterns, fewer false positives
- **UI/UX improvements** - Make it easier to use
- **Documentation** - Help others understand the project

### Adding New Patterns

Spam triggers are defined in `lib/spam-words.ts`:

```typescript
// Add a phrase trigger
{ phrase: "your phrase here", score: 2.0, category: "category" }

// Add a regex pattern
{ pattern: /your-regex/gi, score: 1.5, description: "description" }
```

Run `npm run test:run` to ensure your changes don't break existing tests.

## Deploy

Deploy easily on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/automated-lab/spam-checker)

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Made with ❤️ in Sydney

**Note**: This tool helps identify potential spam triggers but doesn't guarantee email deliverability. Always follow email best practices and respect your recipients.
