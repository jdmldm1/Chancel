import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create test users
  const leader = await prisma.user.upsert({
    where: { email: 'leader@example.com' },
    update: {
      password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC', // password: "password"
    },
    create: {
      email: 'leader@example.com',
      name: 'Study Leader',
      password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC', // password: "password"
      role: UserRole.LEADER,
    },
  })

  const member1 = await prisma.user.upsert({
    where: { email: 'member1@example.com' },
    update: {
      password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC', // password: "password"
    },
    create: {
      email: 'member1@example.com',
      name: 'John Doe',
      password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC', // password: "password"
      role: UserRole.MEMBER,
    },
  })

  const member2 = await prisma.user.upsert({
    where: { email: 'member2@example.com' },
    update: {
      password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC', // password: "password"
    },
    create: {
      email: 'member2@example.com',
      name: 'Jane Smith',
      password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC', // password: "password"
      role: UserRole.MEMBER,
    },
  })

  console.log('✅ Created test users')

  // Create a test study session
  const session = await prisma.session.create({
    data: {
      title: 'Introduction to the Gospel of John',
      description: 'Exploring the prologue of John and understanding the Word becoming flesh.',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      leaderId: leader.id,
    },
  })

  console.log('✅ Created test session')

  // Add scripture passages
  const passage1 = await prisma.scripturePassage.create({
    data: {
      sessionId: session.id,
      book: 'John',
      chapter: 1,
      verseStart: 1,
      verseEnd: 5,
      content: 'In the beginning was the Word, and the Word was with God, and the Word was God. He was with God in the beginning. Through him all things were made; without him nothing was made that has been made. In him was life, and that life was the light of all mankind. The light shines in the darkness, and the darkness has not overcome it.',
      order: 0,
    },
  })

  const passage2 = await prisma.scripturePassage.create({
    data: {
      sessionId: session.id,
      book: 'John',
      chapter: 1,
      verseStart: 14,
      verseEnd: 14,
      content: 'The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.',
      order: 1,
    },
  })

  console.log('✅ Created scripture passages')

  // Add session participants
  await prisma.sessionParticipant.createMany({
    data: [
      {
        sessionId: session.id,
        userId: member1.id,
        role: UserRole.MEMBER,
      },
      {
        sessionId: session.id,
        userId: member2.id,
        role: UserRole.MEMBER,
      },
    ],
  })

  console.log('✅ Added session participants')

  // Add sample comments
  const comment1 = await prisma.comment.create({
    data: {
      passageId: passage1.id,
      sessionId: session.id,
      userId: member1.id,
      content: 'This passage really emphasizes the divine nature of Christ. The parallel to Genesis 1:1 is striking!',
    },
  })

  await prisma.comment.create({
    data: {
      passageId: passage1.id,
      sessionId: session.id,
      userId: member2.id,
      content: 'Great observation! I also notice how John uses "light" as a metaphor throughout his gospel.',
      parentId: comment1.id, // This is a reply to comment1
    },
  })

  await prisma.comment.create({
    data: {
      passageId: passage2.id,
      sessionId: session.id,
      userId: leader.id,
      content: 'The incarnation is central to Christian theology. What does it mean that God "dwelt among us"?',
    },
  })

  console.log('✅ Created sample comments')

  // Add a sample resource
  await prisma.sessionResource.create({
    data: {
      sessionId: session.id,
      fileName: 'john-study-guide.pdf',
      fileUrl: '/uploads/john-study-guide.pdf',
      fileType: 'application/pdf',
      uploadedBy: leader.id,
      description: 'Comprehensive study guide for the Gospel of John',
    },
  })

  console.log('✅ Created session resource')

  console.log('🎉 Database seeded successfully!')
  console.log('\nTest Credentials:')
  console.log('Leader: leader@example.com / password')
  console.log('Member 1: member1@example.com / password')
  console.log('Member 2: member2@example.com / password')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
