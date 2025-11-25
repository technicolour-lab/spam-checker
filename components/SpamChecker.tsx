"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Trash2 } from "lucide-react"
import Image from "next/image"
import { HighlightWithinTextarea } from "react-highlight-within-textarea"
import {
  analyzeEmail,
  countWords,
  SPAM_CONFIG,
  type SpamSeverity,
  type ScoredMatch
} from "@/lib/spam-words"

export function SpamChecker() {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [mounted, setMounted] = useState(false)
  const [copiedSubject, setCopiedSubject] = useState(false)
  const [copiedBody, setCopiedBody] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const wordCount = countWords(body)

  // Analyze email with weighted scoring
  const emailAnalysis = useMemo(() => {
    return analyzeEmail(subject, body)
  }, [subject, body])

  const { combinedScore, overallSeverity, shouldHighlight, allMatches } = emailAnalysis

  // Group matches by severity for display
  const matchesBySeverity = useMemo(() => {
    const grouped: Record<SpamSeverity, ScoredMatch[]> = {
      critical: [],
      warning: [],
      mild: []
    }
    for (const match of allMatches) {
      grouped[match.severity].push(match)
    }
    return grouped
  }, [allMatches])

  // Build highlight patterns based on severity - always show highlights when matches exist
  const highlightPatterns = useMemo(() => {
    if (allMatches.length === 0) return []

    // Create highlight config with CSS classes per severity
    const patterns: Array<{ highlight: string | RegExp; className: string }> = []

    // Dedupe by text to avoid duplicate patterns
    const seen = new Set<string>()

    // Add critical matches (red)
    for (const match of matchesBySeverity.critical) {
      const lower = match.text.toLowerCase()
      if (seen.has(lower)) continue
      seen.add(lower)
      patterns.push({
        highlight: match.text,
        className: "spam-highlight-critical"
      })
    }

    // Add warning matches (orange)
    for (const match of matchesBySeverity.warning) {
      const lower = match.text.toLowerCase()
      if (seen.has(lower)) continue
      seen.add(lower)
      patterns.push({
        highlight: match.text,
        className: "spam-highlight-warning"
      })
    }

    // Add mild matches (yellow)
    for (const match of matchesBySeverity.mild) {
      const lower = match.text.toLowerCase()
      if (seen.has(lower)) continue
      seen.add(lower)
      patterns.push({
        highlight: match.text,
        className: "spam-highlight-mild"
      })
    }

    return patterns
  }, [allMatches, matchesBySeverity])

  const copyToClipboard = async (text: string, type: 'subject' | 'body') => {
    if (!text.trim()) return
    await navigator.clipboard.writeText(text)
    if (type === 'subject') {
      setCopiedSubject(true)
      setTimeout(() => setCopiedSubject(false), 2000)
    } else {
      setCopiedBody(true)
      setTimeout(() => setCopiedBody(false), 2000)
    }
  }

  const clearAll = () => {
    setSubject("")
    setBody("")
    setCopiedSubject(false)
    setCopiedBody(false)
  }

  const hasContent = subject.trim() || body.trim()

  // Get severity badge color
  const getSeverityColor = (severity: SpamSeverity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 hover:bg-red-600'
      case 'warning': return 'bg-orange-500 hover:bg-orange-600'
      case 'mild': return 'bg-yellow-500 hover:bg-yellow-600 text-yellow-900'
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                <Image src="/logo.png" alt="Spam Checker" width={40} height={40} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Spam Checker</h1>
                <p className="text-sm text-muted-foreground">Check your email for spam triggers before sending</p>
              </div>
            </div>
            <a
              href="https://github.com/automated-lab/spam-checker"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:opacity-70 transition-opacity"
              aria-label="View on GitHub"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Input Section */}
            <Card className="border-border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-card-foreground">Paste your email content</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Spam triggers highlight as you type
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {allMatches.length > 0 && (
                      <Badge className={`font-mono text-xs ${shouldHighlight ? getSeverityColor(overallSeverity) : ''}`} variant={shouldHighlight ? "default" : "secondary"}>
                        {allMatches.length} trigger{allMatches.length !== 1 ? 's' : ''} ({combinedScore.toFixed(1)} pts)
                      </Badge>
                    )}
                    {wordCount > 0 && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        {wordCount} words
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Subject Line */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Subject Line</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(subject, 'subject')}
                        disabled={!subject.trim()}
                        className="h-7 px-2 text-xs"
                      >
                        {copiedSubject ? (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-3 w-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <div className={`subject-highlight-wrapper ${shouldHighlight ? `severity-${overallSeverity}` : ''}`}>
                      {mounted ? (
                        <HighlightWithinTextarea
                          value={subject}
                          highlight={highlightPatterns}
                          onChange={(value: string) => setSubject(value)}
                          placeholder="Enter your email subject line here..."
                        />
                      ) : (
                        <input
                          type="text"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                          placeholder="Enter your email subject line here..."
                          disabled
                        />
                      )}
                    </div>
                  </div>

                  {/* Email Body */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Email Body</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(body, 'body')}
                        disabled={!body.trim()}
                        className="h-7 px-2 text-xs"
                      >
                        {copiedBody ? (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-3 w-3" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <div className={`body-highlight-wrapper ${shouldHighlight ? `severity-${overallSeverity}` : ''}`}>
                      {mounted ? (
                        <HighlightWithinTextarea
                          value={body}
                          highlight={highlightPatterns}
                          onChange={(value: string) => setBody(value)}
                          placeholder="Paste your email body content here..."
                        />
                      ) : (
                        <textarea
                          className="flex min-h-[220px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                          placeholder="Paste your email body content here..."
                          disabled
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={clearAll} disabled={!hasContent}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>
            </Card>

            {/* Spam Analysis Summary */}
            {allMatches.length > 0 && (
              <Card className={`p-4 ${
                shouldHighlight ? (
                  overallSeverity === 'critical' ? 'border-red-300 bg-red-50' :
                  overallSeverity === 'warning' ? 'border-orange-300 bg-orange-50' :
                  'border-yellow-300 bg-yellow-50'
                ) : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${
                      shouldHighlight ? (
                        overallSeverity === 'critical' ? 'text-red-800' :
                        overallSeverity === 'warning' ? 'text-orange-800' :
                        'text-yellow-800'
                      ) : 'text-gray-700'
                    }`}>
                      {shouldHighlight ? (
                        <>
                          {overallSeverity === 'critical' && 'High spam risk detected'}
                          {overallSeverity === 'warning' && 'Moderate spam risk detected'}
                          {overallSeverity === 'mild' && 'Minor spam indicators found'}
                        </>
                      ) : (
                        'Spam triggers detected (below threshold)'
                      )}
                    </p>
                    <span className={`text-sm font-mono ${
                      shouldHighlight ? (
                        overallSeverity === 'critical' ? 'text-red-700' :
                        overallSeverity === 'warning' ? 'text-orange-700' :
                        'text-yellow-700'
                      ) : 'text-gray-600'
                    }`}>
                      {combinedScore.toFixed(1)} / {SPAM_CONFIG.thresholds.highlight} threshold
                    </span>
                  </div>

                  {/* Group matches by severity */}
                  {(['critical', 'warning', 'mild'] as SpamSeverity[]).map(severity => {
                    const severityMatches = matchesBySeverity[severity]
                    if (severityMatches.length === 0) return null

                    const severityScore = severityMatches.reduce((sum, m) => sum + m.score, 0)
                    const uniqueTexts = [...new Set(severityMatches.map(m => m.text.toLowerCase()))]

                    return (
                      <div key={severity} className="space-y-1">
                        <p className={`text-xs font-medium uppercase ${
                          severity === 'critical' ? 'text-red-600' :
                          severity === 'warning' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}>
                          {severity} ({severityScore.toFixed(1)} pts)
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {uniqueTexts.slice(0, 10).map((text, i) => {
                            const match = severityMatches.find(m => m.text.toLowerCase() === text)
                            return (
                              <Badge
                                key={i}
                                variant="outline"
                                className={`text-xs ${
                                  severity === 'critical' ? 'bg-red-100 text-red-700 border-red-300' :
                                  severity === 'warning' ? 'bg-orange-100 text-orange-700 border-orange-300' :
                                  'bg-yellow-100 text-yellow-700 border-yellow-300'
                                }`}
                              >
                                {text} ({match?.score.toFixed(1)})
                              </Badge>
                            )
                          })}
                          {uniqueTexts.length > 10 && (
                            <Badge variant="outline" className="text-xs bg-white">
                              +{uniqueTexts.length - 10} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            <a href="https://github.com/automated-lab/spam-checker/issues" className="text-foreground/70 hover:text-foreground underline underline-offset-2">
              Always around if you need me
            </a>
            <span className="mx-2">·</span>
            Made with <span className="text-red-500">❤️</span> in Sydney
          </p>
        </div>
      </footer>
    </div>
  )
}
