import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Generating test data...')
  
  // Create a random suffix to avoid slug/key collisions
  const rand = Math.floor(Math.random() * 10000)

  // Create test category for Share
  const shareCategory = await prisma.shareCategory.create({
    data: {
      name: `Test Category ${rand}`,
      key: `test-${rand}`,
      icon: 'ph:folder',
    }
  })

  // Create test category for Article
  const articleCategory = await prisma.articleCategory.create({
    data: {
      name: `Test Article Category ${rand}`,
      slug: `test-article-category-${rand}`,
      description: 'A category for test articles',
    }
  })

  // 1. Articles
  for (let i = 1; i <= 20; i++) {
    await prisma.article.create({
      data: {
        title: `Test Article ${i} (${rand})`,
        slug: `test-article-${i}-${rand}`,
        content: `This is the content for test article ${i}. Generated for pagination testing.`,
        published: true,
        categoryId: articleCategory.id
      }
    })
  }
  console.log('✅ Created 20 Articles')

  // 2. Projects
  for (let i = 1; i <= 20; i++) {
    await prisma.project.create({
      data: {
        title: `Test Project ${i} (${rand})`,
        slug: `test-project-${i}-${rand}`,
        description: `This is a test project description ${i}`,
        demoUrl: `https://example.com/project/${i}`,
        githubUrl: `https://github.com/test/project-${i}`,
      }
    })
  }
  console.log('✅ Created 20 Projects')

  // 3. Friend Links
  for (let i = 1; i <= 20; i++) {
    await prisma.friendLink.create({
      data: {
        name: `Friend ${i} (${rand})`,
        link: `https://friend${i}.example.com`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}-${rand}`,
      }
    })
  }
  console.log('✅ Created 20 Friend Links')

  // 4. Share Resources
  for (let i = 1; i <= 20; i++) {
    await prisma.shareResource.create({
      data: {
        title: `Share Item ${i} (${rand})`,
        description: `This is a test share resource description ${i}`,
        link: `https://share${i}.example.com`,
        categoryKey: shareCategory.key,
      }
    })
  }
  console.log('✅ Created 20 Share Items')

  // 5. Todos
  for (let i = 1; i <= 20; i++) {
    await prisma.todo.create({
      data: {
        title: `Todo Task ${i} (${rand})`,
        description: `Description for todo ${i}`,
        status: i % 4, // 0, 1, 2, 3
      }
    })
  }
  console.log('✅ Created 20 Todos')

  console.log('✨ All test data generated successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
