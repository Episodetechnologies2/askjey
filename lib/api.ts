import axios from 'axios';

// Dynamically determine the backend API base url
const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL
});

// Map Work DB record to camelCase for frontend component compatibility
export function mapWork(work: any) {
  if (!work) return null;
  return {
    ...work,
    id: work.slug, // Map id to slug for routes matching
    shortDescription: work.short_description,
    longDescription: work.long_description,
    featuredImage: work.featured_image,
    image: work.featured_image, // Add image field for timeline compatibility
    heroImage: work.hero_image,
    isPublished: work.status === 'published',
    isTopWork: !!work.is_top_work,
    displayOrder: work.display_order,
    services: typeof work.services === 'string' ? JSON.parse(work.services) : (work.services || []),
    technologies: typeof work.technologies === 'string' ? JSON.parse(work.technologies) : (work.technologies || []),
    results: typeof work.results === 'string' ? JSON.parse(work.results) : (work.results || []),
    tags: typeof work.tags === 'string' ? JSON.parse(work.tags) : (work.tags || []),
    story: typeof work.story === 'string' ? JSON.parse(work.story) : (work.story || [])
  };
}

// Map Update (Article) DB record to camelCase for frontend compatibility
export function mapUpdate(article: any) {
  if (!article) return null;
  return {
    ...article,
    excerpt: article.short_description,
    body: typeof article.description === 'string' ? JSON.parse(article.description) : (article.description || []),
    image: article.thumbnail,
    keyTakeaways: typeof article.key_takeaways === 'string' ? JSON.parse(article.key_takeaways) : (article.key_takeaways || []),
    tags: typeof article.tags === 'string' ? JSON.parse(article.tags) : (article.tags || []),
    date: article.published_date
  };
}

export async function fetchWorks(params = {}) {
  const response = await api.get('/works', { params });
  return (response.data.works || []).map(mapWork);
}

export async function fetchWork(idOrSlug: string) {
  const response = await api.get(`/works/${idOrSlug}`);
  return mapWork(response.data);
}

export async function fetchUpdates(params = {}) {
  const response = await api.get('/updates', { params });
  return (response.data.updates || []).map(mapUpdate);
}

export async function fetchUpdate(idOrSlug: string) {
  const response = await api.get(`/updates/${idOrSlug}`);
  return mapUpdate(response.data);
}
