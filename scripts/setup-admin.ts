import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as readline from 'readline'

const prisma = new PrismaClient()

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => rl.question(query, ans => {
    rl.close()
    resolve(ans)
  }))
}

async function main() {
  console.log('\n=== 管理员账户设置 ===\n')

  const email = await askQuestion('请输入管理员邮箱: ')
  
  if (!email || !email.includes('@')) {
    console.error('错误：请输入有效的邮箱地址')
    process.exit(1)
  }

  const username = await askQuestion('请输入管理员用户名: ')
  
  if (!username) {
    console.error('错误：用户名不能为空')
    process.exit(1)
  }

  const password = await askQuestion('请输入管理员密码（至少6位）: ')
  
  if (!password || password.length < 6) {
    console.error('错误：密码至少需要6位字符')
    process.exit(1)
  }

  const confirmPassword = await askQuestion('请再次输入密码确认: ')
  
  if (password !== confirmPassword) {
    console.error('错误：两次输入的密码不一致')
    process.exit(1)
  }

  console.log('\n正在创建管理员账户...')
  
  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      username,
      passwordHash: hashedPassword,
    },
    create: {
      email,
      username,
      passwordHash: hashedPassword,
      role: 'admin'
    }
  })

  console.log('\n✅ 管理员账户创建成功！')
  console.log(`   邮箱: ${email}`)
  console.log(`   用户名: ${username}`)
  console.log('\n请妥善保管您的登录凭证，密码已加密存储。')
  console.log(`\n您可以访问 https://www.cbiu.fun/login 进行登录。\n`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('错误:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
