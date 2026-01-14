import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "content/articles")

export type Article = {
  slug: string
  title: string
  date: string
  description: string
  content: string
  cover?: string
  tags?: string[]
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "")
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      ...(data as { title: string; date: string; description: string; cover?: string; tags?: string[] }),
    }
  })

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    return {
      slug,
      content,
      ...(data as { title: string; date: string; description: string; cover?: string; tags?: string[] }),
    }
  } catch {
    return null
  }
}
