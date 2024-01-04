import Image from 'next/image'
import Header from '@/components/ui/header'
import Hero from '@/components/ui/hero'
import { getPostContent, getPostsAndMetadata } from '@/libs/posts';
import { postsType } from '@/libs/types';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import Markdown from 'markdown-to-jsx';


export const generateStaticParams = () => {
    const posts = getPostsAndMetadata('static-pages')
    console.log(posts)
    return posts.map((post) => ({
            slug: post.slug 
    }))
}


export default function StaticPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    console.log(slug, 'slug')
    const postContents = getPostContent(slug, 'static-pages')
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
