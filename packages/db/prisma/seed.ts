import { PrismaClient, UserRole, SessionVisibility } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.comment.deleteMany({})
  await prisma.sessionResource.deleteMany({})
  await prisma.sessionParticipant.deleteMany({})
  await prisma.scripturePassage.deleteMany({})
  await prisma.chatMessage.deleteMany({})
  await prisma.joinRequest.deleteMany({})
  await prisma.notification.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.series.deleteMany({})
  await prisma.user.deleteMany({})
  console.log('✅ Cleared existing data')

  // Create test users
  const leader = await prisma.user.create({
    data: {
      email: 'leader@example.com',
      name: 'Pastor David',
      password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC', // password: "password"
      role: UserRole.LEADER,
    },
  })

  const member1 = await prisma.user.create({
    data: {
      email: 'member1@example.com',
      name: 'Sarah Johnson',
      password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC',
      role: UserRole.MEMBER,
    },
  })

  const member2 = await prisma.user.create({
    data: {
      email: 'member2@example.com',
      name: 'Michael Chen',
      password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC',
      role: UserRole.MEMBER,
    },
  })

  console.log('✅ Created test users')

  // Create Series
  const gospelOfJohn = await prisma.series.create({
    data: {
      title: 'Gospel of John: Believe and Have Life',
      description: 'A deep dive into the Gospel of John, exploring the identity of Jesus as the Son of God and the path to eternal life.',
      imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400',
      leaderId: leader.id,
    },
  })

  const romans = await prisma.series.create({
    data: {
      title: 'Romans: The Gospel Explained',
      description: 'Understanding Paul\'s systematic presentation of the gospel, grace, and Christian living.',
      imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400',
      leaderId: leader.id,
    },
  })

  const genesis = await prisma.series.create({
    data: {
      title: 'Genesis: In the Beginning',
      description: 'Exploring the foundations of faith through the book of beginnings.',
      imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
      leaderId: leader.id,
    },
  })

  const psalms = await prisma.series.create({
    data: {
      title: 'Psalms of Praise and Lament',
      description: 'Learning to pray through the Psalms in times of joy and sorrow.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      leaderId: leader.id,
    },
  })

  const wisdom = await prisma.series.create({
    data: {
      title: 'Wisdom Literature: Living Skillfully',
      description: 'Practical wisdom from Proverbs, Ecclesiastes, and James for daily living.',
      imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400',
      leaderId: leader.id,
    },
  })

  const prophets = await prisma.series.create({
    data: {
      title: 'Major Prophets: God\'s Messengers',
      description: 'Understanding God\'s heart through Isaiah, Jeremiah, and Daniel.',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
      leaderId: leader.id,
    },
  })

  console.log('✅ Created series')

  const today = new Date()
  const getDate = (daysFromNow: number) => {
    const date = new Date(today)
    date.setDate(date.getDate() + daysFromNow)
    return date
  }

  // Gospel of John Sessions (8 sessions)
  const johnSessions = [
    {
      title: 'The Word Became Flesh',
      description: 'Understanding the prologue and the incarnation of Christ.',
      passages: [
        { book: 'John', chapter: 1, verseStart: 1, verseEnd: 18, note: 'Notice the parallels to Genesis 1. How does John present Jesus as both fully God and fully human?' }
      ],
      day: 0
    },
    {
      title: 'The First Disciples and First Miracle',
      description: 'Jesus calls His first followers and reveals His glory at Cana.',
      passages: [
        { book: 'John', chapter: 1, verseStart: 35, verseEnd: 51, note: 'What does it mean that Jesus is the Lamb of God?' },
        { book: 'John', chapter: 2, verseStart: 1, verseEnd: 11, note: 'How does this miracle reveal Jesus\' glory?' }
      ],
      day: 7
    },
    {
      title: 'You Must Be Born Again',
      description: 'Jesus teaches Nicodemus about spiritual rebirth.',
      passages: [
        { book: 'John', chapter: 3, verseStart: 1, verseEnd: 21, note: 'What does it mean to be born again? How does this relate to verse 16?' }
      ],
      day: 14
    },
    {
      title: 'The Samaritan Woman',
      description: 'Jesus offers living water to an outcast woman.',
      passages: [
        { book: 'John', chapter: 4, verseStart: 1, verseEnd: 42, note: 'Notice how Jesus breaks social barriers. What is living water?' }
      ],
      day: 21
    },
    {
      title: 'I Am the Bread of Life',
      description: 'Jesus reveals Himself as the bread that gives eternal life.',
      passages: [
        { book: 'John', chapter: 6, verseStart: 25, verseEnd: 59, note: 'This is the first of seven "I AM" statements. What does it mean that Jesus is the bread of life?' }
      ],
      day: 28
    },
    {
      title: 'I Am the Light of the World',
      description: 'Jesus claims to be the light that overcomes darkness.',
      passages: [
        { book: 'John', chapter: 8, verseStart: 12, verseEnd: 30, note: 'How does light imagery connect to John 1? What does it mean to walk in darkness vs light?' }
      ],
      day: 35
    },
    {
      title: 'I Am the Good Shepherd',
      description: 'Jesus describes His relationship with His sheep.',
      passages: [
        { book: 'John', chapter: 10, verseStart: 1, verseEnd: 21, note: 'Compare this to Psalm 23. What makes Jesus the "good" shepherd?' }
      ],
      day: 42
    },
    {
      title: 'I Am the Resurrection and the Life',
      description: 'Jesus raises Lazarus and declares victory over death.',
      passages: [
        { book: 'John', chapter: 11, verseStart: 1, verseEnd: 44, note: 'Notice Jesus\' emotions in this passage. What does this miracle teach about faith?' }
      ],
      day: 49
    },
  ]

  for (const sessionData of johnSessions) {
    await prisma.session.create({
      data: {
        title: sessionData.title,
        description: sessionData.description,
        startDate: getDate(sessionData.day),
        endDate: getDate(sessionData.day + 7),
        leaderId: leader.id,
        seriesId: gospelOfJohn.id,
        visibility: SessionVisibility.PUBLIC,
        scripturePassages: {
          create: sessionData.passages.map((p, i) => ({
            ...p,
            content: '',
            order: i,
          })),
        },
      },
    })
  }

  console.log('✅ Created Gospel of John sessions')

  // Romans Sessions (6 sessions)
  const romansSessions = [
    {
      title: 'The Power of the Gospel',
      description: 'Paul introduces his letter and the theme of righteousness through faith.',
      passages: [
        { book: 'Romans', chapter: 1, verseStart: 1, verseEnd: 17, note: 'What is the gospel? Why is Paul not ashamed of it?' }
      ],
      day: 56
    },
    {
      title: 'All Have Sinned',
      description: 'Understanding universal sinfulness and God\'s judgment.',
      passages: [
        { book: 'Romans', chapter: 3, verseStart: 9, verseEnd: 31, note: 'How does Paul prove that all have sinned? What is the solution?' }
      ],
      day: 63
    },
    {
      title: 'Justified by Faith',
      description: 'Abraham as the example of justification through faith.',
      passages: [
        { book: 'Romans', chapter: 4, verseStart: 1, verseEnd: 25, note: 'How was Abraham justified? What does this teach us about faith?' }
      ],
      day: 70
    },
    {
      title: 'Peace with God',
      description: 'The blessings of justification and hope through Christ.',
      passages: [
        { book: 'Romans', chapter: 5, verseStart: 1, verseEnd: 21, note: 'List the benefits of justification. How does Adam compare to Christ?' }
      ],
      day: 77
    },
    {
      title: 'Dead to Sin, Alive in Christ',
      description: 'Understanding our union with Christ in His death and resurrection.',
      passages: [
        { book: 'Romans', chapter: 6, verseStart: 1, verseEnd: 23, note: 'What does it mean to be dead to sin? How should this affect our daily lives?' }
      ],
      day: 84
    },
    {
      title: 'Life in the Spirit',
      description: 'The Spirit\'s role in the Christian life and assurance of salvation.',
      passages: [
        { book: 'Romans', chapter: 8, verseStart: 1, verseEnd: 39, note: 'This is one of the greatest chapters in the Bible. What assurances does it give?' }
      ],
      day: 91
    },
  ]

  for (const sessionData of romansSessions) {
    await prisma.session.create({
      data: {
        title: sessionData.title,
        description: sessionData.description,
        startDate: getDate(sessionData.day),
        endDate: getDate(sessionData.day + 7),
        leaderId: leader.id,
        seriesId: romans.id,
        visibility: SessionVisibility.PUBLIC,
        scripturePassages: {
          create: sessionData.passages.map((p, i) => ({
            ...p,
            content: '',
            order: i,
          })),
        },
      },
    })
  }

  console.log('✅ Created Romans sessions')

  // Genesis Sessions (5 sessions)
  const genesisSessions = [
    {
      title: 'In the Beginning God Created',
      description: 'The creation account and God\'s design for the world.',
      passages: [
        { book: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 31, note: 'Notice the pattern: God speaks and it happens. What does this teach about God\'s power?' },
        { book: 'Genesis', chapter: 2, verseStart: 1, verseEnd: 25, note: 'How does chapter 2 complement chapter 1? What is humanity\'s unique role?' }
      ],
      day: 98
    },
    {
      title: 'The Fall and the Promise',
      description: 'Sin enters the world, but God provides a promise of redemption.',
      passages: [
        { book: 'Genesis', chapter: 3, verseStart: 1, verseEnd: 24, note: 'What are the consequences of sin? Where do you see grace in this chapter?' }
      ],
      day: 105
    },
    {
      title: 'Noah and the Flood',
      description: 'God\'s judgment and salvation through the ark.',
      passages: [
        { book: 'Genesis', chapter: 6, verseStart: 5, verseEnd: 22, note: 'What does it mean that Noah found favor with God?' },
        { book: 'Genesis', chapter: 9, verseStart: 1, verseEnd: 17, note: 'God makes a covenant with Noah. What does this teach about God\'s character?' }
      ],
      day: 112
    },
    {
      title: 'The Call of Abraham',
      description: 'God calls Abram and makes a covenant with him.',
      passages: [
        { book: 'Genesis', chapter: 12, verseStart: 1, verseEnd: 9, note: 'God\'s promise has three parts: land, descendants, and blessing. How is this fulfilled?' }
      ],
      day: 119
    },
    {
      title: 'Joseph: From Pit to Palace',
      description: 'God\'s sovereignty in Joseph\'s life and the preservation of His people.',
      passages: [
        { book: 'Genesis', chapter: 50, verseStart: 15, verseEnd: 26, note: 'What does Joseph mean in verse 20? How does God use evil for good?' }
      ],
      day: 126
    },
  ]

  for (const sessionData of genesisSessions) {
    await prisma.session.create({
      data: {
        title: sessionData.title,
        description: sessionData.description,
        startDate: getDate(sessionData.day),
        endDate: getDate(sessionData.day + 7),
        leaderId: leader.id,
        seriesId: genesis.id,
        visibility: SessionVisibility.PUBLIC,
        scripturePassages: {
          create: sessionData.passages.map((p, i) => ({
            ...p,
            content: '',
            order: i,
          })),
        },
      },
    })
  }

  console.log('✅ Created Genesis sessions')

  // Psalms Sessions (4 sessions)
  const psalmsSessions = [
    {
      title: 'The Lord is My Shepherd',
      description: 'Finding comfort and guidance in God\'s care.',
      passages: [
        { book: 'Psalm', chapter: 23, verseStart: 1, verseEnd: 6, note: 'This is the most famous psalm. What imagery does David use to describe God\'s care?' }
      ],
      day: 133
    },
    {
      title: 'Create in Me a Clean Heart',
      description: 'David\'s prayer of repentance after his sin with Bathsheba.',
      passages: [
        { book: 'Psalm', chapter: 51, verseStart: 1, verseEnd: 19, note: 'This is a model prayer of repentance. What does David ask for? What does he promise?' }
      ],
      day: 140
    },
    {
      title: 'The Majesty of God',
      description: 'Praising God for His creation and care for humanity.',
      passages: [
        { book: 'Psalm', chapter: 8, verseStart: 1, verseEnd: 9, note: 'How does David contrast God\'s majesty with humanity\'s insignificance? What is humanity\'s role?' }
      ],
      day: 147
    },
    {
      title: 'Waiting on the Lord',
      description: 'Learning patience and trust during difficult times.',
      passages: [
        { book: 'Psalm', chapter: 27, verseStart: 1, verseEnd: 14, note: 'What does it mean to wait on the Lord? How can we apply this today?' }
      ],
      day: 154
    },
  ]

  for (const sessionData of psalmsSessions) {
    await prisma.session.create({
      data: {
        title: sessionData.title,
        description: sessionData.description,
        startDate: getDate(sessionData.day),
        endDate: getDate(sessionData.day + 7),
        leaderId: leader.id,
        seriesId: psalms.id,
        visibility: SessionVisibility.PUBLIC,
        scripturePassages: {
          create: sessionData.passages.map((p, i) => ({
            ...p,
            content: '',
            order: i,
          })),
        },
      },
    })
  }

  console.log('✅ Created Psalms sessions')

  // Wisdom Literature Sessions (4 sessions)
  const wisdomSessions = [
    {
      title: 'The Fear of the Lord',
      description: 'Understanding the beginning of wisdom.',
      passages: [
        { book: 'Proverbs', chapter: 1, verseStart: 1, verseEnd: 7, note: 'What does it mean to fear the Lord? How is this the beginning of knowledge?' },
        { book: 'Proverbs', chapter: 9, verseStart: 10, verseEnd: 12, note: 'The fear of the Lord appears again. Why is this so important?' }
      ],
      day: 161
    },
    {
      title: 'The Power of Words',
      description: 'Proverbs on the tongue and its impact.',
      passages: [
        { book: 'Proverbs', chapter: 18, verseStart: 21, verseEnd: 21, note: 'How can the tongue bring life or death?' },
        { book: 'James', chapter: 3, verseStart: 1, verseEnd: 12, note: 'James builds on Proverbs. How can we tame our tongue?' }
      ],
      day: 168
    },
    {
      title: 'Everything is Meaningless?',
      description: 'Ecclesiastes and the search for meaning.',
      passages: [
        { book: 'Ecclesiastes', chapter: 1, verseStart: 1, verseEnd: 11, note: 'What is the Teacher\'s problem? How does life under the sun feel meaningless?' },
        { book: 'Ecclesiastes', chapter: 12, verseStart: 9, verseEnd: 14, note: 'How does the Teacher conclude? What gives life meaning?' }
      ],
      day: 175
    },
    {
      title: 'Faith and Works',
      description: 'James on genuine faith that produces action.',
      passages: [
        { book: 'James', chapter: 2, verseStart: 14, verseEnd: 26, note: 'Can faith exist without works? How does James define genuine faith?' }
      ],
      day: 182
    },
  ]

  for (const sessionData of wisdomSessions) {
    await prisma.session.create({
      data: {
        title: sessionData.title,
        description: sessionData.description,
        startDate: getDate(sessionData.day),
        endDate: getDate(sessionData.day + 7),
        leaderId: leader.id,
        seriesId: wisdom.id,
        visibility: SessionVisibility.PUBLIC,
        scripturePassages: {
          create: sessionData.passages.map((p, i) => ({
            ...p,
            content: '',
            order: i,
          })),
        },
      },
    })
  }

  console.log('✅ Created Wisdom Literature sessions')

  // Major Prophets Sessions (3 sessions)
  const prophetsSessions = [
    {
      title: 'Here Am I, Send Me',
      description: 'Isaiah\'s call and vision of God\'s holiness.',
      passages: [
        { book: 'Isaiah', chapter: 6, verseStart: 1, verseEnd: 13, note: 'How does Isaiah respond to God\'s holiness? What is his mission?' }
      ],
      day: 189
    },
    {
      title: 'The Suffering Servant',
      description: 'Isaiah\'s prophecy of the Messiah who would bear our sins.',
      passages: [
        { book: 'Isaiah', chapter: 53, verseStart: 1, verseEnd: 12, note: 'This prophecy was written 700 years before Christ. How was it fulfilled in Jesus?' }
      ],
      day: 196
    },
    {
      title: 'Daniel in the Lions\' Den',
      description: 'Faithfulness to God despite persecution.',
      passages: [
        { book: 'Daniel', chapter: 6, verseStart: 1, verseEnd: 28, note: 'What can we learn from Daniel\'s courage and faith? How does God deliver him?' }
      ],
      day: 203
    },
  ]

  for (const sessionData of prophetsSessions) {
    await prisma.session.create({
      data: {
        title: sessionData.title,
        description: sessionData.description,
        startDate: getDate(sessionData.day),
        endDate: getDate(sessionData.day + 7),
        leaderId: leader.id,
        seriesId: prophets.id,
        visibility: SessionVisibility.PUBLIC,
        scripturePassages: {
          create: sessionData.passages.map((p, i) => ({
            ...p,
            content: '',
            order: i,
          })),
        },
      },
    })
  }

  console.log('✅ Created Major Prophets sessions')

  console.log('🎉 Chancel database seeded successfully with 30 sessions!')
  console.log('\n📖 Sacred space. Shared study.')
  console.log('\nTest Credentials:')
  console.log('Leader: leader@example.com / password')
  console.log('Member 1: member1@example.com / password')
  console.log('Member 2: member2@example.com / password')
  console.log('\nSeries Created:')
  console.log('- Gospel of John (8 sessions)')
  console.log('- Romans (6 sessions)')
  console.log('- Genesis (5 sessions)')
  console.log('- Psalms (4 sessions)')
  console.log('- Wisdom Literature (4 sessions)')
  console.log('- Major Prophets (3 sessions)')
  console.log('Total: 30 sessions')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
