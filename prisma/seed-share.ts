
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    {
      key: 'magic',
      name: 'Magic',
      description: 'VPN, Airport, VPS',
      icon: 'ph:magic-wand-duotone',
      color: 'text-purple-500',
      sortOrder: 1,
      fieldsSchema: [
        { key: 'price', label: 'Price', type: 'text', placeholder: 'e.g. $5/mo' },
        { key: 'speed', label: 'Speed', type: 'select', options: ['Fast', 'Medium', 'Slow'] }
      ]
    },
    {
      key: 'ai',
      name: 'AI',
      description: 'Artificial Intelligence Tools',
      icon: 'ph:robot-duotone',
      color: 'text-blue-500',
      sortOrder: 2
    },
    {
      key: 'frontend',
      name: 'Frontend',
      description: 'Frontend Development Resources',
      icon: 'ph:code-duotone',
      color: 'text-cyan-500',
      sortOrder: 3
    },
    {
      key: 'tools',
      name: 'Tools',
      description: 'Great Software & Platforms',
      icon: 'ph:wrench-duotone',
      color: 'text-orange-500',
      sortOrder: 4
    },
    {
      key: 'learning',
      name: 'Learning',
      description: 'Learning Resources',
      icon: 'ph:student-duotone',
      color: 'text-green-500',
      sortOrder: 5
    },
    {
      key: 'giants',
      name: 'Giants',
      description: 'Recommended Bloggers',
      icon: 'ph:users-three-duotone',
      color: 'text-red-500',
      sortOrder: 6
    }
  ]

  for (const cat of categories) {
    await prisma.shareCategory.upsert({
      where: { key: cat.key },
      update: cat,
      create: cat,
    })
  }

  console.log('Seed completed!')
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
