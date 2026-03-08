import { env } from '@/config/env'

type FetchOptions = {
  revalidate?: number
  cache?: RequestCache
}

class WordPressClient {
  private static instance: WordPressClient
  private baseUrl: string

  private constructor() {
    this.baseUrl = `${env.BLOG_URL}/wp-json/wp/v2`
  }

  static getInstance() {
    if (!WordPressClient.instance) WordPressClient.instance = new WordPressClient()
    return WordPressClient.instance
  }

  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { revalidate, cache } = options

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      next: revalidate ? { revalidate } : undefined,
      cache: cache || 'force-cache',
    })

    if (!res.ok) {
      throw new Error(`Failed request: ${endpoint}`)
    }

    return res.json()
  }

  // -----------------------
  // API methods
  // -----------------------

  async getPosts<T>(limit = 10, options?: FetchOptions) {
    return this.request<T[]>(`/posts?per_page=${limit}&_embed`, options)
  }

  async getPostBySlug<T>(slug: string, options?: FetchOptions) {
    const posts = await this.request<T[]>(`/posts?slug=${slug}&_embed`, options)
    return posts[0] || null
  }

  async getCategories(options?: FetchOptions) {
    return this.request<unknown[]>(`/categories`, options)
  }

  async getPages<T>(limit = 10, options?: FetchOptions) {
    return this.request<T[]>(`/pages?per_page=${limit}&_embed`, options)
  }
}

export const wpClient = WordPressClient.getInstance()
