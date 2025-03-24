"use client"

import type React from "react"

import { useState } from "react"
import { analyzeSentiment } from "@/lib/analyze-sentiment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [tweet, setTweet] = useState("")
  const [result, setResult] = useState<{ sentiment: number; accuracy: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const analysis = await analyzeSentiment(tweet)
      setResult(analysis)
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentText = (sentiment: number) => {
    if (sentiment === 1) return "Positive"
    if (sentiment === -1) return "Negative"
    return "Neutral"
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment === 1) return "text-green-400"
    if (sentiment === -1) return "text-red-400"
    return "text-yellow-400"
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-[#121212]">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-yellow-400 mb-4">Sentiment Analysis on Tweets</h1>
          <p className="text-purple-300 text-lg">for Brand Monitoring</p>
        </div>

        <Card className="bg-[#1e1e2f] border-purple-900">
          <CardHeader>
            <CardTitle className="text-purple-300">Analyze Tweet Sentiment</CardTitle>
            <CardDescription className="text-gray-400">Enter a tweet to analyze its sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Enter a tweet here..."
                  value={tweet}
                  onChange={(e) => setTweet(e.target.value)}
                  className="bg-[#2d2d3a] border-purple-800 text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !tweet.trim()}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white"
              >
                {loading ? "Analyzing..." : "Analyze Sentiment"}
              </Button>
            </form>
          </CardContent>
          {result && (
            <CardFooter className="flex flex-col items-start border-t border-purple-900 pt-6">
              <div className="w-full">
                <h3 className="text-lg font-medium text-white mb-2">Analysis Result:</h3>
                <div className="flex justify-between items-center bg-[#2d2d3a] p-4 rounded-md">
                  <div>
                    <p className="text-gray-300">Sentiment:</p>
                    <p className={`text-xl font-bold ${getSentimentColor(result.sentiment)}`}>
                      {getSentimentText(result.sentiment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-300">Accuracy:</p>
                    <p className="text-xl font-bold text-yellow-400">{(result.accuracy * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </main>
  )
}

