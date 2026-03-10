import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categoriesToDelete = ['design', 'dev-tools', 'languages']

  for (const cat of categoriesToDelete) {
    try {
      // First delete associated resources
      await prisma.shareResource.deleteMany({
        where: { categoryKey: cat }
      })

      // Then delete the category
      await prisma.shareCategory.deleteMany({
        where: { key: cat }
      })
      console.log(`Deleted category: ${cat}`)
    } catch (e) {
      console.error(`Error deleting ${cat}:`, e)
    }
  }
  
  // also clean up any dummy resources in repos 
  // currently we only have 'https://github.com/lbjlaq/Antigravity-Manager' and 'https://github.com/farion1231/cc-switch'
  const realLinks = [
    'https://github.com/lbjlaq/Antigravity-Manager',
    'https://github.com/farion1231/cc-switch'
  ]
  await prisma.shareResource.deleteMany({
    where: {
      categoryKey: 'repos',
      link: { notIn: realLinks }
    }
  })
  console.log('Cleaned up dummy repos resources.')

  console.log('Cleanup finished.')
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
