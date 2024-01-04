import Image from 'next/image'
import Header from '@/components/ui/header'
import Hero from '@/components/ui/hero'
import { getPostContent, getPostMetadata, getPostsAndMetadata } from '@/libs/posts';
import { postsType } from '@/libs/types';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import Markdown from 'markdown-to-jsx';
import { Metadata } from 'next';


export const generateStaticParams = () => {
    const posts = getPostsAndMetadata('./static-pages')
    console.log(posts)
    return posts.map((post) => ({
            slug: post.slug 
    }))
}

export async function generateMetadata({ params, searchParams }: { params: { slug: string }, searchParams: any }): Promise<Metadata> {
    const { slug } = params;
    const postContents = getPostMetadata(slug, './static-pages')
    if(!postContents) return {};
    const { title, date, description, tags, image } = postContents
    return {
      title,
      description : `Google Task Desktop Client - ${description}`,
      keywords: tags ?? ['google', 'task', 'desktop', 'client', 'electron', 'react', 'typescript', 'nextjs', 'codad5'],
      authors: [{ name: 'Chibueze Michael Aniezeofor', url: 'https://codad5.me' }],
      creator: 'Chibueze Michael Aniezeofor',
      publisher: 'Chibueze Michael Aniezeofor',
      alternates: {},
      formatDetection: {
          email: true,
          address: true,
          telephone: true,
      },
      openGraph: {
          title,
          description,
          url: `https://google-task.codad5.me//${slug}`,
          type: 'website',
          images: [
              {
                  url: image ?? 'https://google-task.codad5.me/google-task.png',
                  width: 800,
                  height: 600,
                  alt: title,
              },
          ],
      },
    }
}


export default function StaticPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    console.log(slug, 'slug')
    const postContents = getPostContent(slug, './static-pages')
    if(!postContents) notFound()
    const { content, data } = matter(postContents);
    const { title, date, image , tags, description} = data as postsType
  return (
      <main className="w-full h-full">
        <article className="w-full h-full p-8 prose lg:prose-xl prose-dark">
              <Markdown>
                    {content}
            </Markdown>
        </article>
    </main>
  )
}
