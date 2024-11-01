import { MetadataRoute } from 'next'
import { getAllBlogStaticPaths } from '../lib/markdown'

const BASE_URL = `https://c0nfig.vercel.app`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await getAllBlogStaticPaths()
  return [
    {
      url: `${BASE_URL}/docs/getting-started/introduction`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/docs/getting-started/quick-start`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...(paths?.map((path) => ({
      url: `${BASE_URL}/${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as any,
      priority: 0.8,
    })) ?? []),
  ]
}