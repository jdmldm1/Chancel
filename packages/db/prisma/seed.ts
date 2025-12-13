import { PrismaClient, UserRole, SessionVisibility } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient()

// Helper function to find the first Sunday of a given year
function getFirstSunday(year: number): Date {
  const jan1 = new Date(year, 0, 1); // January 1st
  const dayOfWeek = jan1.getDay(); // 0 (Sunday) to 6 (Saturday)

  // If Jan 1 is Sunday, that's our first Sunday
  // Otherwise, calculate days until next Sunday
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  const firstSunday = new Date(year, 0, 1 + daysUntilSunday);
  return firstSunday;
}

// Year-long Bible Study Plan - 52 weeks covering the entire Bible
const biblePlan = {
  series: [
    {
      title: 'Foundations: In the Beginning',
      description: 'Journey through the origins of creation, humanity, and God\'s covenant with Israel. From the garden of Eden to the edge of the Promised Land, discover how God\'s redemptive plan began.',
      imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800',
      weeks: [
        { week: 1, readings: [{ book: 'Genesis', start: 1, end: 11, note: 'Creation, Fall, and the Flood. Pay attention to how sin enters the world and God\'s response. Notice the pattern of human rebellion and divine grace that begins here.' }] },
        { week: 2, readings: [{ book: 'Genesis', start: 12, end: 25, note: 'Abraham\'s call and covenant. This is foundational to understanding all of Scripture - God choosing a family to bless all nations. Notice Abraham\'s faith journey with its ups and downs.' }] },
        { week: 3, readings: [{ book: 'Genesis', start: 26, end: 36, note: 'Isaac and Jacob. Watch how God\'s promises pass through imperfect people. Jacob\'s wrestling with God is a powerful picture of transformation.' }] },
        { week: 4, readings: [{ book: 'Genesis', start: 37, end: 50, note: 'Joseph\'s story. A beautiful narrative of God\'s sovereignty through betrayal, suffering, and ultimately redemption. Genesis 50:20 is key.' }] },
        { week: 5, readings: [{ book: 'Exodus', start: 1, end: 15, note: 'Israel\'s slavery and the great Exodus. The Passover is central to understanding Christ. Notice how God reveals His name and character to Moses.' }] },
        { week: 6, readings: [{ book: 'Exodus', start: 16, end: 30, note: 'Journey to Sinai and the Ten Commandments. The giving of the Law is a marriage covenant between God and Israel. The tabernacle shows how God dwells with His people.' }] },
        { week: 7, readings: [{ book: 'Exodus', start: 31, end: 40, note: 'The golden calf and restoration. A sobering reminder of human fickleness and God\'s patience. The tabernacle\'s completion shows God\'s glory dwelling among His people.' }] },
        { week: 8, readings: [{ book: 'Leviticus', start: 1, end: 27, note: 'Holiness and sacrifice. While detailed, Leviticus teaches that a holy God requires proper approach. Every sacrifice points forward to Christ, the final sacrifice.' }] },
        { week: 9, readings: [{ book: 'Numbers', start: 1, end: 21, note: 'Wilderness wanderings. A generation\'s failure to trust God. Notice the cycle of rebellion, judgment, and mercy. The bronze serpent (21:9) prefigures Christ.' }] },
        { week: 10, readings: [{ book: 'Numbers', start: 22, end: 36, note: 'Balaam and the new generation. Even pagan prophets must acknowledge Israel\'s God. The new generation prepares to enter the land their parents rejected.' }] },
        { week: 11, readings: [{ book: 'Deuteronomy', start: 1, end: 17, note: 'Moses\' first address. A retelling of the wilderness journey and renewed call to obedience. The Shema (6:4-9) is central to Jewish faith.' }] },
        { week: 12, readings: [{ book: 'Deuteronomy', start: 18, end: 34, note: 'Covenant renewal and Moses\' farewell. The blessings and curses outline Israel\'s future. Moses glimpses the Promised Land but doesn\'t enter - a poignant ending.' }] },
        { week: 13, readings: [{ book: 'Joshua', start: 1, end: 24, note: 'Conquest and inheritance. God fulfills His promises as Israel enters Canaan. Joshua 24:15 challenges every generation: "Choose this day whom you will serve."' }] },
      ]
    },
    {
      title: 'Kingdom & Wisdom: Judges to Songs',
      description: 'From the chaos of the Judges to the glory of Solomon\'s kingdom, and through the wisdom literature that shaped Israel\'s worship and daily life. See how God works through flawed leaders and teaches His people to live wisely.',
      imageUrl: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800',
      weeks: [
        { week: 14, readings: [{ book: 'Judges', start: 1, end: 21, note: 'The cycle of apostasy. "Everyone did what was right in their own eyes" - a dark period showing Israel\'s need for a true king. Yet God raises up deliverers.' }] },
        { week: 15, readings: [{ book: 'Ruth', start: 1, end: 4, note: 'A beautiful story of loyalty and redemption during the judges period. Ruth, a foreigner, becomes part of the Messianic line. Boaz is a picture of Christ the Redeemer.' }] },
        { week: 16, readings: [{ book: '1 Samuel', start: 1, end: 15, note: 'From Samuel to Saul. Israel demands a king "like the other nations." Saul starts well but his disobedience leads to rejection. Man looks at outward appearance; God looks at the heart.' }] },
        { week: 17, readings: [{ book: '1 Samuel', start: 16, end: 31, note: 'David\'s rise and Saul\'s decline. David, a shepherd boy, defeats Goliath and becomes the man after God\'s own heart. Notice David\'s trust and Saul\'s jealousy.' }] },
        { week: 18, readings: [{ book: '2 Samuel', start: 1, end: 24, note: 'David\'s reign. His greatest triumphs and his worst failures. The Davidic Covenant (ch 7) promises an eternal dynasty - ultimately fulfilled in Christ.' }] },
        { week: 19, readings: [{ book: '1 Kings', start: 1, end: 11, note: 'Solomon\'s wisdom and folly. God grants him unparalleled wisdom and wealth, yet foreign wives lead his heart astray. The temple is built but the kingdom will divide.' }] },
        { week: 20, readings: [{ book: '1 Kings', start: 12, end: 22, note: 'The divided kingdom. Israel splits into north and south. Elijah confronts Baal worship. Notice God\'s patience with rebellious people.' }] },
        { week: 21, readings: [{ book: '2 Kings', start: 1, end: 17, note: 'Elisha\'s ministry and Israel\'s fall. Miracles abound through Elisha, but the northern kingdom continues in idolatry until Assyria conquers them (722 BC).' }] },
        { week: 22, readings: [{ book: '2 Kings', start: 18, end: 25, note: 'Judah\'s last days. Some godly kings bring reform (Hezekiah, Josiah) but ultimately Babylon destroys Jerusalem and the temple (586 BC). A devastating end.' }] },
        { week: 23, readings: [{ book: '1 Chronicles', start: 1, end: 29, note: 'Retelling of David\'s reign. Written after exile, Chronicles emphasizes worship, temple, and God\'s faithfulness. David prepares for the temple he cannot build.' }] },
        { week: 24, readings: [{ book: '2 Chronicles', start: 1, end: 36, note: 'Solomon to exile. Chronicles focuses on Judah\'s kings, the temple, and religious reforms. Ends with Cyrus\' decree - a note of hope after judgment.' }] },
        { week: 25, readings: [{ book: 'Ezra', start: 1, end: 10, book2: 'Nehemiah', start2: 1, end2: 13, note: 'Return from exile. Ezra leads spiritual renewal; Nehemiah rebuilds Jerusalem\'s walls. Despite opposition, God\'s people rebuild both physically and spiritually.' }] },
        { week: 26, readings: [{ book: 'Esther', start: 1, end: 10, book2: 'Job', start2: 1, end2: 42, note: 'Providence and suffering. Esther: God\'s unseen hand protects His people. Job: Wrestling with suffering and God\'s sovereignty. Both books explore faith when God seems distant.' }] },
      ]
    },
    {
      title: 'Prophets: Voices of Warning & Hope',
      description: 'The prophets called Israel back to God, warned of judgment, and promised restoration. Their messages of justice, mercy, and coming redemption echo through the ages, pointing toward the Messiah.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      weeks: [
        { week: 27, readings: [{ book: 'Psalms', start: 1, end: 50, note: 'Israel\'s hymnbook. Every human emotion is expressed here in worship. Notice the messianic psalms (2, 22, 110). Let these prayers become your prayers.' }] },
        { week: 28, readings: [{ book: 'Psalms', start: 51, end: 100, note: 'From David\'s penitential psalm (51) through songs of praise. The psalms teach us to bring everything to God - confession, lament, thanksgiving, joy.' }] },
        { week: 29, readings: [{ book: 'Psalms', start: 101, end: 150, note: 'Concluding with pure praise. The "Songs of Ascent" (120-134) were sung going up to Jerusalem. Book ends with "Let everything that has breath praise the Lord!"' }] },
        { week: 30, readings: [{ book: 'Proverbs', start: 1, end: 31, note: 'Practical wisdom for daily life. "The fear of the Lord is the beginning of wisdom." These sayings teach how to live skillfully in God\'s world.' }] },
        { week: 31, readings: [{ book: 'Ecclesiastes', start: 1, end: 12, book2: 'Song of Solomon', start2: 1, end2: 8, note: 'Two sides of life. Ecclesiastes: Life "under the sun" is meaningless without God. Song of Songs: Celebration of marital love as God designed it.' }] },
        { week: 32, readings: [{ book: 'Isaiah', start: 1, end: 39, note: 'Judgment and holiness. Isaiah\'s vision of God\'s holiness (ch 6) transforms him. Prophecies against nations show God\'s sovereignty. The Messiah is promised (7:14, 9:6).' }] },
        { week: 33, readings: [{ book: 'Isaiah', start: 40, end: 66, note: 'Comfort and restoration. "Comfort, comfort my people" begins a section of hope. The Suffering Servant songs (esp. ch 53) vividly portray Christ\'s sacrifice.' }] },
        { week: 34, readings: [{ book: 'Jeremiah', start: 1, end: 29, note: 'The weeping prophet. Jeremiah warns Judah for decades before exile. Called to preach an unpopular message, he models faithfulness despite rejection.' }] },
        { week: 35, readings: [{ book: 'Jeremiah', start: 30, end: 52, note: 'Fall of Jerusalem and hope beyond. The New Covenant promise (31:31-34) is foundational to Christianity. Even in judgment, God promises restoration.' }] },
        { week: 36, readings: [{ book: 'Lamentations', start: 1, end: 5, book2: 'Ezekiel', start2: 1, end2: 24, note: 'Grief and visions. Lamentations: Poetic mourning over Jerusalem\'s fall. Ezekiel: Dramatic visions of God\'s glory and prophetic acts depicting judgment.' }] },
        { week: 37, readings: [{ book: 'Ezekiel', start: 25, end: 48, note: 'Restoration promises. After judgment comes hope - dry bones live again (37), the new temple, and God\'s promise: "I will dwell among them forever."' }] },
        { week: 38, readings: [{ book: 'Daniel', start: 1, end: 12, note: 'Faithfulness in exile. Daniel and friends remain faithful in Babylon. Apocalyptic visions reveal God\'s control over history and the coming eternal kingdom.' }] },
        { week: 39, readings: [
          { book: 'Hosea', start: 1, end: 14, note: 'God\'s faithful love despite unfaithfulness - portrayed through Hosea\'s marriage to an unfaithful wife.' },
          { book: 'Joel', start: 1, end: 3, note: 'The Day of the Lord and the promise of the Spirit (2:28-32, quoted at Pentecost).' },
          { book: 'Amos', start: 1, end: 9, note: 'Social justice and God\'s righteous judgment against oppression.' },
          { book: 'Obadiah', start: 1, end: 1, note: 'Judgment on Edom for violence against Judah.' },
          { book: 'Jonah', start: 1, end: 4, note: 'God\'s mercy extends even to enemies. Jonah\'s reluctance shows how narrow our hearts can be.' },
          { book: 'Micah', start: 1, end: 7, note: 'Justice, mercy, humility (6:8). Messiah\'s birthplace predicted (5:2).' },
          { book: 'Nahum', start: 1, end: 3, note: 'Nineveh\'s final judgment. God is patient but will not tolerate evil forever.' },
          { book: 'Habakkuk', start: 1, end: 3, note: 'Wrestling with God about injustice. "The righteous will live by faith" (2:4).' },
          { book: 'Zephaniah', start: 1, end: 3, note: 'The great Day of the Lord brings judgment but also restoration.' },
          { book: 'Haggai', start: 1, end: 2, note: 'Rebuild the temple! Priorities matter - put God first.' },
          { book: 'Zechariah', start: 1, end: 14, note: 'Messianic visions of the coming King who will be pierced (12:10).' },
          { book: 'Malachi', start: 1, end: 4, note: 'The last OT prophet. Calls for faithfulness and promises Elijah will come before the Messiah. Then 400 years of silence.' }
        ]}
      ]
    },
    {
      title: 'New Covenant: The Messiah & His Church',
      description: 'The long-awaited Messiah arrives, bringing the Kingdom of God. Follow Jesus\' life, death, and resurrection, then see how His Spirit builds and guides the early church. End with visions of ultimate restoration.',
      imageUrl: 'https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?w=800',
      weeks: [
        { week: 40, readings: [{ book: 'Matthew', start: 1, end: 28, note: 'Jesus as the Jewish Messiah-King. Notice fulfillment of OT prophecies. The Sermon on the Mount (5-7) and Great Commission (28:18-20) are central.' }] },
        { week: 41, readings: [{ book: 'Mark', start: 1, end: 16, note: 'The suffering Servant. Fast-paced action showing Jesus as the Son of God who came to serve and give His life as a ransom. The cross is central to Mark\'s gospel.' }] },
        { week: 42, readings: [{ book: 'Luke', start: 1, end: 24, note: 'Jesus the Savior of all people. Luke emphasizes Jesus\' compassion for outcasts, women, and Gentiles. Beautiful birth narrative and powerful resurrection account.' }] },
        { week: 43, readings: [{ book: 'John', start: 1, end: 21, note: 'Jesus as the eternal Word made flesh. John\'s Gospel is theological and intimate. The "I AM" statements reveal Jesus\' deity. Belief leads to eternal life.' }] },
        { week: 44, readings: [{ book: 'Acts', start: 1, end: 28, note: 'The Spirit-empowered church. From Jerusalem to Rome, the Gospel spreads. Notice the role of the Holy Spirit, prayer, and bold witness despite persecution.' }] },
        { week: 45, readings: [{ book: 'Romans', start: 1, end: 16, note: 'The Gospel explained. Paul\'s masterpiece on justification by faith. All have sinned, Christ died for us, now we live by the Spirit. Chapters 1-8 are crucial.' }] },
        { week: 46, readings: [
          { book: '1 Corinthians', start: 1, end: 16, note: 'Church problems addressed. Divisions, immorality, lawsuits, worship issues, spiritual gifts. Love (ch 13) and resurrection (ch 15) are key.' },
          { book: '2 Corinthians', start: 1, end: 13, note: 'Paul defends his ministry. Suffering for Christ, the new covenant, generosity, and strength in weakness are themes.' }
        ]},
        { week: 47, readings: [
          { book: 'Galatians', start: 1, end: 6, note: 'Freedom in Christ vs. slavery to law. Justification is by faith alone, not works. Walk by the Spirit and bear His fruit (5:22-23).' },
          { book: 'Ephesians', start: 1, end: 6, note: 'The church as Christ\'s body. Rich theology of our identity in Christ and practical teaching on unity, spiritual warfare, and relationships.' },
          { book: 'Philippians', start: 1, end: 4, note: 'Joy in Christ despite circumstances. Christ\'s humility (2:5-11) is our model. "Rejoice in the Lord always!"' },
          { book: 'Colossians', start: 1, end: 4, note: 'The supremacy of Christ. He is over all creation and the church. Don\'t be deceived by false teaching or empty philosophy.' }
        ]},
        { week: 48, readings: [
          { book: '1 Thessalonians', start: 1, end: 5, note: 'Encouragement and Christ\'s return. Model church, holy living, and hope in the second coming.' },
          { book: '2 Thessalonians', start: 1, end: 3, note: 'Correction about the Day of the Lord. Stand firm while waiting for Christ\'s return.' },
          { book: '1 Timothy', start: 1, end: 6, note: 'Instructions for church leadership. Qualifications for elders and deacons, sound doctrine, and godly living.' },
          { book: '2 Timothy', start: 1, end: 4, note: 'Paul\'s final letter. "Fight the good fight, finish the race, keep the faith." Guard the Gospel and endure suffering.' },
          { book: 'Titus', start: 1, end: 3, note: 'Church order in Crete. Good works flow from sound doctrine and God\'s grace.' },
          { book: 'Philemon', start: 1, end: 1, note: 'A slave becomes a brother. Beautiful picture of reconciliation and Christian fellowship.' }
        ]},
        { week: 49, readings: [{ book: 'Hebrews', start: 1, end: 13, note: 'Jesus is better than everything in the old covenant. Better than angels, Moses, and the priesthood. He is the final sacrifice. Hold fast to faith!' }] },
        { week: 50, readings: [
          { book: 'James', start: 1, end: 5, note: 'Faith produces works. Practical wisdom on trials, speech, pride, patience, and prayer. Faith without works is dead.' },
          { book: '1 Peter', start: 1, end: 5, note: 'Hope in suffering. Living as exiles, endure trials knowing Christ suffered for us. Submit, resist the devil, trust God\'s grace.' },
          { book: '2 Peter', start: 1, end: 3, note: 'Grow in knowledge and beware false teachers. The Day of the Lord will come - live holy lives as you wait.' }
        ]},
        { week: 51, readings: [
          { book: '1 John', start: 1, end: 5, note: 'Walking in the light and love. Test the spirits, love one another, know that you have eternal life in Christ.' },
          { book: '2 John', start: 1, end: 1, note: 'Walk in truth and love. Do not welcome false teachers.' },
          { book: '3 John', start: 1, end: 1, note: 'Support faithful teachers of the truth.' },
          { book: 'Jude', start: 1, end: 1, note: 'Contend for the faith. Warning against false teachers who pervert grace into license.' }
        ]},
        { week: 52, readings: [{ book: 'Revelation', start: 1, end: 22, note: 'The grand finale. Letters to churches (1-3), throne room visions (4-5), judgments (6-19), and ultimate victory - Satan defeated, death destroyed, new creation (21-22). "Come, Lord Jesus!"' }] }
      ]
    }
  ]
}

