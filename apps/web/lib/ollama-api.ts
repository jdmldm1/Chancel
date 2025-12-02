/**
 * Ollama API integration for AI scripture insights
 */

export interface OllamaRequest {
  model: string
  prompt: string
  stream?: boolean
}

export interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
}

/**
 * Send a prompt to Ollama and get a response
 */
export async function queryOllama(prompt: string, model: string = 'llama3'): Promise<string> {
  try {
    const response = await fetch('/api/ollama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('Error querying Ollama:', error)
    throw new Error('Failed to get AI response. Make sure Ollama is running.')
  }
}

/**
 * Generate AI insights for a scripture passage
 */
export async function getScriptureInsight(
  scriptureText: string,
  scriptureReference: string,
  insightType: 'summarize' | 'historical' | 'nature-of-god' | 'application'
): Promise<string> {
  const prompts = {
    summarize: `Please provide a brief, clear summary of the following scripture passage from ${scriptureReference}:\n\n"${scriptureText}"\n\nProvide a concise 2-3 sentence summary of the main message.`,

    historical: `What is the historical and archaeological context of this scripture passage from ${scriptureReference}?\n\n"${scriptureText}"\n\nPlease provide insights about the historical setting, cultural context, and any relevant archaeological evidence.`,

    'nature-of-god': `What does this scripture from ${scriptureReference} reveal about the nature of God?\n\n"${scriptureText}"\n\nPlease explain what this passage teaches us about God's character, attributes, or relationship with humanity.`,

    application: `What can I take from this scripture and apply to my life? (${scriptureReference})\n\n"${scriptureText}"\n\nPlease provide practical, actionable insights for how to apply this passage to daily Christian living.`,
  }

  const prompt = prompts[insightType]
  return await queryOllama(prompt)
}
