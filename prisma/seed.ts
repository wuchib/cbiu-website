import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Share Categories
  const categories = [
    {
      key: 'design',
      name: 'Design',
      description: 'UI/UX resources, inspiration, and design systems.',
      icon: 'ph:paint-brush-duotone',
      color: 'text-purple-500',
      sortOrder: 1
    },
    {
      key: 'dev-tools',
      name: 'Dev Tools',
      description: 'Essential tools for productivity and development.',
      icon: 'ph:wrench-duotone',
      color: 'text-blue-500',
      sortOrder: 2
    },
    {
      key: 'languages',
      name: 'Languages (Program)',
      description: 'Documentation and guides for programming languages.',
      icon: 'ph:code-duotone',
      color: 'text-green-500',
      sortOrder: 3
    },
    {
      key: 'repos',
      name: 'Repositories',
      description: 'High-quality open source projects and templates.',
      icon: 'ph:git-fork-duotone',
      color: 'text-orange-500',
      sortOrder: 4
    }
  ]

  for (const cat of categories) {
    await prisma.shareCategory.upsert({
      where: { key: cat.key },
      update: cat,
      create: cat,
    })
  }
  
  console.log('✓ Share categories seeded')
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
