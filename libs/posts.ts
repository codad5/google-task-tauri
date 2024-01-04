import fs from 'fs';
import matter from 'gray-matter';
import { postsType } from './types';
export const getPosts = (dir = '/') => {
    const files = fs.readdirSync(dir)
    const markdownFiles = files.filter((fn) => fn.endsWith('.md'))
    const slugs = markdownFiles.map((fn) => fn.replace('.md', ''))
    return slugs
}

export const getPostsAndMetadata = (dir = '/') : postsType[] => {
    const files = fs.readdirSync(dir)
    const markdownFiles = files.filter((fn) => fn.endsWith('.md'))
    
    return markdownFiles
    .sort((a, b) => {
        const aTime = fs.statSync(`${dir}/${a}`).mtime.getTime()
        const bTime = fs.statSync(`${dir}/${b}`).mtime.getTime()
        // return bTime - aTime
        // the newest post will be first
        return bTime - aTime
    })
    .map((fn) => {
        const fileContent = fs.readFileSync(`${dir}/${fn}`, 'utf-8')
        const { data } = matter(fileContent)
        return {
            slug: fn.replace('.md', ''),
            title: data.title,
            date: data.date,
            description: data.description,
            tags: data.tags,
            image: data.image,
            published: [false, 'false'].includes(data.published) ? false : true
        }
    })
}


export const getPostMetadata = (slug : string, dir = '/'): postsType|false => {
    if (!fs.existsSync(`${dir}/${slug}.md`)) return false;
    const fileContent = fs.readFileSync(`${dir}/${slug}.md`, 'utf-8')
    const { data, content } = matter(fileContent)
    return {
        slug: slug.replace('.md', ''),
        title: data.title,
        date: data.date,
        description: data.description ?? content.slice(0, 60),
        tags: data.tags,
        image: data.image
    }
}


export const getPostContent = (slug: any, dir = '/') => {
    //get file contents
    
    return fs.existsSync(`${dir}/${slug}.md`) ? fs.readFileSync(`${dir}/${slug}.md`, 'utf-8') : null;
}