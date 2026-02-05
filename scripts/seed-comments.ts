import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USER_ID = '133cf534-9b96-4196-8e45-a8da79dfebae';

const commentTexts = [
  '这篇文章写得非常好，学到了很多！',
  '感谢分享，正是我需要的内容。',
  '请问这个方法在生产环境中稳定吗？',
  '我也遇到过类似的问题，你的解决方案很棒。',
  '能否详细解释一下这个步骤？',
  '收藏了，以后会经常回来看。',
  '这个技术栈的选择很合理。',
  '有没有相关的代码示例可以参考？',
  '我在项目中应用了这个方法，效果很好。',
  '期待你的下一篇文章！',
  'Great article! Very helpful.',
  'This solved my problem, thanks!',
  'Could you elaborate more on this topic?',
  'I have a similar setup, works perfectly.',
  'Bookmarked for future reference.',
];

const replyTexts = [
  '同意你的观点！',
  '我也是这么想的。',
  '谢谢回复！',
  '这个补充很有价值。',
  '学习了，感谢！',
  '确实如此。',
  'Good point!',
  'Thanks for the insight.',
  'I agree with this.',
  'Very helpful reply!',
];

async function main() {
  // Get the first article to add comments to
  const article = await prisma.article.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  if (!article) {
    console.error('No article found!');
    return;
  }

  console.log(`Adding comments to article: ${article.title}`);

  // Delete existing comments for clean test
  await prisma.comment.deleteMany({
    where: { articleId: article.id }
  });

  const createdComments: string[] = [];
  let totalCount = 0;

  // Create 20 root comments
  for (let i = 0; i < 20; i++) {
    const comment = await prisma.comment.create({
      data: {
        content: commentTexts[i % commentTexts.length],
        articleId: article.id,
        userId: USER_ID,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
      }
    });
    createdComments.push(comment.id);
    totalCount++;
    console.log(`Created root comment ${i + 1}/20`);
  }

  // Create replies (80 remaining to reach 100)
  let repliesCreated = 0;
  const targetReplies = 80;

  while (repliesCreated < targetReplies) {
    // Randomly select a comment to reply to
    const parentId = createdComments[Math.floor(Math.random() * createdComments.length)];
    
    const reply = await prisma.comment.create({
      data: {
        content: replyTexts[repliesCreated % replyTexts.length],
        articleId: article.id,
        userId: USER_ID,
        parentId: parentId,
        createdAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000), // Random time in last 3 days
      }
    });
    
    createdComments.push(reply.id);
    repliesCreated++;
    totalCount++;
    
    if (repliesCreated % 10 === 0) {
      console.log(`Created ${repliesCreated}/${targetReplies} replies`);
    }
  }

  console.log(`\n✅ Successfully created ${totalCount} comments/replies!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
