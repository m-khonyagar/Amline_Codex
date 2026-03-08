import { wpClient } from '@/lib/wp-client'

export type HomePost = {
  id: number
  slug: string
  title: { rendered: string }
  excerpt?: { rendered: string }
  content: { rendered: string }
  link: string
  _embedded?: { 'wp:featuredmedia': [{ source_url?: string }] }
  date: string
}

export async function getHomePosts(limit = 6) {
  return wpClient.getPosts<HomePost>(limit, { cache: 'force-cache' })
}
