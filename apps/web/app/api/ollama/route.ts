import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = 'llama3' } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Get Ollama host from environment variables
    const ollamaHost = process.env.OLLAMA_HOST || 'localhost'
    const ollamaPort = process.env.OLLAMA_PORT || '11434'
    const ollamaUrl = `http://${ollamaHost}:${ollamaPort}/api/generate`

    // Call Ollama API
    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ response: data.response })
  } catch (error) {
    console.error('Error calling Ollama:', error)
    const ollamaHost = process.env.OLLAMA_HOST || 'localhost'
    const ollamaPort = process.env.OLLAMA_PORT || '11434'
    return NextResponse.json(
      { error: `Failed to get AI response. Make sure Ollama is running on ${ollamaHost}:${ollamaPort}` },
      { status: 500 }
    )
  }
}
