import axios from 'axios'

const WP_API_URL =
  process.env.NEXT_PUBLIC_WP_API_URL || 'https://amline-blog.darkube.app/wp-json/wp/v2'

const wpApiClient = axios.create({
  timeout: 15000, // 15 second timeout
  baseURL: WP_API_URL,
})

/**
 * Fetch posts from the WordPress API with optional filters and sorting.
 *
 * @param {Object} options - Options for fetching posts.
 * @param {string} [options.orderby='date'] - Sort by "author", "date", "id", "include", "modified", "parent", "relevance", "slug", "include_slugs", "title".
 * @param {string} [options.order='desc'] - Sort order ('asc' or 'desc').
 * @param {string} [options.search=''] - Search query to filter posts by title or content.
 * @param {number[]} [options.categories=[]] - Array of category IDs to filter posts.
 * @param {number} [options.limit=10] - Number of posts per page.
 * @param {number} [options.page=1] - Page number for pagination.
 * @param {boolean} [options.excludeHiddenTag=true] - Whether to exclude posts with a hidden category.
 * @param {boolean} [options.sticky=false] - Whether to fetch only sticky (pinned) posts.
 * @returns {Promise<Array>} - Array of formatted posts.
 */
export const apiGetPosts = async ({
  orderby = 'date',
  order = 'desc',
  search = '',
  categories = [],
  limit = 10,
  page = 1,
  excludeHiddenTag = true,
  sticky = false,
} = {}) => {
  const HIDDEN_CATEGORY_ID = 87

  const params = {
    per_page: limit,
    page,
    _embed: 'wp:featuredmedia,wp:term',
    order,
    orderby,
  }

  if (sticky) params.sticky = true
  if (search) params.search = search
  if (excludeHiddenTag) params.categories_exclude = HIDDEN_CATEGORY_ID
  if (categories.length > 0) params.categories = categories.join(',')

  try {
    const { data } = await wpApiClient.get(`/posts`, { params })

    return data.map((post) => ({
      id: post.id,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      slug: post.slug,
      date: post.date,
      thumbnail: {
        full:
          post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.full?.source_url || null,
        medium:
          post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
          null,
        thumbnail:
          post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.thumbnail?.source_url ||
          null,
      },
      categories:
        post._embedded?.['wp:term']?.[0]?.map((term) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        })) || [],
    }))
  } catch (error) {
    console.error('❌ apiGetPosts FAILED:')
    console.error('   Error:', error.message)
    console.error('   Status:', error.response?.status)
    return []
  }
}

export const apiGetPostBySlug = async (slug) => {
  const params = { _embed: 'wp:featuredmedia,wp:term', slug }

  try {
    const { data } = await wpApiClient.get(`/posts`, { params })
    const post = data[0]
    if (!post) return null

    return {
      id: post.id,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      content: post.content.rendered,
      slug: post.slug,
      date: post.date,
      thumbnail: {
        full:
          post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.full?.source_url || null,
        medium:
          post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
          null,
        thumbnail:
          post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.thumbnail?.source_url ||
          null,
      },
      categories:
        post._embedded?.['wp:term']?.[0]?.map((term) => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
        })) || [],
      areCommentsOpen: post.comment_status === 'open',
      seo: post.yoast_head_json,
    }
  } catch (error) {
    console.error('❌ apiGetPostBySlug FAILED:')
    console.error('   Error:', error.message)
    console.error('   Status:', error.response?.status)
    return null
  }
}

export const apiGetAllPostSlugs = async () => {
  try {
    const { data } = await wpApiClient.get(`/post-slugs`)
    return data
  } catch (error) {
    console.error('❌ apiGetAllPostSlugs FAILED:')
    console.error('   Error:', error.message)
    console.error('   Status:', error.response?.status)
    return []
  }
}

export const apiGetComments = async (postId) => {
  try {
    const { data } = await wpApiClient.get(`/comments/nested?post=${postId}`)
    return data
  } catch (error) {
    console.error('❌ apiGetComments FAILED:')
    console.error('   Error:', error.message)
    console.error('   Status:', error.response?.status)
    return []
  }
}

/**
 * Posts a comment to a WordPress site using the REST API.
 *
 * @param {Object} commentData - The comment data to be posted.
 * @param {number} commentData.postId - The ID of the post to which the comment belongs.
 * @param {string} commentData.author_name - The name of the comment author.
 * @param {string} commentData.author_email - The email of the comment author.
 * @param {string} commentData.content - The content of the comment.
 * @returns {Promise<Object>} The response data from the API.
 */
export const apiPostComment = async (commentData) => {
  try {
    const { data } = await wpApiClient.post(`/comments`, commentData)
    return data
  } catch (error) {
    console.error('❌ apiPostComment FAILED:')
    console.error('   Error:', error.message)
    console.error('   Status:', error.response?.status)
    return null
  }
}

export const apiGetCategories = async () => {
  try {
    const { data } = await wpApiClient.get(`/categories`)
    return data
  } catch (error) {
    console.error('❌ apiGetCategories FAILED:')
    console.error('   Error:', error.message)
    console.error('   Status:', error.response?.status)
    return []
  }
}

export const apiGetCategoryBySlug = async (slug) => {
  try {
    const { data } = await wpApiClient.get(`/categories?slug=${slug}`)
    return data[0]
  } catch (error) {
    console.error('❌ apiGetCategoryBySlug FAILED:')
    console.error('   Error:', error.message)
    console.error('   Status:', error.response?.status)
    return null
  }
}
