import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Share Categories & Resources
  const shareData = [
    {
      key: 'tools',
      name: 'Tools & AI',
      description: 'Useful tools, AI platforms, and online services.',
      icon: 'ph:robot-duotone',
      color: 'text-purple-500',
      sortOrder: 1,
      resources: [
        {
          title: 'OpenRouter',
          description: 'A unified API for the best LLMs',
          link: 'https://openrouter.ai',
          iconName: 'ph:robot',
          order: 1,
          customData: { type: 'AI API' }
        },
        {
          title: 'Right Code - 企业级 AI Agent 中转平台',
          description: 'AI proxy services and agent platform.',
          link: 'https://rightcode.example',
          iconName: 'ph:server',
          order: 2,
          customData: { type: 'API Proxy' }
        },
        {
          title: 'CUBENCE - Claude Code & Codex Gateway',
          description: 'Gateway for AI code models like Claude and Codex.',
          link: 'https://cubence.example',
          iconName: 'ph:code-block',
          order: 3,
          customData: { type: 'AI Gateway' }
        },
        {
          title: 'ModelScope 魔搭社区',
          description: 'Model-as-a-Service platform, China\'s equivalent to Hugging Face.',
          link: 'https://modelscope.cn',
          iconName: 'ph:cube',
          order: 4,
          customData: { type: 'AI Community' }
        },
        {
          title: 'Build, debug & deploy with AI | Gemini CLI',
          description: 'Command line tool for Google Gemini AI integrations.',
          link: 'https://gemini.google.com',
          iconName: 'ph:terminal',
          order: 5,
          customData: { type: 'CLI Tool' }
        },
        {
          title: 'JS Visualizer 9000',
          description: 'Visualize JavaScript execution (event loop, call stack, etc).',
          link: 'https://www.jsv9000.app/',
          iconName: 'ph:file-js',
          order: 6,
          customData: { type: 'Dev Tool' }
        },
        {
          title: 'Slidev',
          description: 'Presentation slides for developers using Markdown.',
          link: 'https://sli.dev/',
          iconName: 'ph:presentation-chart',
          order: 7,
          customData: { type: 'Presentation' }
        },
        {
          title: '随机二次元图片 | LoliApi',
          description: 'Random anime image generation API.',
          link: 'https://www.loliapi.com/',
          iconName: 'ph:image',
          order: 8,
          customData: { type: 'API' }
        }
      ]
    },
    {
      key: 'learning',
      name: 'Learning & Community',
      description: 'Tutorials, blogs, guidelines, and tech forums.',
      icon: 'ph:books-duotone',
      color: 'text-blue-500',
      sortOrder: 2,
      resources: [
        {
          title: 'Halo - 强大易用的开源建站工具',
          description: 'Modern open-source blog and CMS system built with Java.',
          link: 'https://halo.run/',
          iconName: 'ph:browser',
          order: 1,
          customData: { type: 'CMS/Blog' }
        },
        {
          title: '代码审查标准 | eng-practices',
          description: 'Google\'s engineering practices documentation and code review standards.',
          link: 'https://google.github.io/eng-practices/',
          iconName: 'ph:book-open',
          order: 2,
          customData: { type: 'Guidelines' }
        },
        {
          title: '(1) LINUX DO - 新的理想型社区',
          description: 'A popular tech forum and community for AI resources and discussions.',
          link: 'https://linux.do',
          iconName: 'ph:users-three',
          order: 3,
          customData: { type: 'Forum' }
        },
        {
          title: 'AI邮报 | 每周必知5件AI大事',
          description: 'Weekly newsletters and updates on AI trends.',
          link: 'https://ai-newsletter.example',
          iconName: 'ph:newspaper-clipping',
          order: 4,
          customData: { type: 'Newsletter' }
        },
        {
          title: '前端 - 为什么AI生成的页面总是紫色，一眼AI',
          description: 'Discussions on SegmentFault about AI-generated UI trends.',
          link: 'https://segmentfault.com',
          iconName: 'ph:chat-circle-text',
          order: 5,
          customData: { type: 'Discussion' }
        },
        {
          title: '通往AGI之路 - 飞书云文档',
          description: 'Comprehensive Feishu knowledge base mapping the path to AGI.',
          link: 'https://feishu.cn',
          iconName: 'ph:file-text',
          order: 6,
          customData: { type: 'Knowledge Base' }
        },
        {
          title: 'Medium',
          description: 'Global publishing platform for tech and personal blogs.',
          link: 'https://medium.com',
          iconName: 'ph:article',
          order: 7,
          customData: { type: 'Blog Platform' }
        },
        {
          title: 'Backlight - Build Design Systems',
          description: 'Tools and component libraries for building frontend design systems.',
          link: 'https://backlight.dev',
          iconName: 'ph:palette',
          order: 8,
          customData: { type: 'Design System' }
        },
        {
          title: '分享 | 如何科学刷题？ - 讨论 - 力扣 (LeetCode)',
          description: 'Algorithm and coding interview preparation discussion on LeetCode.',
          link: 'https://leetcode.cn',
          iconName: 'ph:code',
          order: 9,
          customData: { type: 'Algorithm' }
        },
        {
          title: 'smallyu的博客',
          description: 'Personal tech blog of a developer.',
          link: 'https://smallyu.net/',
          iconName: 'ph:user',
          order: 10,
          customData: { type: 'Personal Blog' }
        }
      ]
    },
    {
      key: 'repos',
      name: 'Repositories',
      description: 'Interesting GitHub repositories and open source projects.',
      icon: 'ph:git-fork-duotone',
      color: 'text-orange-500',
      sortOrder: 3,
      resources: [
        {
          title: 'lbjlaq/Antigravity-Manager',
          description: 'Professional Antigravity backend management system repository.',
          link: 'https://github.com/lbjlaq/Antigravity-Manager',
          iconName: 'ph:github-logo',
          order: 1,
          customData: { type: 'GitHub Repo' }
        },
        {
          title: '发布 CC Switch v3.11.0 · farion1231/cc-switch',
          description: 'Release page for the open source project cc-switch.',
          link: 'https://github.com/farion1231/cc-switch',
          iconName: 'ph:github-logo',
          order: 2,
          customData: { type: 'GitHub Release' }
        }
      ]
    }
  ]

  for (const catData of shareData) {
    const { resources, ...catInfo } = catData
    
    // Create or update category
    await prisma.shareCategory.upsert({
      where: { key: catInfo.key },
      update: catInfo,
      create: catInfo,
    })

    // Upsert resources for this category
    for (const res of resources) {
      const existingResource = await prisma.shareResource.findFirst({
        where: { link: res.link }
      })

      if (existingResource) {
        await prisma.shareResource.update({
          where: { id: existingResource.id },
          data: {
            ...res,
            category: { connect: { key: catInfo.key } }
          }
        })
      } else {
        await prisma.shareResource.create({
          data: {
            ...res,
            category: { connect: { key: catInfo.key } }
          }
        })
      }
    }
  }
  
  console.log('✓ Real share bookmarks and categories seeded')

  // Generate 20 dummy projects
  console.log('Generating dummy projects...')
  
  // Create some default tags first if they don't exist
  const tags = ['React', 'Next.js', 'Vue', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Prisma', 'UI/UX']
  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { slug: tagName.toLowerCase().replace('.', '') },
      update: {},
      create: { name: tagName, slug: tagName.toLowerCase().replace('.', '') },
    })
  }
  
  const allTags = await prisma.tag.findMany()

  for (let i = 1; i <= 20; i++) {
    const slug = `dummy-project-${i}`
    
    // Pick 2-3 random tags
    const randomTags = [...allTags]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 2)

    await prisma.project.upsert({
      where: { slug },
      update: {
        title: `Dummy Project ${i}`,
        description: `This is a randomly generated dummy project description for testing purposes. Project number ${i}. It features modern web technologies and a beautiful responsive design.`,
        content: `## About Project ${i}\n\nThis is the detailed content for dummy project ${i}. It was automatically generated to test the grid layout and pagination features of the projects page.\n\n### Features\n- Beautiful UI\n- Fully responsive\n- Dark mode support\n- Uses Next.js and Tailwind`,
        thumbnail: `https://www.loliapi.com/bg/?id=${i}`, // Using loliapi as requested, passing id to get different random images
        demoUrl: 'https://example.com',
        githubUrl: 'https://github.com/wuchib',
        stars: Math.floor(Math.random() * 5000), // Random stars between 0-5000
        featured: i <= 3, // Make the first 3 featured
        order: i,
        tags: {
          deleteMany: {},
          create: randomTags.map(tag => ({
            tag: { connect: { id: tag.id } }
          }))
        }
      },
      create: {
        slug,
        title: `Dummy Project ${i}`,
        description: `This is a randomly generated dummy project description for testing purposes. Project number ${i}. It features modern web technologies and a beautiful responsive design.`,
        content: `## About Project ${i}\n\nThis is the detailed content for dummy project ${i}. It was automatically generated to test the grid layout and pagination features of the projects page.\n\n### Features\n- Beautiful UI\n- Fully responsive\n- Dark mode support\n- Uses Next.js and Tailwind`,
        thumbnail: `https://www.loliapi.com/bg/?id=${i}`, 
        demoUrl: 'https://example.com',
        githubUrl: 'https://github.com/wuchib',
        stars: Math.floor(Math.random() * 5000),
        featured: i <= 3,
        order: i,
        tags: {
          create: randomTags.map(tag => ({
            tag: { connect: { id: tag.id } }
          }))
        }
      }
    })
  }

  console.log('✓ 20 dummy projects seeded')
  
  console.log('\n📌 提示: 请运行以下命令创建管理员账户:')
  console.log('   npx ts-node scripts/setup-admin.ts')
  console.log('\nSeeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
