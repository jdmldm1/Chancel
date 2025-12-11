/**
 * Request Queue Utility
 *
 * Implements a queue system to throttle API requests and avoid rate limiting.
 * Processes requests sequentially with a configurable delay between requests.
 */

type QueuedRequest<T> = {
  execute: () => Promise<T>
  resolve: (value: T) => void
  reject: (error: any) => void
}

class RequestQueue {
  private queue: QueuedRequest<any>[] = []
  private processing = false
  private delayMs: number

  constructor(delayMs: number = 500) {
    this.delayMs = delayMs
  }

  /**
   * Add a request to the queue
   * @param requestFn Function that returns a promise
   * @returns Promise that resolves when the request is processed
   */
  async enqueue<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        execute: requestFn,
        resolve,
        reject,
      })

      // Start processing if not already processing
      if (!this.processing) {
        this.processQueue()
      }
    })
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return
    }

    this.processing = true

    while (this.queue.length > 0) {
      const request = this.queue.shift()
      if (!request) continue

      try {
        const result = await request.execute()
        request.resolve(result)
      } catch (error) {
        request.reject(error)
      }

      // Wait before processing next request to avoid rate limiting
      if (this.queue.length > 0) {
        await this.delay(this.delayMs)
      }
    }

    this.processing = false
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get current queue length
   */
  get length(): number {
    return this.queue.length
  }

  /**
   * Check if queue is currently processing
   */
  get isProcessing(): boolean {
    return this.processing
  }
}

// Create a singleton instance for Bible API requests
// Using 500ms delay between requests to avoid rate limiting
export const bibleApiQueue = new RequestQueue(500)

export default RequestQueue