async function main() {
  // Get year from command line argument or use current year
  const yearArg = process.argv[2]
  const year = yearArg ? parseInt(yearArg, 10) : new Date().getFullYear()

  if (isNaN(year) || year < 2000 || year > 2100) {
    console.error('❌ Invalid year. Please provide a year between 2000 and 2100.')
    process.exit(1)
  }

  console.log(`🌱 Starting database seed for year ${year}...`)

  // Ensure test users exist (don't delete existing data)
  let leader = await prisma.user.findUnique({ where: { email: 'leader@example.com' } })
  if (!leader) {
    leader = await prisma.user.create({
      data: {
        email: 'leader@example.com',
        name: 'Pastor David',
        password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC', // password: "password"
        role: UserRole.LEADER,
      },
    })
    console.log('✅ Created leader user')
  } else {
    console.log('✅ Leader user already exists')
  }

  let member1 = await prisma.user.findUnique({ where: { email: 'member1@example.com' } })
  if (!member1) {
    member1 = await prisma.user.create({
      data: {
        email: 'member1@example.com',
        name: 'Sarah Johnson',
        password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC',
        role: UserRole.MEMBER,
      },
    })
    console.log('✅ Created member1 user')
  }

  let member2 = await prisma.user.findUnique({ where: { email: 'member2@example.com' } })
  if (!member2) {
    member2 = await prisma.user.create({
      data: {
        email: 'member2@example.com',
        name: 'Michael Chen',
        password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC',
        role: UserRole.MEMBER,
      },
    })
    console.log('✅ Created member2 user')
  }

  // Calculate the first Sunday of the year
  const startDate = getFirstSunday(year)

  // Helper function to get week start/end dates
  const getWeekDates = (weekNumber: number) => {
    const weekStart = new Date(startDate)
    weekStart.setDate(startDate.getDate() + (weekNumber - 1) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return { weekStart, weekEnd }
  }

  // Check if sessions for this year already exist
  const yearEnd = new Date(year, 11, 31) // December 31st
  const existingSessions = await prisma.session.findMany({
    where: {
      startDate: {
        gte: startDate,
        lte: yearEnd,
      },
    },
  })

  if (existingSessions.length > 0) {
    console.log(`⚠️  Found ${existingSessions.length} existing sessions for ${year}. Skipping to avoid duplicates.`)
    console.log(`   To reseed ${year}, manually delete sessions for that year first.`)
    return
  }

  console.log(`📖 Creating year-long Bible study series for ${year}...`)
  console.log(`   First Sunday: ${startDate.toISOString().split('T')[0]}`)

  let sessionCount = 0

  // Create each series with its sessions
  for (const seriesData of biblePlan.series) {
    const series = await prisma.series.create({
      data: {
        title: `${seriesData.title} (${year})`,
        description: seriesData.description,
        imageUrl: seriesData.imageUrl,
        leaderId: leader.id,
      },
    })
    console.log(`✅ Created series: ${seriesData.title} (${year})`)

    // Create sessions for this series
    for (const weekData of seriesData.weeks) {
      const { weekStart, weekEnd } = getWeekDates(weekData.week)

      // Build session title from readings
      let sessionTitle = `Week ${weekData.week}: `
      const readingTitles: string[] = []

      for (const reading of weekData.readings) {
        let title = ''
        if (reading.end && reading.end > reading.start) {
          title = `${reading.book} ${reading.start}-${reading.end}`
        } else {
          title = `${reading.book} ${reading.start}`
        }
        readingTitles.push(title)

        // Add second book if present (for weeks with multiple books)
        if (reading.book2) {
          let title2 = ''
          if (reading.end2 && reading.end2 > reading.start2!) {
            title2 = `${reading.book2} ${reading.start2}-${reading.end2}`
          } else {
            title2 = `${reading.book2} ${reading.start2}`
          }
          readingTitles.push(title2)
        }
      }

      sessionTitle += readingTitles.join(', ')

      // Create scripture passages for this session - one passage per chapter
      const passages: any[] = []
      let passageOrder = 0

      for (const reading of weekData.readings) {
        // Create one passage record for each chapter in the range
        for (let chapter = reading.start; chapter <= reading.end; chapter++) {
          passages.push({
            book: reading.book,
            chapter: chapter,
            verseStart: 1,
            verseEnd: null, // Full chapter
            content: '',
            note: chapter === reading.start ? reading.note : '', // Only put note on first chapter
            order: passageOrder++,
          })
        }

        // Add second book if present
        if (reading.book2 && reading.start2 && reading.end2) {
          for (let chapter = reading.start2; chapter <= reading.end2; chapter++) {
            passages.push({
              book: reading.book2,
              chapter: chapter,
              verseStart: 1,
              verseEnd: null,
              content: '',
              note: '', // Note is typically for the first reading
              order: passageOrder++,
            })
          }
        }
      }

      await prisma.session.create({
        data: {
          title: sessionTitle,
          description: `Weekly Bible reading for ${seriesData.title}`,
          startDate: weekStart,
          endDate: weekEnd,
          leaderId: leader.id,
          seriesId: series.id,
          visibility: SessionVisibility.PUBLIC,
          imageUrl: seriesData.imageUrl,
          scripturePassages: {
            create: passages,
          },
        },
      })

      sessionCount++
    }
    console.log(`✅ Created ${seriesData.weeks.length} sessions for ${seriesData.title}`)
  }

  console.log(`✅ Created all ${sessionCount} weekly sessions for ${year}`)

  // Calculate end date (52 weeks from start)
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + (51 * 7) + 6) // 52 weeks

  console.log('\n📖 Sacred space. Shared study.')
  console.log('\nTest Credentials:')
  console.log('Leader: leader@example.com / password')
  console.log('Member 1: member1@example.com / password')
  console.log('Member 2: member2@example.com / password')
  console.log('\n📚 One Year Canonical Bible Study')
  console.log(`Year: ${year}`)
  console.log(`Total: ${sessionCount} weekly sessions across ${biblePlan.series.length} quarterly series`)
  console.log(`Starting: ${startDate.toISOString().split('T')[0]} (Week 1)`)
  console.log(`Ending: ${endDate.toISOString().split('T')[0]} (Week 52)`)
  console.log('\n💡 To add another year, run: npm run db:seed <year>')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
