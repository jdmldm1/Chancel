import { PrismaClient, UserRole, SessionVisibility } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

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
  await prisma.group.deleteMany({})
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

  const bibleRecap = await prisma.series.create({
    data: {
      title: 'The Bible Recap: Year-Long Journey',
      description: 'Read through the entire Bible in chronological order with daily recaps and study notes. Based on The Bible Recap reading plan.',
      imageUrl: 'https://www.bible.com/_next/image?url=https%3A%2F%2Fimageproxy.youversionapi.com%2Fhttps%3A%2F%2Fs3.amazonaws.com%2Fyvplans%2F17553%2F1280x720.jpg&w=3840&q=75',
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
      title: 'The Word Became Flesh (Current)',
      description: 'Understanding the prologue and the incarnation of Christ.',
      passages: [
        { book: 'John', chapter: 1, verseStart: 1, verseEnd: 18, note: 'Notice the parallels to Genesis 1. How does John present Jesus as both fully God and fully human?' }
      ],
      startDate: getDate(-2),
      endDate: getDate(2)
    },
    {
      title: 'The First Disciples and First Miracle (Past)',
      description: 'Jesus calls His first followers and reveals His glory at Cana.',
      passages: [
        { book: 'John', chapter: 1, verseStart: 35, verseEnd: 51, note: 'What does it mean that Jesus is the Lamb of God?' },
        { book: 'John', chapter: 2, verseStart: 1, verseEnd: 11, note: "How does this miracle reveal Jesus' glory?" }
      ],
      startDate: getDate(-10),
      endDate: getDate(-8)
    },
    {
      title: 'You Must Be Born Again (Future)',
      description: 'Jesus teaches Nicodemus about spiritual rebirth.',
      passages: [
        { book: 'John', chapter: 3, verseStart: 1, verseEnd: 21, note: 'What does it mean to be born again? How does this relate to verse 16?' }
      ],
      startDate: getDate(8),
      endDate: getDate(10)
    },
  ]

  for (const sessionData of johnSessions) {
    await prisma.session.create({
      data: {
        title: sessionData.title,
        description: sessionData.description,
        startDate: sessionData.startDate,
        endDate: sessionData.endDate,
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

  // The Bible Recap Sessions (30 sessions - first month)
  const bibleRecapReadings = [
    { day: 1, title: 'Day 1: In the Beginning', passages: [{ book: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 31, note: 'God creates everything good. Notice the pattern and purpose in creation.' }, { book: 'Genesis', chapter: 2, verseStart: 1, verseEnd: 25, note: 'A closer look at humanity\'s creation and purpose.' }, { book: 'Genesis', chapter: 3, verseStart: 1, verseEnd: 24, note: 'The fall changes everything. How does sin affect relationships?' }] },
    { day: 2, title: 'Day 2: Sin Spreads', passages: [{ book: 'Genesis', chapter: 4, verseStart: 1, verseEnd: 26, note: 'Cain and Abel - the first murder' }, { book: 'Genesis', chapter: 5, verseStart: 1, verseEnd: 32, note: 'Genealogy from Adam to Noah' }, { book: 'Genesis', chapter: 6, verseStart: 1, verseEnd: 22, note: 'God\'s grief over sin and Noah\'s obedience' }, { book: 'Genesis', chapter: 7, verseStart: 1, verseEnd: 24, note: 'The flood comes' }] },
    { day: 3, title: 'Day 3: God\'s Covenant with Noah', passages: [{ book: 'Genesis', chapter: 8, verseStart: 1, verseEnd: 22, note: 'The waters recede' }, { book: 'Genesis', chapter: 9, verseStart: 1, verseEnd: 29, note: 'God\'s covenant and the rainbow' }, { book: 'Genesis', chapter: 10, verseStart: 1, verseEnd: 32, note: 'Table of nations' }, { book: 'Genesis', chapter: 11, verseStart: 1, verseEnd: 32, note: 'Tower of Babel and Abram\'s family' }] },
    { day: 4, title: 'Day 4: Job\'s Suffering Begins', passages: [{ book: 'Job', chapter: 1, verseStart: 1, verseEnd: 22, note: 'Job loses everything but doesn\'t curse God' }, { book: 'Job', chapter: 2, verseStart: 1, verseEnd: 13, note: 'Physical suffering and friends arrive' }, { book: 'Job', chapter: 3, verseStart: 1, verseEnd: 26, note: 'Job\'s lament' }] },
    { day: 5, title: 'Day 5: Job and His Friends Debate', passages: [{ book: 'Job', chapter: 6, verseStart: 1, verseEnd: 30, note: 'Job responds to Eliphaz' }, { book: 'Job', chapter: 7, verseStart: 1, verseEnd: 21, note: 'Job\'s complaint to God' }, { book: 'Job', chapter: 8, verseStart: 1, verseEnd: 22, note: 'Bildad speaks' }, { book: 'Job', chapter: 9, verseStart: 1, verseEnd: 35, note: 'Job responds - God\'s power and justice' }] },
    { day: 6, title: 'Day 6: The Debate Continues', passages: [{ book: 'Job', chapter: 10, verseStart: 1, verseEnd: 22, note: 'Job questions God\'s purposes' }, { book: 'Job', chapter: 11, verseStart: 1, verseEnd: 20, note: 'Zophar accuses Job' }, { book: 'Job', chapter: 12, verseStart: 1, verseEnd: 25, note: 'Job defends his wisdom' }, { book: 'Job', chapter: 13, verseStart: 1, verseEnd: 28, note: 'Job desires to argue his case with God' }] },
    { day: 7, title: 'Day 7: Life, Death, and Hope', passages: [{ book: 'Job', chapter: 14, verseStart: 1, verseEnd: 22, note: 'Meditation on mortality and hope' }, { book: 'Job', chapter: 15, verseStart: 1, verseEnd: 35, note: 'Eliphaz\'s second speech' }, { book: 'Job', chapter: 16, verseStart: 1, verseEnd: 22, note: 'Job\'s response - miserable comforters' }] },
    { day: 8, title: 'Day 8: Job\'s Hope in His Redeemer', passages: [{ book: 'Job', chapter: 17, verseStart: 1, verseEnd: 16, note: 'Job\'s spirit is broken' }, { book: 'Job', chapter: 18, verseStart: 1, verseEnd: 21, note: 'Bildad\'s second speech' }, { book: 'Job', chapter: 19, verseStart: 1, verseEnd: 29, note: 'I know my Redeemer lives!' }, { book: 'Job', chapter: 20, verseStart: 1, verseEnd: 29, note: 'Zophar\'s second speech' }] },
    { day: 9, title: 'Day 9: Why Do the Wicked Prosper?', passages: [{ book: 'Job', chapter: 21, verseStart: 1, verseEnd: 34, note: 'Job\'s response about the wicked' }, { book: 'Job', chapter: 22, verseStart: 1, verseEnd: 30, note: 'Eliphaz\'s third speech' }, { book: 'Job', chapter: 23, verseStart: 1, verseEnd: 17, note: 'Job longs to find God' }] },
    { day: 10, title: 'Day 10: Where Can Wisdom Be Found?', passages: [{ book: 'Job', chapter: 24, verseStart: 1, verseEnd: 25, note: 'God seems distant from injustice' }, { book: 'Job', chapter: 25, verseStart: 1, verseEnd: 6, note: 'Bildad\'s third speech' }, { book: 'Job', chapter: 26, verseStart: 1, verseEnd: 14, note: 'Job\'s response about God\'s power' }, { book: 'Job', chapter: 27, verseStart: 1, verseEnd: 23, note: 'Job maintains his integrity' }, { book: 'Job', chapter: 28, verseStart: 1, verseEnd: 28, note: 'The source of wisdom' }] },
    { day: 11, title: 'Day 11: Job Remembers Better Days', passages: [{ book: 'Job', chapter: 29, verseStart: 1, verseEnd: 25, note: 'Job\'s former blessings' }, { book: 'Job', chapter: 30, verseStart: 1, verseEnd: 31, note: 'Job\'s current suffering' }, { book: 'Job', chapter: 31, verseStart: 1, verseEnd: 40, note: 'Job\'s final defense' }] },
    { day: 12, title: 'Day 12: Elihu Speaks', passages: [{ book: 'Job', chapter: 32, verseStart: 1, verseEnd: 22, note: 'Elihu\'s introduction' }, { book: 'Job', chapter: 33, verseStart: 1, verseEnd: 33, note: 'Elihu\'s first speech to Job' }, { book: 'Job', chapter: 34, verseStart: 1, verseEnd: 37, note: 'God cannot do wrong' }] },
    { day: 13, title: 'Day 13: God\'s Justice Defended', passages: [{ book: 'Job', chapter: 35, verseStart: 1, verseEnd: 16, note: 'Elihu continues about God\'s justice' }, { book: 'Job', chapter: 36, verseStart: 1, verseEnd: 33, note: 'God is mighty and just' }, { book: 'Job', chapter: 37, verseStart: 1, verseEnd: 24, note: 'God\'s power in nature' }] },
    { day: 14, title: 'Day 14: The Lord Answers Job', passages: [{ book: 'Job', chapter: 38, verseStart: 1, verseEnd: 41, note: 'God speaks from the whirlwind' }, { book: 'Job', chapter: 39, verseStart: 1, verseEnd: 30, note: 'God\'s questions about creation continue' }] },
    { day: 15, title: 'Day 15: Job\'s Restoration', passages: [{ book: 'Job', chapter: 40, verseStart: 1, verseEnd: 24, note: 'Job humbles himself; Behemoth' }, { book: 'Job', chapter: 41, verseStart: 1, verseEnd: 34, note: 'Leviathan and God\'s power' }, { book: 'Job', chapter: 42, verseStart: 1, verseEnd: 17, note: 'Job repents and is restored' }] },
    { day: 16, title: 'Day 16: The Call of Abram', passages: [{ book: 'Genesis', chapter: 12, verseStart: 1, verseEnd: 20, note: 'God calls Abram to leave his homeland' }, { book: 'Genesis', chapter: 13, verseStart: 1, verseEnd: 18, note: 'Abram and Lot separate' }, { book: 'Genesis', chapter: 14, verseStart: 1, verseEnd: 24, note: 'Abram rescues Lot' }, { book: 'Genesis', chapter: 15, verseStart: 1, verseEnd: 21, note: 'God\'s covenant with Abram' }] },
    { day: 17, title: 'Day 17: Hagar and Ishmael', passages: [{ book: 'Genesis', chapter: 16, verseStart: 1, verseEnd: 16, note: 'Hagar and Ishmael' }, { book: 'Genesis', chapter: 17, verseStart: 1, verseEnd: 27, note: 'Covenant of circumcision' }, { book: 'Genesis', chapter: 18, verseStart: 1, verseEnd: 33, note: 'Three visitors and Sodom\'s fate' }] },
    { day: 18, title: 'Day 18: Sodom and Gomorrah', passages: [{ book: 'Genesis', chapter: 19, verseStart: 1, verseEnd: 38, note: 'Destruction of Sodom' }, { book: 'Genesis', chapter: 20, verseStart: 1, verseEnd: 18, note: 'Abraham and Abimelech' }, { book: 'Genesis', chapter: 21, verseStart: 1, verseEnd: 34, note: 'Isaac is born' }] },
    { day: 19, title: 'Day 19: The Ultimate Test', passages: [{ book: 'Genesis', chapter: 22, verseStart: 1, verseEnd: 24, note: 'Abraham tested - offering of Isaac' }, { book: 'Genesis', chapter: 23, verseStart: 1, verseEnd: 20, note: 'Sarah\'s death' }, { book: 'Genesis', chapter: 24, verseStart: 1, verseEnd: 67, note: 'Finding a wife for Isaac' }] },
    { day: 20, title: 'Day 20: Jacob and Esau', passages: [{ book: 'Genesis', chapter: 25, verseStart: 1, verseEnd: 34, note: 'Abraham\'s death; Jacob and Esau born' }, { book: 'Genesis', chapter: 26, verseStart: 1, verseEnd: 35, note: 'Isaac and Abimelech' }] },
    { day: 21, title: 'Day 21: The Stolen Blessing', passages: [{ book: 'Genesis', chapter: 27, verseStart: 1, verseEnd: 46, note: 'Jacob deceives Isaac' }, { book: 'Genesis', chapter: 28, verseStart: 1, verseEnd: 22, note: 'Jacob\'s ladder' }, { book: 'Genesis', chapter: 29, verseStart: 1, verseEnd: 35, note: 'Jacob marries Leah and Rachel' }] },
    { day: 22, title: 'Day 22: Jacob\'s Family Grows', passages: [{ book: 'Genesis', chapter: 30, verseStart: 1, verseEnd: 43, note: 'More children born to Jacob' }, { book: 'Genesis', chapter: 31, verseStart: 1, verseEnd: 55, note: 'Jacob flees from Laban' }] },
    { day: 23, title: 'Day 23: Wrestling with God', passages: [{ book: 'Genesis', chapter: 32, verseStart: 1, verseEnd: 32, note: 'Jacob wrestles with God' }, { book: 'Genesis', chapter: 33, verseStart: 1, verseEnd: 20, note: 'Jacob meets Esau' }, { book: 'Genesis', chapter: 34, verseStart: 1, verseEnd: 31, note: 'Dinah and Shechem' }] },
    { day: 24, title: 'Day 24: Return to Bethel', passages: [{ book: 'Genesis', chapter: 35, verseStart: 1, verseEnd: 29, note: 'Return to Bethel; Rachel dies' }, { book: 'Genesis', chapter: 36, verseStart: 1, verseEnd: 43, note: 'Esau\'s descendants' }, { book: 'Genesis', chapter: 37, verseStart: 1, verseEnd: 36, note: 'Joseph\'s dreams; sold into slavery' }] },
    { day: 25, title: 'Day 25: Joseph in Egypt', passages: [{ book: 'Genesis', chapter: 38, verseStart: 1, verseEnd: 30, note: 'Judah and Tamar' }, { book: 'Genesis', chapter: 39, verseStart: 1, verseEnd: 23, note: 'Joseph and Potiphar\'s wife' }, { book: 'Genesis', chapter: 40, verseStart: 1, verseEnd: 23, note: 'Joseph interprets dreams in prison' }] },
    { day: 26, title: 'Day 26: Pharaoh\'s Dreams', passages: [{ book: 'Genesis', chapter: 41, verseStart: 1, verseEnd: 57, note: 'Joseph interprets Pharaoh\'s dreams and rises to power' }, { book: 'Genesis', chapter: 42, verseStart: 1, verseEnd: 38, note: 'Joseph\'s brothers come to Egypt' }] },
    { day: 27, title: 'Day 27: The Brothers Return', passages: [{ book: 'Genesis', chapter: 43, verseStart: 1, verseEnd: 34, note: 'The second journey to Egypt' }, { book: 'Genesis', chapter: 44, verseStart: 1, verseEnd: 34, note: 'Joseph\'s silver cup' }, { book: 'Genesis', chapter: 45, verseStart: 1, verseEnd: 28, note: 'Joseph reveals himself' }] },
    { day: 28, title: 'Day 28: Jacob Goes to Egypt', passages: [{ book: 'Genesis', chapter: 46, verseStart: 1, verseEnd: 34, note: 'Jacob\'s family moves to Egypt' }, { book: 'Genesis', chapter: 47, verseStart: 1, verseEnd: 31, note: 'Jacob blesses Pharaoh' }] },
    { day: 29, title: 'Day 29: Jacob\'s Final Blessings', passages: [{ book: 'Genesis', chapter: 48, verseStart: 1, verseEnd: 22, note: 'Jacob blesses Joseph\'s sons' }, { book: 'Genesis', chapter: 49, verseStart: 1, verseEnd: 33, note: 'Jacob blesses his sons' }, { book: 'Genesis', chapter: 50, verseStart: 1, verseEnd: 26, note: 'Jacob and Joseph die' }] },
    { day: 30, title: 'Day 30: The Birth of Moses', passages: [{ book: 'Exodus', chapter: 1, verseStart: 1, verseEnd: 22, note: 'Israel oppressed in Egypt' }, { book: 'Exodus', chapter: 2, verseStart: 1, verseEnd: 25, note: 'Moses born and flees to Midian' }, { book: 'Exodus', chapter: 3, verseStart: 1, verseEnd: 22, note: 'The burning bush' }] },
    { day: 31, title: 'Day 31: Exodus 4-6', passages: [{ book: 'Exodus', chapter: 4, verseStart: 1, verseEnd: null, note: 'Day 31 reading from Exodus 4-6' }, { book: 'Exodus', chapter: 5, verseStart: 1, verseEnd: null, note: 'Day 31 reading from Exodus 4-6' }, { book: 'Exodus', chapter: 6, verseStart: 1, verseEnd: null, note: 'Day 31 reading from Exodus 4-6' }] },
    { day: 32, title: 'Day 32: Exodus 7-9', passages: [{ book: 'Exodus', chapter: 7, verseStart: 1, verseEnd: null, note: 'Day 32 reading from Exodus 7-9' }, { book: 'Exodus', chapter: 8, verseStart: 1, verseEnd: null, note: 'Day 32 reading from Exodus 7-9' }, { book: 'Exodus', chapter: 9, verseStart: 1, verseEnd: null, note: 'Day 32 reading from Exodus 7-9' }] },
    { day: 33, title: 'Day 33: Exodus 10-12', passages: [{ book: 'Exodus', chapter: 10, verseStart: 1, verseEnd: null, note: 'Day 33 reading from Exodus 10-12' }, { book: 'Exodus', chapter: 11, verseStart: 1, verseEnd: null, note: 'Day 33 reading from Exodus 10-12' }, { book: 'Exodus', chapter: 12, verseStart: 1, verseEnd: null, note: 'Day 33 reading from Exodus 10-12' }] },
    { day: 34, title: 'Day 34: Exodus 13-15', passages: [{ book: 'Exodus', chapter: 13, verseStart: 1, verseEnd: null, note: 'Day 34 reading from Exodus 13-15' }, { book: 'Exodus', chapter: 14, verseStart: 1, verseEnd: null, note: 'Day 34 reading from Exodus 13-15' }, { book: 'Exodus', chapter: 15, verseStart: 1, verseEnd: null, note: 'Day 34 reading from Exodus 13-15' }] },
    { day: 35, title: 'Day 35: Exodus 16-18', passages: [{ book: 'Exodus', chapter: 16, verseStart: 1, verseEnd: null, note: 'Day 35 reading from Exodus 16-18' }, { book: 'Exodus', chapter: 17, verseStart: 1, verseEnd: null, note: 'Day 35 reading from Exodus 16-18' }, { book: 'Exodus', chapter: 18, verseStart: 1, verseEnd: null, note: 'Day 35 reading from Exodus 16-18' }] },
    { day: 36, title: 'Day 36: Exodus 19-21', passages: [{ book: 'Exodus', chapter: 19, verseStart: 1, verseEnd: null, note: 'Day 36 reading from Exodus 19-21' }, { book: 'Exodus', chapter: 20, verseStart: 1, verseEnd: null, note: 'Day 36 reading from Exodus 19-21' }, { book: 'Exodus', chapter: 21, verseStart: 1, verseEnd: null, note: 'Day 36 reading from Exodus 19-21' }] },
    { day: 37, title: 'Day 37: Exodus 22-24', passages: [{ book: 'Exodus', chapter: 22, verseStart: 1, verseEnd: null, note: 'Day 37 reading from Exodus 22-24' }, { book: 'Exodus', chapter: 23, verseStart: 1, verseEnd: null, note: 'Day 37 reading from Exodus 22-24' }, { book: 'Exodus', chapter: 24, verseStart: 1, verseEnd: null, note: 'Day 37 reading from Exodus 22-24' }] },
    { day: 38, title: 'Day 38: Exodus 25-27', passages: [{ book: 'Exodus', chapter: 25, verseStart: 1, verseEnd: null, note: 'Day 38 reading from Exodus 25-27' }, { book: 'Exodus', chapter: 26, verseStart: 1, verseEnd: null, note: 'Day 38 reading from Exodus 25-27' }, { book: 'Exodus', chapter: 27, verseStart: 1, verseEnd: null, note: 'Day 38 reading from Exodus 25-27' }] },
    { day: 39, title: 'Day 39: Exodus 28-29', passages: [{ book: 'Exodus', chapter: 28, verseStart: 1, verseEnd: null, note: 'Day 39 reading from Exodus 28-29' }, { book: 'Exodus', chapter: 29, verseStart: 1, verseEnd: null, note: 'Day 39 reading from Exodus 28-29' }] },
    { day: 40, title: 'Day 40: Exodus 30-32', passages: [{ book: 'Exodus', chapter: 30, verseStart: 1, verseEnd: null, note: 'Day 40 reading from Exodus 30-32' }, { book: 'Exodus', chapter: 31, verseStart: 1, verseEnd: null, note: 'Day 40 reading from Exodus 30-32' }, { book: 'Exodus', chapter: 32, verseStart: 1, verseEnd: null, note: 'Day 40 reading from Exodus 30-32' }] },
    { day: 41, title: 'Day 41: Exodus 33-35', passages: [{ book: 'Exodus', chapter: 33, verseStart: 1, verseEnd: null, note: 'Day 41 reading from Exodus 33-35' }, { book: 'Exodus', chapter: 34, verseStart: 1, verseEnd: null, note: 'Day 41 reading from Exodus 33-35' }, { book: 'Exodus', chapter: 35, verseStart: 1, verseEnd: null, note: 'Day 41 reading from Exodus 33-35' }] },
    { day: 42, title: 'Day 42: Exodus 36-38', passages: [{ book: 'Exodus', chapter: 36, verseStart: 1, verseEnd: null, note: 'Day 42 reading from Exodus 36-38' }, { book: 'Exodus', chapter: 37, verseStart: 1, verseEnd: null, note: 'Day 42 reading from Exodus 36-38' }, { book: 'Exodus', chapter: 38, verseStart: 1, verseEnd: null, note: 'Day 42 reading from Exodus 36-38' }] },
    { day: 43, title: 'Day 43: Exodus 39-40', passages: [{ book: 'Exodus', chapter: 39, verseStart: 1, verseEnd: null, note: 'Day 43 reading from Exodus 39-40' }, { book: 'Exodus', chapter: 40, verseStart: 1, verseEnd: null, note: 'Day 43 reading from Exodus 39-40' }] },
    { day: 44, title: 'Day 44: Leviticus 1-4', passages: [{ book: 'Leviticus', chapter: 1, verseStart: 1, verseEnd: null, note: 'Day 44 reading from Leviticus 1-4' }, { book: 'Leviticus', chapter: 2, verseStart: 1, verseEnd: null, note: 'Day 44 reading from Leviticus 1-4' }, { book: 'Leviticus', chapter: 3, verseStart: 1, verseEnd: null, note: 'Day 44 reading from Leviticus 1-4' }, { book: 'Leviticus', chapter: 4, verseStart: 1, verseEnd: null, note: 'Day 44 reading from Leviticus 1-4' }] },
    { day: 45, title: 'Day 45: Leviticus 5-7', passages: [{ book: 'Leviticus', chapter: 5, verseStart: 1, verseEnd: null, note: 'Day 45 reading from Leviticus 5-7' }, { book: 'Leviticus', chapter: 6, verseStart: 1, verseEnd: null, note: 'Day 45 reading from Leviticus 5-7' }, { book: 'Leviticus', chapter: 7, verseStart: 1, verseEnd: null, note: 'Day 45 reading from Leviticus 5-7' }] },
    { day: 46, title: 'Day 46: Leviticus 8-10', passages: [{ book: 'Leviticus', chapter: 8, verseStart: 1, verseEnd: null, note: 'Day 46 reading from Leviticus 8-10' }, { book: 'Leviticus', chapter: 9, verseStart: 1, verseEnd: null, note: 'Day 46 reading from Leviticus 8-10' }, { book: 'Leviticus', chapter: 10, verseStart: 1, verseEnd: null, note: 'Day 46 reading from Leviticus 8-10' }] },
    { day: 47, title: 'Day 47: Leviticus 11-13', passages: [{ book: 'Leviticus', chapter: 11, verseStart: 1, verseEnd: null, note: 'Day 47 reading from Leviticus 11-13' }, { book: 'Leviticus', chapter: 12, verseStart: 1, verseEnd: null, note: 'Day 47 reading from Leviticus 11-13' }, { book: 'Leviticus', chapter: 13, verseStart: 1, verseEnd: null, note: 'Day 47 reading from Leviticus 11-13' }] },
    { day: 48, title: 'Day 48: Leviticus 14-15', passages: [{ book: 'Leviticus', chapter: 14, verseStart: 1, verseEnd: null, note: 'Day 48 reading from Leviticus 14-15' }, { book: 'Leviticus', chapter: 15, verseStart: 1, verseEnd: null, note: 'Day 48 reading from Leviticus 14-15' }] },
    { day: 49, title: 'Day 49: Leviticus 16-18', passages: [{ book: 'Leviticus', chapter: 16, verseStart: 1, verseEnd: null, note: 'Day 49 reading from Leviticus 16-18' }, { book: 'Leviticus', chapter: 17, verseStart: 1, verseEnd: null, note: 'Day 49 reading from Leviticus 16-18' }, { book: 'Leviticus', chapter: 18, verseStart: 1, verseEnd: null, note: 'Day 49 reading from Leviticus 16-18' }] },
    { day: 50, title: 'Day 50: Leviticus 19-21', passages: [{ book: 'Leviticus', chapter: 19, verseStart: 1, verseEnd: null, note: 'Day 50 reading from Leviticus 19-21' }, { book: 'Leviticus', chapter: 20, verseStart: 1, verseEnd: null, note: 'Day 50 reading from Leviticus 19-21' }, { book: 'Leviticus', chapter: 21, verseStart: 1, verseEnd: null, note: 'Day 50 reading from Leviticus 19-21' }] },
    { day: 51, title: 'Day 51: Leviticus 22-23', passages: [{ book: 'Leviticus', chapter: 22, verseStart: 1, verseEnd: null, note: 'Day 51 reading from Leviticus 22-23' }, { book: 'Leviticus', chapter: 23, verseStart: 1, verseEnd: null, note: 'Day 51 reading from Leviticus 22-23' }] },
    { day: 52, title: 'Day 52: Leviticus 24-25', passages: [{ book: 'Leviticus', chapter: 24, verseStart: 1, verseEnd: null, note: 'Day 52 reading from Leviticus 24-25' }, { book: 'Leviticus', chapter: 25, verseStart: 1, verseEnd: null, note: 'Day 52 reading from Leviticus 24-25' }] },
    { day: 53, title: 'Day 53: Leviticus 26-27', passages: [{ book: 'Leviticus', chapter: 26, verseStart: 1, verseEnd: null, note: 'Day 53 reading from Leviticus 26-27' }, { book: 'Leviticus', chapter: 27, verseStart: 1, verseEnd: null, note: 'Day 53 reading from Leviticus 26-27' }] },
    { day: 54, title: 'Day 54: Numbers 1-2', passages: [{ book: 'Numbers', chapter: 1, verseStart: 1, verseEnd: null, note: 'Day 54 reading from Numbers 1-2' }, { book: 'Numbers', chapter: 2, verseStart: 1, verseEnd: null, note: 'Day 54 reading from Numbers 1-2' }] },
    { day: 55, title: 'Day 55: Numbers 3-4', passages: [{ book: 'Numbers', chapter: 3, verseStart: 1, verseEnd: null, note: 'Day 55 reading from Numbers 3-4' }, { book: 'Numbers', chapter: 4, verseStart: 1, verseEnd: null, note: 'Day 55 reading from Numbers 3-4' }] },
    { day: 56, title: 'Day 56: Numbers 5-6', passages: [{ book: 'Numbers', chapter: 5, verseStart: 1, verseEnd: null, note: 'Day 56 reading from Numbers 5-6' }, { book: 'Numbers', chapter: 6, verseStart: 1, verseEnd: null, note: 'Day 56 reading from Numbers 5-6' }] },
    { day: 57, title: 'Day 57: Numbers 7', passages: [{ book: 'Numbers', chapter: 7, verseStart: 1, verseEnd: null, note: 'Day 57 reading from Numbers 7' }] },
    { day: 58, title: 'Day 58: Numbers 8-10', passages: [{ book: 'Numbers', chapter: 8, verseStart: 1, verseEnd: null, note: 'Day 58 reading from Numbers 8-10' }, { book: 'Numbers', chapter: 9, verseStart: 1, verseEnd: null, note: 'Day 58 reading from Numbers 8-10' }, { book: 'Numbers', chapter: 10, verseStart: 1, verseEnd: null, note: 'Day 58 reading from Numbers 8-10' }] },
    { day: 59, title: 'Day 59: Numbers 11-13', passages: [{ book: 'Numbers', chapter: 11, verseStart: 1, verseEnd: null, note: 'Day 59 reading from Numbers 11-13' }, { book: 'Numbers', chapter: 12, verseStart: 1, verseEnd: null, note: 'Day 59 reading from Numbers 11-13' }, { book: 'Numbers', chapter: 13, verseStart: 1, verseEnd: null, note: 'Day 59 reading from Numbers 11-13' }] },
    { day: 60, title: 'Day 60: Numbers 14-15, Psalm 90', passages: [{ book: 'Numbers', chapter: 14, verseStart: 1, verseEnd: null, note: 'Day 60 reading from Numbers 14-15, Psalm 90' }, { book: 'Numbers', chapter: 15, verseStart: 1, verseEnd: null, note: 'Day 60 reading from Numbers 14-15, Psalm 90' }, { book: 'Psalm', chapter: 90, verseStart: 1, verseEnd: null, note: 'Day 60 reading from Numbers 14-15, Psalm 90' }] },
    { day: 61, title: 'Day 61: Numbers 16-17', passages: [{ book: 'Numbers', chapter: 16, verseStart: 1, verseEnd: null, note: 'Day 61 reading from Numbers 16-17' }, { book: 'Numbers', chapter: 17, verseStart: 1, verseEnd: null, note: 'Day 61 reading from Numbers 16-17' }] },
    { day: 62, title: 'Day 62: Numbers 18-20', passages: [{ book: 'Numbers', chapter: 18, verseStart: 1, verseEnd: null, note: 'Day 62 reading from Numbers 18-20' }, { book: 'Numbers', chapter: 19, verseStart: 1, verseEnd: null, note: 'Day 62 reading from Numbers 18-20' }, { book: 'Numbers', chapter: 20, verseStart: 1, verseEnd: null, note: 'Day 62 reading from Numbers 18-20' }] },
    { day: 63, title: 'Day 63: Numbers 21-22', passages: [{ book: 'Numbers', chapter: 21, verseStart: 1, verseEnd: null, note: 'Day 63 reading from Numbers 21-22' }, { book: 'Numbers', chapter: 22, verseStart: 1, verseEnd: null, note: 'Day 63 reading from Numbers 21-22' }] },
    { day: 64, title: 'Day 64: Numbers 23-25', passages: [{ book: 'Numbers', chapter: 23, verseStart: 1, verseEnd: null, note: 'Day 64 reading from Numbers 23-25' }, { book: 'Numbers', chapter: 24, verseStart: 1, verseEnd: null, note: 'Day 64 reading from Numbers 23-25' }, { book: 'Numbers', chapter: 25, verseStart: 1, verseEnd: null, note: 'Day 64 reading from Numbers 23-25' }] },
    { day: 65, title: 'Day 65: Numbers 26-27', passages: [{ book: 'Numbers', chapter: 26, verseStart: 1, verseEnd: null, note: 'Day 65 reading from Numbers 26-27' }, { book: 'Numbers', chapter: 27, verseStart: 1, verseEnd: null, note: 'Day 65 reading from Numbers 26-27' }] },
    { day: 66, title: 'Day 66: Numbers 28-30', passages: [{ book: 'Numbers', chapter: 28, verseStart: 1, verseEnd: null, note: 'Day 66 reading from Numbers 28-30' }, { book: 'Numbers', chapter: 29, verseStart: 1, verseEnd: null, note: 'Day 66 reading from Numbers 28-30' }, { book: 'Numbers', chapter: 30, verseStart: 1, verseEnd: null, note: 'Day 66 reading from Numbers 28-30' }] },
    { day: 67, title: 'Day 67: Numbers 31-32', passages: [{ book: 'Numbers', chapter: 31, verseStart: 1, verseEnd: null, note: 'Day 67 reading from Numbers 31-32' }, { book: 'Numbers', chapter: 32, verseStart: 1, verseEnd: null, note: 'Day 67 reading from Numbers 31-32' }] },
    { day: 68, title: 'Day 68: Numbers 33-34', passages: [{ book: 'Numbers', chapter: 33, verseStart: 1, verseEnd: null, note: 'Day 68 reading from Numbers 33-34' }, { book: 'Numbers', chapter: 34, verseStart: 1, verseEnd: null, note: 'Day 68 reading from Numbers 33-34' }] },
    { day: 69, title: 'Day 69: Numbers 35-36', passages: [{ book: 'Numbers', chapter: 35, verseStart: 1, verseEnd: null, note: 'Day 69 reading from Numbers 35-36' }, { book: 'Numbers', chapter: 36, verseStart: 1, verseEnd: null, note: 'Day 69 reading from Numbers 35-36' }] },
    { day: 70, title: 'Day 70: Deuteronomy 1-2', passages: [{ book: 'Deuteronomy', chapter: 1, verseStart: 1, verseEnd: null, note: 'Day 70 reading from Deuteronomy 1-2' }, { book: 'Deuteronomy', chapter: 2, verseStart: 1, verseEnd: null, note: 'Day 70 reading from Deuteronomy 1-2' }] },
    { day: 71, title: 'Day 71: Deuteronomy 3-4', passages: [{ book: 'Deuteronomy', chapter: 3, verseStart: 1, verseEnd: null, note: 'Day 71 reading from Deuteronomy 3-4' }, { book: 'Deuteronomy', chapter: 4, verseStart: 1, verseEnd: null, note: 'Day 71 reading from Deuteronomy 3-4' }] },
    { day: 72, title: 'Day 72: Deuteronomy 5-7', passages: [{ book: 'Deuteronomy', chapter: 5, verseStart: 1, verseEnd: null, note: 'Day 72 reading from Deuteronomy 5-7' }, { book: 'Deuteronomy', chapter: 6, verseStart: 1, verseEnd: null, note: 'Day 72 reading from Deuteronomy 5-7' }, { book: 'Deuteronomy', chapter: 7, verseStart: 1, verseEnd: null, note: 'Day 72 reading from Deuteronomy 5-7' }] },
    { day: 73, title: 'Day 73: Deuteronomy 8-10', passages: [{ book: 'Deuteronomy', chapter: 8, verseStart: 1, verseEnd: null, note: 'Day 73 reading from Deuteronomy 8-10' }, { book: 'Deuteronomy', chapter: 9, verseStart: 1, verseEnd: null, note: 'Day 73 reading from Deuteronomy 8-10' }, { book: 'Deuteronomy', chapter: 10, verseStart: 1, verseEnd: null, note: 'Day 73 reading from Deuteronomy 8-10' }] },
    { day: 74, title: 'Day 74: Deuteronomy 11-13', passages: [{ book: 'Deuteronomy', chapter: 11, verseStart: 1, verseEnd: null, note: 'Day 74 reading from Deuteronomy 11-13' }, { book: 'Deuteronomy', chapter: 12, verseStart: 1, verseEnd: null, note: 'Day 74 reading from Deuteronomy 11-13' }, { book: 'Deuteronomy', chapter: 13, verseStart: 1, verseEnd: null, note: 'Day 74 reading from Deuteronomy 11-13' }] },
    { day: 75, title: 'Day 75: Deuteronomy 14-16', passages: [{ book: 'Deuteronomy', chapter: 14, verseStart: 1, verseEnd: null, note: 'Day 75 reading from Deuteronomy 14-16' }, { book: 'Deuteronomy', chapter: 15, verseStart: 1, verseEnd: null, note: 'Day 75 reading from Deuteronomy 14-16' }, { book: 'Deuteronomy', chapter: 16, verseStart: 1, verseEnd: null, note: 'Day 75 reading from Deuteronomy 14-16' }] },
    { day: 76, title: 'Day 76: Deuteronomy 17-20', passages: [{ book: 'Deuteronomy', chapter: 17, verseStart: 1, verseEnd: null, note: 'Day 76 reading from Deuteronomy 17-20' }, { book: 'Deuteronomy', chapter: 18, verseStart: 1, verseEnd: null, note: 'Day 76 reading from Deuteronomy 17-20' }, { book: 'Deuteronomy', chapter: 19, verseStart: 1, verseEnd: null, note: 'Day 76 reading from Deuteronomy 17-20' }, { book: 'Deuteronomy', chapter: 20, verseStart: 1, verseEnd: null, note: 'Day 76 reading from Deuteronomy 17-20' }] },
    { day: 77, title: 'Day 77: Deuteronomy 21-23', passages: [{ book: 'Deuteronomy', chapter: 21, verseStart: 1, verseEnd: null, note: 'Day 77 reading from Deuteronomy 21-23' }, { book: 'Deuteronomy', chapter: 22, verseStart: 1, verseEnd: null, note: 'Day 77 reading from Deuteronomy 21-23' }, { book: 'Deuteronomy', chapter: 23, verseStart: 1, verseEnd: null, note: 'Day 77 reading from Deuteronomy 21-23' }] },
    { day: 78, title: 'Day 78: Deuteronomy 24-27', passages: [{ book: 'Deuteronomy', chapter: 24, verseStart: 1, verseEnd: null, note: 'Day 78 reading from Deuteronomy 24-27' }, { book: 'Deuteronomy', chapter: 25, verseStart: 1, verseEnd: null, note: 'Day 78 reading from Deuteronomy 24-27' }, { book: 'Deuteronomy', chapter: 26, verseStart: 1, verseEnd: null, note: 'Day 78 reading from Deuteronomy 24-27' }, { book: 'Deuteronomy', chapter: 27, verseStart: 1, verseEnd: null, note: 'Day 78 reading from Deuteronomy 24-27' }] },
    { day: 79, title: 'Day 79: Deuteronomy 28-29', passages: [{ book: 'Deuteronomy', chapter: 28, verseStart: 1, verseEnd: null, note: 'Day 79 reading from Deuteronomy 28-29' }, { book: 'Deuteronomy', chapter: 29, verseStart: 1, verseEnd: null, note: 'Day 79 reading from Deuteronomy 28-29' }] },
    { day: 80, title: 'Day 80: Deuteronomy 30-31', passages: [{ book: 'Deuteronomy', chapter: 30, verseStart: 1, verseEnd: null, note: 'Day 80 reading from Deuteronomy 30-31' }, { book: 'Deuteronomy', chapter: 31, verseStart: 1, verseEnd: null, note: 'Day 80 reading from Deuteronomy 30-31' }] },
    { day: 81, title: 'Day 81: Deuteronomy 32-34, Psalm 91', passages: [{ book: 'Deuteronomy', chapter: 32, verseStart: 1, verseEnd: null, note: 'Day 81 reading from Deuteronomy 32-34, Psalm 91' }, { book: 'Deuteronomy', chapter: 33, verseStart: 1, verseEnd: null, note: 'Day 81 reading from Deuteronomy 32-34, Psalm 91' }, { book: 'Deuteronomy', chapter: 34, verseStart: 1, verseEnd: null, note: 'Day 81 reading from Deuteronomy 32-34, Psalm 91' }, { book: 'Psalm', chapter: 91, verseStart: 1, verseEnd: null, note: 'Day 81 reading from Deuteronomy 32-34, Psalm 91' }] },
    { day: 82, title: 'Day 82: Joshua 1-4', passages: [{ book: 'Joshua', chapter: 1, verseStart: 1, verseEnd: null, note: 'Day 82 reading from Joshua 1-4' }, { book: 'Joshua', chapter: 2, verseStart: 1, verseEnd: null, note: 'Day 82 reading from Joshua 1-4' }, { book: 'Joshua', chapter: 3, verseStart: 1, verseEnd: null, note: 'Day 82 reading from Joshua 1-4' }, { book: 'Joshua', chapter: 4, verseStart: 1, verseEnd: null, note: 'Day 82 reading from Joshua 1-4' }] },
    { day: 83, title: 'Day 83: Joshua 5-8', passages: [{ book: 'Joshua', chapter: 5, verseStart: 1, verseEnd: null, note: 'Day 83 reading from Joshua 5-8' }, { book: 'Joshua', chapter: 6, verseStart: 1, verseEnd: null, note: 'Day 83 reading from Joshua 5-8' }, { book: 'Joshua', chapter: 7, verseStart: 1, verseEnd: null, note: 'Day 83 reading from Joshua 5-8' }, { book: 'Joshua', chapter: 8, verseStart: 1, verseEnd: null, note: 'Day 83 reading from Joshua 5-8' }] },
    { day: 84, title: 'Day 84: Joshua 9-11', passages: [{ book: 'Joshua', chapter: 9, verseStart: 1, verseEnd: null, note: 'Day 84 reading from Joshua 9-11' }, { book: 'Joshua', chapter: 10, verseStart: 1, verseEnd: null, note: 'Day 84 reading from Joshua 9-11' }, { book: 'Joshua', chapter: 11, verseStart: 1, verseEnd: null, note: 'Day 84 reading from Joshua 9-11' }] },
    { day: 85, title: 'Day 85: Joshua 12-15', passages: [{ book: 'Joshua', chapter: 12, verseStart: 1, verseEnd: null, note: 'Day 85 reading from Joshua 12-15' }, { book: 'Joshua', chapter: 13, verseStart: 1, verseEnd: null, note: 'Day 85 reading from Joshua 12-15' }, { book: 'Joshua', chapter: 14, verseStart: 1, verseEnd: null, note: 'Day 85 reading from Joshua 12-15' }, { book: 'Joshua', chapter: 15, verseStart: 1, verseEnd: null, note: 'Day 85 reading from Joshua 12-15' }] },
    { day: 86, title: 'Day 86: Joshua 16-18', passages: [{ book: 'Joshua', chapter: 16, verseStart: 1, verseEnd: null, note: 'Day 86 reading from Joshua 16-18' }, { book: 'Joshua', chapter: 17, verseStart: 1, verseEnd: null, note: 'Day 86 reading from Joshua 16-18' }, { book: 'Joshua', chapter: 18, verseStart: 1, verseEnd: null, note: 'Day 86 reading from Joshua 16-18' }] },
    { day: 87, title: 'Day 87: Joshua 19-21', passages: [{ book: 'Joshua', chapter: 19, verseStart: 1, verseEnd: null, note: 'Day 87 reading from Joshua 19-21' }, { book: 'Joshua', chapter: 20, verseStart: 1, verseEnd: null, note: 'Day 87 reading from Joshua 19-21' }, { book: 'Joshua', chapter: 21, verseStart: 1, verseEnd: null, note: 'Day 87 reading from Joshua 19-21' }] },
    { day: 88, title: 'Day 88: Joshua 22-24', passages: [{ book: 'Joshua', chapter: 22, verseStart: 1, verseEnd: null, note: 'Day 88 reading from Joshua 22-24' }, { book: 'Joshua', chapter: 23, verseStart: 1, verseEnd: null, note: 'Day 88 reading from Joshua 22-24' }, { book: 'Joshua', chapter: 24, verseStart: 1, verseEnd: null, note: 'Day 88 reading from Joshua 22-24' }] },
    { day: 89, title: 'Day 89: Judges 1-2', passages: [{ book: 'Judges', chapter: 1, verseStart: 1, verseEnd: null, note: 'Day 89 reading from Judges 1-2' }, { book: 'Judges', chapter: 2, verseStart: 1, verseEnd: null, note: 'Day 89 reading from Judges 1-2' }] },
    { day: 90, title: 'Day 90: Judges 3-5', passages: [{ book: 'Judges', chapter: 3, verseStart: 1, verseEnd: null, note: 'Day 90 reading from Judges 3-5' }, { book: 'Judges', chapter: 4, verseStart: 1, verseEnd: null, note: 'Day 90 reading from Judges 3-5' }, { book: 'Judges', chapter: 5, verseStart: 1, verseEnd: null, note: 'Day 90 reading from Judges 3-5' }] },
    { day: 91, title: 'Day 91: Judges 6-7', passages: [{ book: 'Judges', chapter: 6, verseStart: 1, verseEnd: null, note: 'Day 91 reading from Judges 6-7' }, { book: 'Judges', chapter: 7, verseStart: 1, verseEnd: null, note: 'Day 91 reading from Judges 6-7' }] },
  ]

  // Map of day numbers to YouTube video IDs (Days 1-91)
  const videoIds: { [key: number]: string } = {
    1: 'CRUkCdeNyx4', 2: '4tO6lLJIupU', 3: 'GbcOo32jzKI', 4: 'LPzYYTBHQxM', 5: '9GsCXGB4k1E',
    6: 'F544F5PDY8s', 7: '3yEZTtGVt5s', 8: '1OfvtCxWZlM', 9: 'bLYmgYQ-PJM', 10: '2KUHTE6go0M',
    11: 'CHYwdj6GA4A', 12: 'E_wLePwUcnw', 13: 'FBt52ZiT2NE', 14: '74Qpl1zM16I', 15: '8B5fw8-BDl0',
    16: 'cIwDz3RwA0I', 17: 'eN2_MupAa9w', 18: 'beFeQ7skfFA', 19: 'F3OsPJH9ZCs', 20: 'EyMBGsXbUb0',
    21: '6H476Kc25uA', 22: '0fMukHdZUMg', 23: '5yauOVwPbko', 24: '1-PkQpbxAUI', 25: '5pdhaYUyrM0',
    26: '6_J7CC5RD78', 27: 'BlMOnn2gevg', 28: 'cntFbqOXNYg', 29: '7EG9AJt1IM8', 30: '4myOX0CH1ZQ',
    31: 'MWXH-0z3Cbw', 32: 'iSwChMM410I', 33: '6_J7CC5RD78', 34: 'yUxdhmI8gXU', 35: 'gRR1_T8_zZc',
    36: 'rW5ipVQEHHA', 37: 'kP6OeXvpyBg', 38: 'ViE64XslAHk', 39: 'eWvwYistR1w', 40: '1cuONAUU9ck',
    41: '6H476Kc25uA', 42: 'gya8QydxYzw', 43: 'Llh8ZbDanMU', 44: 'm0gpthW4ov8', 45: 'UNVkfWeb8Xs',
    46: 'Rt8wxhoO9Xo', 47: 'STyaHxVu0NM', 48: 'mXvp8tEOYDc', 49: '-WrJWmeYIHo', 50: 'JxWVCOFE3zM',
    51: '9GsCXGB4k1E', 52: '_t8ejRLqlCo', 53: 's5evtCy2ms4', 54: '5yauOVwPbko', 55: 'qoCObsPw5l4',
    56: 'beFeQ7skfFA', 57: 'FOubrQmfURU', 58: 'E_wLePwUcnw', 59: 'pmXfvFiJs3s', 60: 'kjI6wqvLSXQ',
    61: '3yEZTtGVt5s', 62: '1OfvtCxWZlM', 63: 'CfJym4yUN5k', 64: '5pdhaYUyrM0', 65: '2YUCYZzi3yA',
    66: 'QK__bM73iK8', 67: 'BlMOnn2gevg', 68: 'MK6oySTvdJE', 69: 'cntFbqOXNYg', 70: 'X9AO6SZGyYk',
    71: 'rEvj51548rI', 72: 'rS3NKQqXLjQ', 73: '0fMukHdZUMg', 74: 'z0n9KqRlsUI', 75: 'IOohqxkhsi4',
    76: '8B5fw8-BDl0', 77: 'FObrQ8Euzao', 78: 'Itv-UYbwff4', 79: 'rTd2kfSE7B4', 80: '4myOX0CH1ZQ',
    81: '6ncLqdQv6nc', 82: 'bLYmgYQ-PJM', 83: '7EG9AJt1IM8', 84: 's2Ao1a3Otxw', 85: 'Uu4FnTCBoP8',
    86: 'GnFB6qwNDVU', 87: 'VaXiyR2kFaY', 88: '1ppaMnI7MGI', 89: 'CHYwdj6GA4A', 90: 'wth3Plwy0jY',
    91: 'ihlwOKyaKyA'
  }

  for (const reading of bibleRecapReadings) {
    await prisma.session.create({
      data: {
        title: reading.title,
        description: `Day ${reading.day} of The Bible Recap chronological reading plan.`,
        startDate: getDate(reading.day - 6),
        endDate: getDate(reading.day - 5),
        visibility: SessionVisibility.PUBLIC,
        imageUrl: 'https://www.bible.com/_next/image?url=https%3A%2F%2Fimageproxy.youversionapi.com%2Fhttps%3A%2F%2Fs3.amazonaws.com%2Fyvplans%2F17553%2F1280x720.jpg&w=3840&q=75',
        leaderId: leader.id,
        seriesId: bibleRecap.id,
        scripturePassages: {
          create: reading.passages.map((passage, index) => ({
            book: passage.book,
            chapter: passage.chapter,
            verseStart: passage.verseStart,
            verseEnd: passage.verseEnd,
            content: '',
            note: passage.note,
            order: index,
          })),
        },
        resources: {
          create: [{
            fileName: `The Bible Recap - Day ${String(reading.day).padStart(3, '0')}`,
            fileUrl: `https://www.youtube.com/watch?v=${videoIds[reading.day]}&list=PLkgWIAVOhHuAVwyG587rctAbAuWFtAv1D`,
            fileType: 'video/url',
            resourceType: 'VIDEO_YOUTUBE',
            videoId: videoIds[reading.day],
            description: 'Watch Tara-Leigh Cobble\'s daily recap and study notes for today\'s reading.',
            uploadedBy: leader.id,
          }],
        },
      },
    })
  }

  console.log('✅ Created Bible Recap sessions (91 days)')

  console.log('🎉 Chancel database seeded successfully with 121 sessions!')
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
  console.log('- The Bible Recap (91 sessions - through Judges)')
  console.log('Total: 121 sessions')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
