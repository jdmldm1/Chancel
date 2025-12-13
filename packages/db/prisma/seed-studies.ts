import { PrismaClient, UserRole, SessionVisibility, SessionType } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'path'
import { seedAchievements } from '../../../apps/api/src/scripts/seedAchievements'

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const prisma = new PrismaClient()

// Helper function to find the first Sunday of a given year
function getFirstSunday(year: number): Date {
  const jan1 = new Date(year, 0, 1);
  const dayOfWeek = jan1.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const firstSunday = new Date(year, 0, 1 + daysUntilSunday);
  return firstSunday;
}

// Additional Bible Study Plans
const studyPlans = {
  // Topical Studies - 8-week series on key Christian topics
  topical: [
    {
      title: 'Prayer: Conversations with God',
      description: 'An 8-week journey exploring the power, patterns, and practice of prayer. Learn to deepen your communion with God through Scripture\'s teaching on prayer.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      sessionType: SessionType.TOPIC_BASED,
      weeks: [
        {
          title: 'The Lord\'s Prayer: A Model for All Prayer',
          readings: [{ book: 'Matthew', chapter: 6, verseStart: 5, verseEnd: 15 }, { book: 'Luke', chapter: 11, verseStart: 1, verseEnd: 13 }],
          note: 'Jesus teaches us the pattern for prayer: worship, submission, supplication, and forgiveness. This model prayer covers everything we need to bring before God.'
        },
        {
          title: 'Prayer in the Garden: Aligning Our Will',
          readings: [{ book: 'Matthew', chapter: 26, verseStart: 36, verseEnd: 46 }, { book: 'Luke', chapter: 22, verseStart: 39, verseEnd: 46 }],
          note: 'Jesus\' prayer in Gethsemane shows us how to pray when facing difficulty: honest emotion, persistent seeking, and ultimate surrender to God\'s will.'
        },
        {
          title: 'Bold Prayer: The Persistent Widow',
          readings: [{ book: 'Luke', chapter: 18, verseStart: 1, verseEnd: 8 }, { book: 'Luke', chapter: 11, verseStart: 5, verseEnd: 13 }],
          note: 'God invites bold, persistent prayer. He delights when we keep asking, seeking, and knocking. Persistence demonstrates faith and dependence.'
        },
        {
          title: 'Praying Scripture: The Psalms',
          readings: [{ book: 'Psalms', chapter: 51, verseStart: 1, verseEnd: null }, { book: 'Psalms', chapter: 139, verseStart: 1, verseEnd: null }],
          note: 'The Psalms teach us to pray with raw honesty, deep emotion, and theological truth. They give words to every season of life and show prayer is relationship, not ritual.'
        },
        {
          title: 'Intercession: Standing in the Gap',
          readings: [{ book: 'Exodus', chapter: 32, verseStart: 1, verseEnd: 14 }, { book: '1 Timothy', chapter: 2, verseStart: 1, verseEnd: 8 }],
          note: 'Moses intercedes for rebellious Israel. Paul calls us to pray for all people. Intercessory prayer partners with God to bring blessing and change to our world.'
        },
        {
          title: 'Prayer and Fasting: Spiritual Disciplines',
          readings: [{ book: 'Isaiah', chapter: 58, verseStart: 1, verseEnd: 14 }, { book: 'Matthew', chapter: 6, verseStart: 16, verseEnd: 18 }],
          note: 'Fasting intensifies prayer by creating space for God. True fasting isn\'t ritual but heart posture—seeking God\'s presence and justice in the world.'
        },
        {
          title: 'The Prayer of Faith: Elijah on Mount Carmel',
          readings: [{ book: '1 Kings', chapter: 18, verseStart: 20, verseEnd: 46 }, { book: 'James', chapter: 5, verseStart: 13, verseEnd: 18 }],
          note: 'Elijah\'s bold prayer demonstrates righteous, fervent prayer accomplishes much. One person\'s faith-filled prayers can impact nations.'
        },
        {
          title: 'Praying in the Spirit: The Spirit\'s Help',
          readings: [{ book: 'Romans', chapter: 8, verseStart: 26, verseEnd: 27 }, { book: 'Ephesians', chapter: 6, verseStart: 10, verseEnd: 20 }],
          note: 'When we don\'t know how to pray, the Spirit intercedes. Prayer is partnership with the Trinity, spiritual warfare, and the foundation of Christian life.'
        }
      ]
    },
    {
      title: 'Marriage and Family: God\'s Design',
      description: 'A 6-week study on biblical principles for marriage, parenting, and family relationships. Discover God\'s beautiful design for the home.',
      imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800',
      sessionType: SessionType.TOPIC_BASED,
      weeks: [
        {
          title: 'The First Marriage: God\'s Original Design',
          readings: [{ book: 'Genesis', chapter: 2, verseStart: 18, verseEnd: 25 }, { book: 'Genesis', chapter: 1, verseStart: 26, verseEnd: 28 }],
          note: 'Marriage begins in Eden as God\'s good gift. Man and woman complement each other, become one flesh, and reflect God\'s image together in covenant relationship.'
        },
        {
          title: 'Love in Action: Ephesians on Marriage',
          readings: [{ book: 'Ephesians', chapter: 5, verseStart: 21, verseEnd: 33 }],
          note: 'Paul presents marriage as a living picture of Christ and the church. Sacrificial love, mutual submission, and servant leadership create gospel-centered marriages.'
        },
        {
          title: 'The Love Chapter: 1 Corinthians 13',
          readings: [{ book: '1 Corinthians', chapter: 13, verseStart: 1, verseEnd: null }],
          note: 'True love is patient, kind, selfless, and enduring. This chapter defines the love that should characterize every marriage and relationship.'
        },
        {
          title: 'Parenting with Purpose: Deuteronomy 6',
          readings: [{ book: 'Deuteronomy', chapter: 6, verseStart: 4, verseEnd: 9 }, { book: 'Proverbs', chapter: 22, verseStart: 6, verseEnd: 6 }],
          note: 'Parents are called to teach God\'s word diligently, making spiritual formation a natural part of daily life. Faith is caught and taught at home.'
        },
        {
          title: 'Discipline and Grace: Proverbs and Ephesians',
          readings: [{ book: 'Proverbs', chapter: 13, verseStart: 24, verseEnd: 24 }, { book: 'Proverbs', chapter: 29, verseStart: 17, verseEnd: 17 }, { book: 'Ephesians', chapter: 6, verseStart: 1, verseEnd: 4 }],
          note: 'Biblical discipline combines loving correction with patient instruction. Parents represent God\'s character through balanced grace and truth.'
        },
        {
          title: 'Building a Christ-Centered Home',
          readings: [{ book: 'Colossians', chapter: 3, verseStart: 12, verseEnd: 21 }, { book: 'Joshua', chapter: 24, verseStart: 14, verseEnd: 15 }],
          note: 'Homes built on Christ withstand every storm. "As for me and my house, we will serve the Lord" remains the foundation for thriving families.'
        }
      ]
    },
    {
      title: 'Faith and Doubt: Believing God',
      description: 'A 6-week exploration of faith through Scripture. Learn to trust God in trials, overcome doubt, and grow in confident belief.',
      imageUrl: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800',
      sessionType: SessionType.TOPIC_BASED,
      weeks: [
        {
          title: 'Defining Faith: Hebrews 11',
          readings: [{ book: 'Hebrews', chapter: 11, verseStart: 1, verseEnd: 6 }],
          note: 'Faith is confidence in what we hope for and assurance of what we cannot see. It pleases God and is essential for relationship with Him.'
        },
        {
          title: 'Abraham: Faith\'s Pioneer',
          readings: [{ book: 'Genesis', chapter: 15, verseStart: 1, verseEnd: 6 }, { book: 'Romans', chapter: 4, verseStart: 1, verseEnd: 25 }],
          note: 'Abraham believed God and it was credited as righteousness. His faith journey shows us that believing God\'s promises, despite circumstances, is true faith.'
        },
        {
          title: 'Thomas: Honest Doubt',
          readings: [{ book: 'John', chapter: 20, verseStart: 24, verseEnd: 29 }],
          note: 'Jesus meets Thomas in his doubt. God is not threatened by our questions. Honest seeking leads to deeper conviction: "My Lord and my God!"'
        },
        {
          title: 'The Centurion: Great Faith',
          readings: [{ book: 'Matthew', chapter: 8, verseStart: 5, verseEnd: 13 }],
          note: 'Jesus marvels at the centurion\'s faith. Understanding Jesus\' authority and trusting His word alone demonstrates mature, humble faith.'
        },
        {
          title: 'Peter: Walking on Water',
          readings: [{ book: 'Matthew', chapter: 14, verseStart: 22, verseEnd: 33 }],
          note: 'Peter walks on water when focused on Jesus, sinks when focused on circumstances. Faith keeps its eyes on Christ, not the storm.'
        },
        {
          title: 'Faith That Works: James 2',
          readings: [{ book: 'James', chapter: 2, verseStart: 14, verseEnd: 26 }],
          note: 'Faith without works is dead. Genuine faith produces obedience and action. Belief changes behavior; orthodoxy leads to orthopraxy.'
        }
      ]
    },
    {
      title: 'The Holy Spirit: God\'s Power in Us',
      description: 'A 6-week study on the person and work of the Holy Spirit. Discover how the Spirit empowers, guides, and transforms believers.',
      imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      sessionType: SessionType.TOPIC_BASED,
      weeks: [
        {
          title: 'The Promise of the Spirit',
          readings: [{ book: 'John', chapter: 14, verseStart: 15, verseEnd: 27 }, { book: 'John', chapter: 16, verseStart: 5, verseEnd: 15 }],
          note: 'Jesus promises the Comforter who will teach, guide, and empower. The Spirit makes Jesus present with us always and leads us into all truth.'
        },
        {
          title: 'Pentecost: The Spirit Poured Out',
          readings: [{ book: 'Acts', chapter: 2, verseStart: 1, verseEnd: 41 }],
          note: 'The Spirit descends at Pentecost, birthing the church. God\'s promise to pour out His Spirit on all flesh begins the new covenant age.'
        },
        {
          title: 'Filled with the Spirit',
          readings: [{ book: 'Ephesians', chapter: 5, verseStart: 15, verseEnd: 21 }, { book: 'Acts', chapter: 4, verseStart: 23, verseEnd: 31 }],
          note: 'Believers are commanded to be filled with the Spirit continually. Spirit-filling produces worship, gratitude, submission, and bold witness.'
        },
        {
          title: 'The Fruit of the Spirit',
          readings: [{ book: 'Galatians', chapter: 5, verseStart: 16, verseEnd: 26 }],
          note: 'The Spirit produces Christ-like character: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control. These qualities flow from walking in step with the Spirit.'
        },
        {
          title: 'Spiritual Gifts: For the Common Good',
          readings: [{ book: '1 Corinthians', chapter: 12, verseStart: 1, verseEnd: 31 }],
          note: 'The Spirit distributes gifts for building up the body. Every believer is gifted; no gift is superior. Unity in diversity reflects the Trinity.'
        },
        {
          title: 'Led by the Spirit',
          readings: [{ book: 'Romans', chapter: 8, verseStart: 1, verseEnd: 17 }],
          note: 'The Spirit frees us from sin and death, enables us to live righteously, and confirms we are God\'s children. He leads us into abundant life.'
        }
      ]
    }
  ],

  // Book Studies - Deep dives into individual books
  bookStudies: [
    {
      title: 'Philippians: Joy in All Circumstances',
      description: 'A 4-week study through Paul\'s letter of joy. Written from prison, Philippians teaches us to rejoice in Christ regardless of circumstances.',
      imageUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800',
      sessionType: SessionType.SCRIPTURE_BASED,
      weeks: [
        {
          title: 'Partnership in the Gospel (Philippians 1)',
          readings: [{ book: 'Philippians', chapter: 1, verseStart: 1, verseEnd: null }],
          note: 'Paul rejoices in gospel partnership and finds purpose even in prison. To live is Christ, to die is gain. Suffering advances the gospel when we trust God.'
        },
        {
          title: 'The Mind of Christ (Philippians 2)',
          readings: [{ book: 'Philippians', chapter: 2, verseStart: 1, verseEnd: null }],
          note: 'The Christ hymn reveals Jesus\' humility and exaltation. Christians are called to the same mindset: putting others first, serving sacrificially, working out salvation with reverence.'
        },
        {
          title: 'Knowing Christ (Philippians 3)',
          readings: [{ book: 'Philippians', chapter: 3, verseStart: 1, verseEnd: null }],
          note: 'Paul counts everything as loss compared to knowing Christ. True righteousness comes through faith, not works. Press on toward the prize of the upward call.'
        },
        {
          title: 'Contentment and Peace (Philippians 4)',
          readings: [{ book: 'Philippians', chapter: 4, verseStart: 1, verseEnd: null }],
          note: 'Rejoice always. Don\'t be anxious about anything. God\'s peace guards our hearts. The secret: contentment in Christ, who strengthens us for all things.'
        }
      ]
    },
    {
      title: 'James: Faith That Works',
      description: 'A 5-week study through James. Practical wisdom on trials, faith, the tongue, wisdom, prayer, and living out authentic Christianity.',
      imageUrl: 'https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?w=800',
      sessionType: SessionType.SCRIPTURE_BASED,
      weeks: [
        {
          title: 'Trials and Temptations (James 1)',
          readings: [{ book: 'James', chapter: 1, verseStart: 1, verseEnd: null }],
          note: 'Count trials as joy because they produce perseverance. Ask God for wisdom. Don\'t just hear the word—do it. Pure religion cares for the vulnerable.'
        },
        {
          title: 'Favoritism and Faith (James 2)',
          readings: [{ book: 'James', chapter: 2, verseStart: 1, verseEnd: null }],
          note: 'Show no partiality. Love your neighbor as yourself. Faith without works is dead. Abraham\'s faith was completed by his actions.'
        },
        {
          title: 'Taming the Tongue (James 3)',
          readings: [{ book: 'James', chapter: 3, verseStart: 1, verseEnd: null }],
          note: 'The tongue is a small rudder that steers the whole ship. It can bless or curse. Wisdom from above is pure, peaceable, gentle, and full of mercy.'
        },
        {
          title: 'Humility and Submission (James 4)',
          readings: [{ book: 'James', chapter: 4, verseStart: 1, verseEnd: null }],
          note: 'Quarrels come from selfish desires. Submit to God, resist the devil. Humble yourself before the Lord. Don\'t judge or boast about tomorrow.'
        },
        {
          title: 'Patience and Prayer (James 5)',
          readings: [{ book: 'James', chapter: 5, verseStart: 1, verseEnd: null }],
          note: 'Be patient until the Lord returns. Don\'t grumble. Pray in all circumstances. The prayer of the righteous is powerful and effective.'
        }
      ]
    },
    {
      title: 'Jonah: The Reluctant Prophet',
      description: 'A 4-week study through Jonah. A story of running from God, His relentless mercy, and learning to care about what God cares about.',
      imageUrl: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
      sessionType: SessionType.SCRIPTURE_BASED,
      weeks: [
        {
          title: 'Running from God (Jonah 1)',
          readings: [{ book: 'Jonah', chapter: 1, verseStart: 1, verseEnd: null }],
          note: 'Jonah flees from God\'s call to preach to Nineveh. But you can\'t outrun God. Even in the storm, God pursues. The pagan sailors fear God while the prophet runs.'
        },
        {
          title: 'Prayer from the Depths (Jonah 2)',
          readings: [{ book: 'Jonah', chapter: 2, verseStart: 1, verseEnd: null }],
          note: 'In the fish\'s belly, Jonah prays. God hears prayers from impossible places. Salvation belongs to the Lord. God gives second chances to those who cry out.'
        },
        {
          title: 'Obedience and Revival (Jonah 3)',
          readings: [{ book: 'Jonah', chapter: 3, verseStart: 1, verseEnd: null }],
          note: 'Jonah finally obeys. Nineveh repents at his minimal message. God\'s mercy extends even to enemies. He relents from disaster when people turn from evil.'
        },
        {
          title: 'God\'s Compassion (Jonah 4)',
          readings: [{ book: 'Jonah', chapter: 4, verseStart: 1, verseEnd: null }],
          note: 'Jonah is angry at God\'s mercy. He cares more about a plant than 120,000 people. God challenges our small hearts: "Should I not care about that great city?"'
        }
      ]
    },
    {
      title: 'Ruth: Loyalty and Redemption',
      description: 'A 4-week study through Ruth. A beautiful story of covenant loyalty, God\'s providence, and redemption that points to Christ.',
      imageUrl: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=800',
      sessionType: SessionType.SCRIPTURE_BASED,
      weeks: [
        {
          title: 'Tragedy and Loyalty (Ruth 1)',
          readings: [{ book: 'Ruth', chapter: 1, verseStart: 1, verseEnd: null }],
          note: 'Naomi loses everything but gains a daughter-in-law whose loyalty reflects covenant love. "Your God will be my God." Ruth chooses faith over culture, family over comfort.'
        },
        {
          title: 'Working in the Field (Ruth 2)',
          readings: [{ book: 'Ruth', chapter: 2, verseStart: 1, verseEnd: null }],
          note: 'Ruth gleans in Boaz\'s field. God\'s providence guides her steps. Boaz shows kindness beyond the law. God works through ordinary obedience and daily faithfulness.'
        },
        {
          title: 'At the Threshing Floor (Ruth 3)',
          readings: [{ book: 'Ruth', chapter: 3, verseStart: 1, verseEnd: null }],
          note: 'Ruth appeals to Boaz as kinsman-redeemer. This bold act of faith requests redemption. Boaz responds with integrity, promising to fulfill the law.'
        },
        {
          title: 'Redemption Accomplished (Ruth 4)',
          readings: [{ book: 'Ruth', chapter: 4, verseStart: 1, verseEnd: null }],
          note: 'Boaz redeems Ruth publicly, marries her, and restores Naomi\'s family line. Their son Obed becomes grandfather to King David—and ancestor to Jesus. God writes beautiful stories from broken beginnings.'
        }
      ]
    }
  ],

  // Character Studies - Learning from biblical figures
  characterStudies: [
    {
      title: 'David: A Man After God\'s Heart',
      description: 'A 6-week study of King David. From shepherd boy to king, his life shows God\'s grace in triumph and failure.',
      imageUrl: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800',
      sessionType: SessionType.SCRIPTURE_BASED,
      weeks: [
        {
          title: 'Anointed as a Boy (1 Samuel 16)',
          readings: [{ book: '1 Samuel', chapter: 16, verseStart: 1, verseEnd: 13 }],
          note: 'God rejects Saul and chooses David, the youngest son. "Man looks at outward appearance, but the Lord looks at the heart." God chooses the unlikely and elevates the humble.'
        },
        {
          title: 'Facing Giants (1 Samuel 17)',
          readings: [{ book: '1 Samuel', chapter: 17, verseStart: 1, verseEnd: 50 }],
          note: 'David defeats Goliath with a sling and a stone, but more importantly, with faith in God. The battle belongs to the Lord. Courage comes from knowing who God is.'
        },
        {
          title: 'Friendship and Covenant (1 Samuel 18-20)',
          readings: [{ book: '1 Samuel', chapter: 18, verseStart: 1, verseEnd: 4 }, { book: '1 Samuel', chapter: 20, verseStart: 12, verseEnd: 17 }],
          note: 'Jonathan and David model covenant friendship. Their bond transcends politics and family loyalty. True friendship points us to God and sacrifices for the other\'s good.'
        },
        {
          title: 'Sparing Saul: Integrity in Trials (1 Samuel 24)',
          readings: [{ book: '1 Samuel', chapter: 24, verseStart: 1, verseEnd: 22 }],
          note: 'David spares Saul\'s life twice. He refuses to take what God hasn\'t given. Character is revealed in how we treat enemies when we have power.'
        },
        {
          title: 'David\'s Fall: Sin and Consequences (2 Samuel 11-12)',
          readings: [{ book: '2 Samuel', chapter: 11, verseStart: 1, verseEnd: 27 }, { book: '2 Samuel', chapter: 12, verseStart: 1, verseEnd: 14 }],
          note: 'David commits adultery and murder. Nathan confronts him: "You are the man!" Even a man after God\'s heart can fall grievously. Sin always has consequences, but confession brings forgiveness.'
        },
        {
          title: 'Psalm 51: A Broken Heart (Psalm 51)',
          readings: [{ book: 'Psalms', chapter: 51, verseStart: 1, verseEnd: null }],
          note: 'David\'s prayer of repentance after his sin with Bathsheba. "Create in me a clean heart." God doesn\'t despise a broken and contrite heart. True repentance restores joy.'
        }
      ]
    },
    {
      title: 'Paul: From Persecutor to Apostle',
      description: 'A 6-week study of the Apostle Paul. Encounter transformed by grace becomes the greatest missionary of the early church.',
      imageUrl: 'https://images.unsplash.com/photo-1472489092665-ec80ae28b37f?w=800',
      sessionType: SessionType.SCRIPTURE_BASED,
      weeks: [
        {
          title: 'Saul the Persecutor (Acts 7:54-8:3)',
          readings: [{ book: 'Acts', chapter: 7, verseStart: 54, verseEnd: 60 }, { book: 'Acts', chapter: 8, verseStart: 1, verseEnd: 3 }],
          note: 'Saul approves Stephen\'s stoning and ravages the church. He embodies religious zeal without truth. God specializes in transforming His enemies into His ambassadors.'
        },
        {
          title: 'Encounter on the Damascus Road (Acts 9:1-19)',
          readings: [{ book: 'Acts', chapter: 9, verseStart: 1, verseEnd: 19 }],
          note: 'Jesus confronts Saul with blinding light and a question: "Why do you persecute Me?" Conversion is divine intervention. God\'s grace stops us in our tracks.'
        },
        {
          title: 'Called to the Gentiles (Acts 9:10-16, Galatians 1:11-24)',
          readings: [{ book: 'Acts', chapter: 9, verseStart: 10, verseEnd: 16 }, { book: 'Galatians', chapter: 1, verseStart: 11, verseEnd: 24 }],
          note: 'God chooses Paul as His instrument to carry the gospel to Gentiles and kings. Those most opposed to the gospel can become its greatest champions through grace.'
        },
        {
          title: 'Thorn in the Flesh (2 Corinthians 12:1-10)',
          readings: [{ book: '2 Corinthians', chapter: 12, verseStart: 1, verseEnd: 10 }],
          note: 'Paul pleads for relief but God responds: "My grace is sufficient." Weakness becomes the platform for God\'s power. We boast in weaknesses so Christ\'s power rests on us.'
        },
        {
          title: 'Running the Race (Philippians 3:7-14)',
          readings: [{ book: 'Philippians', chapter: 3, verseStart: 7, verseEnd: 14 }],
          note: 'Paul counts everything as loss compared to knowing Christ. Past achievements mean nothing; forward focus means everything. Press on toward the prize of the upward call.'
        },
        {
          title: 'Finishing Well (2 Timothy 4:6-8)',
          readings: [{ book: '2 Timothy', chapter: 4, verseStart: 6, verseEnd: 8 }],
          note: 'Paul faces death with confidence: "I have fought the good fight, finished the race, kept the faith." A crown of righteousness awaits. Faithful endurance results in eternal reward.'
        }
      ]
    },
    {
      title: 'Moses: Leader and Deliverer',
      description: 'A 6-week study of Moses. From the burning bush to the edge of the Promised Land, follow the great deliverer of Israel.',
      imageUrl: 'https://images.unsplash.com/photo-1484600899469-230e8d1d59c0?w=800',
      sessionType: SessionType.SCRIPTURE_BASED,
      weeks: [
        {
          title: 'The Burning Bush: Called by God (Exodus 3)',
          readings: [{ book: 'Exodus', chapter: 3, verseStart: 1, verseEnd: null }],
          note: 'God appears to Moses in the burning bush and reveals His name: I AM. God calls the inadequate and equips them. Every excuse is met with God\'s presence and promise.'
        },
        {
          title: 'Confronting Pharaoh: Let My People Go (Exodus 5-11)',
          readings: [{ book: 'Exodus', chapter: 5, verseStart: 1, verseEnd: 2 }, { book: 'Exodus', chapter: 11, verseStart: 1, verseEnd: 10 }],
          note: 'Moses demands Israel\'s freedom. The plagues demonstrate God\'s power over Egyptian gods. Hardened hearts cannot resist God\'s sovereign purposes.'
        },
        {
          title: 'The Passover and Exodus (Exodus 12)',
          readings: [{ book: 'Exodus', chapter: 12, verseStart: 1, verseEnd: 42 }],
          note: 'The Passover lamb\'s blood saves Israel from death. God delivers His people from slavery. This foundational salvation event points forward to Christ, our Passover Lamb.'
        },
        {
          title: 'Receiving the Law: Mount Sinai (Exodus 19-20)',
          readings: [{ book: 'Exodus', chapter: 19, verseStart: 1, verseEnd: 25 }, { book: 'Exodus', chapter: 20, verseStart: 1, verseEnd: 17 }],
          note: 'God gives the Ten Commandments. The Law reveals God\'s holiness and humanity\'s need for grace. Moses mediates between holy God and sinful people.'
        },
        {
          title: 'The Golden Calf: Intercession and Mercy (Exodus 32)',
          readings: [{ book: 'Exodus', chapter: 32, verseStart: 1, verseEnd: 35 }],
          note: 'Israel creates a golden calf while Moses meets with God. Moses intercedes, standing in the gap between God\'s wrath and the people. True leadership pleads for mercy.'
        },
        {
          title: 'Forbidden to Enter: The Price of Disobedience (Numbers 20)',
          readings: [{ book: 'Numbers', chapter: 20, verseStart: 1, verseEnd: 13 }],
          note: 'Moses strikes the rock instead of speaking to it. One moment of anger costs him entrance to the Promised Land. Leaders are held to high standards; sin has consequences.'
        }
      ]
    }
  ],

  // Thematic Studies - Theological themes across Scripture
  thematicStudies: [
    {
      title: 'The Covenant: God\'s Promises Through History',
      description: 'A 6-week study tracing God\'s covenant promises from Adam to Christ. See the unfolding story of God\'s faithful commitment to His people.',
      imageUrl: 'https://images.unsplash.com/photo-1495195129352-aeb325a55b65?w=800',
      sessionType: SessionType.SCRIPTURE_BASED,
      weeks: [
        {
          title: 'Creation Covenant: Image Bearers (Genesis 1-2)',
          readings: [{ book: 'Genesis', chapter: 1, verseStart: 26, verseEnd: 31 }, { book: 'Genesis', chapter: 2, verseStart: 15, verseEnd: 17 }],
          note: 'God creates humans in His image to rule creation under His authority. The creation mandate and prohibition in Eden establish humanity\'s covenant relationship with God.'
        },
        {
          title: 'Noahic Covenant: Preserved Creation (Genesis 9)',
          readings: [{ book: 'Genesis', chapter: 9, verseStart: 8, verseEnd: 17 }],
          note: 'After the flood, God promises never to destroy the earth again. The rainbow seals this unconditional covenant. God commits to sustaining creation until His purposes are complete.'
        },
        {
          title: 'Abrahamic Covenant: A Great Nation (Genesis 12, 15, 17)',
          readings: [{ book: 'Genesis', chapter: 12, verseStart: 1, verseEnd: 3 }, { book: 'Genesis', chapter: 15, verseStart: 1, verseEnd: 6 }],
          note: 'God promises Abraham land, descendants, and blessing to all nations. This unconditional promise becomes the foundation for all God\'s redemptive work.'
        },
        {
          title: 'Mosaic Covenant: The Law (Exodus 19-24)',
          readings: [{ book: 'Exodus', chapter: 19, verseStart: 3, verseEnd: 8 }, { book: 'Exodus', chapter: 24, verseStart: 3, verseEnd: 8 }],
          note: 'At Sinai, God gives Israel the Law as terms of covenant relationship. "If you obey... you will be my treasured possession." This conditional covenant reveals human inability to keep it.'
        },
        {
          title: 'Davidic Covenant: An Eternal Kingdom (2 Samuel 7)',
          readings: [{ book: '2 Samuel', chapter: 7, verseStart: 8, verseEnd: 16 }],
          note: 'God promises David an eternal throne and kingdom. His offspring will build God\'s house and reign forever. This covenant finds fulfillment in Jesus, David\'s greater son.'
        },
        {
          title: 'New Covenant: Written on Hearts (Jeremiah 31, Hebrews 8)',
          readings: [{ book: 'Jeremiah', chapter: 31, verseStart: 31, verseEnd: 34 }, { book: 'Hebrews', chapter: 8, verseStart: 6, verseEnd: 13 }],
          note: 'God promises a new covenant: law written on hearts, sins forgiven, intimate knowledge of God. Jesus inaugurates this covenant through His blood, superior to all previous covenants.'
        }
      ]
    },
    {
      title: 'The Kingdom of God: Already and Not Yet',
      description: 'A 6-week study on the Kingdom of God. Explore Jesus\' teaching on the Kingdom that is present now but fully realized in the future.',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      sessionType: SessionType.SCRIPTURE_BASED,
      weeks: [
        {
          title: 'The Kingdom Announced (Mark 1:14-15)',
          readings: [{ book: 'Mark', chapter: 1, verseStart: 14, verseEnd: 15 }, { book: 'Matthew', chapter: 4, verseStart: 17, verseEnd: 17 }],
          note: 'Jesus begins His ministry: "The kingdom of God is at hand; repent and believe." The long-awaited reign of God has broken into history through Jesus.'
        },
        {
          title: 'Kingdom Parables: Mustard Seed and Yeast (Matthew 13)',
          readings: [{ book: 'Matthew', chapter: 13, verseStart: 31, verseEnd: 33 }, { book: 'Matthew', chapter: 13, verseStart: 44, verseEnd: 46 }],
          note: 'The Kingdom starts small but grows significantly. It works invisibly like yeast. It\'s worth everything we have. These parables reveal the Kingdom\'s surprising nature.'
        },
        {
          title: 'Sermon on the Mount: Kingdom Values (Matthew 5-7)',
          readings: [{ book: 'Matthew', chapter: 5, verseStart: 1, verseEnd: 12 }, { book: 'Matthew', chapter: 6, verseStart: 33, verseEnd: 33 }],
          note: 'The Beatitudes describe Kingdom citizens: poor in spirit, meek, merciful, pure. Seek first God\'s Kingdom and righteousness. Kingdom ethics turn worldly values upside down.'
        },
        {
          title: 'The Kingdom in Power: Jesus\' Miracles',
          readings: [{ book: 'Luke', chapter: 11, verseStart: 14, verseEnd: 20 }],
          note: '"If I cast out demons by the finger of God, then the kingdom of God has come upon you." Jesus\' miracles demonstrate Kingdom power breaking Satan\'s hold on creation.'
        },
        {
          title: 'The Kingdom Through the Cross (Luke 23:42-43)',
          readings: [{ book: 'Luke', chapter: 23, verseStart: 42, verseEnd: 43 }, { book: 'Colossians', chapter: 1, verseStart: 13, verseEnd: 14 }],
          note: 'The thief asks to be remembered in Jesus\' Kingdom. Jesus promises paradise. The cross is the throne; suffering leads to glory. The Kingdom comes through sacrifice.'
        },
        {
          title: 'The Kingdom Consummated (Revelation 21-22)',
          readings: [{ book: 'Revelation', chapter: 21, verseStart: 1, verseEnd: 5 }, { book: 'Revelation', chapter: 22, verseStart: 1, verseEnd: 5 }],
          note: 'New heaven and new earth. God dwells with His people. No more tears, death, or pain. The Kingdom fully comes when Christ returns. "Behold, I am making all things new."'
        }
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

  console.log(`🌱 Seeding additional Bible study plans for ${year}...`)

  // Seed achievements (do this first)
  await seedAchievements(prisma)

  // Ensure leader user exists
  let leader = await prisma.user.findUnique({ where: { email: 'leader@example.com' } })
  if (!leader) {
    leader = await prisma.user.create({
      data: {
        email: 'leader@example.com',
        name: 'Pastor David',
        password: '$2a$10$.hjms6hjX215q1ED5jQOH.O8Bj8lpN5/JdPyqlLukinnsXReHwgIC',
        role: UserRole.LEADER,
      },
    })
    console.log('✅ Created leader user')
  }

  const startDate = getFirstSunday(year)
  let totalSessions = 0

  // Process all study types
  const allStudies = [
    ...studyPlans.topical,
    ...studyPlans.bookStudies,
    ...studyPlans.characterStudies,
    ...studyPlans.thematicStudies
  ]

  console.log(`\n📚 Creating ${allStudies.length} study series for ${year}...`)
  console.log(`   Start date reference: ${startDate.toISOString().split('T')[0]}`)

  let weekOffset = 0 // Track cumulative weeks to stagger series

  for (const studyData of allStudies) {
    // Check if this series already exists for this year
    const existingSeries = await prisma.series.findFirst({
      where: {
        title: `${studyData.title} (${year})`,
      },
    })

    if (existingSeries) {
      console.log(`⚠️  Series "${studyData.title} (${year})" already exists. Skipping.`)
      weekOffset += studyData.weeks.length
      continue
    }

    // Create the series
    const series = await prisma.series.create({
      data: {
        title: `${studyData.title} (${year})`,
        description: studyData.description,
        imageUrl: studyData.imageUrl,
        leaderId: leader.id,
      },
    })

    // Create sessions for this series
    for (let i = 0; i < studyData.weeks.length; i++) {
      const weekData = studyData.weeks[i]

      // Calculate dates (each series starts offset from previous series)
      const sessionStart = new Date(startDate)
      sessionStart.setDate(startDate.getDate() + (weekOffset + i) * 7)
      const sessionEnd = new Date(sessionStart)
      sessionEnd.setDate(sessionStart.getDate() + 6)

      // Build scripture passages
      const passages: any[] = []
      for (const reading of weekData.readings) {
        passages.push({
          book: reading.book,
          chapter: reading.chapter,
          verseStart: reading.verseStart,
          verseEnd: reading.verseEnd,
          content: '',
          note: reading === weekData.readings[0] ? weekData.note : '',
          order: passages.length,
        })
      }

      await prisma.session.create({
        data: {
          title: weekData.title,
          description: weekData.note,
          startDate: sessionStart,
          endDate: sessionEnd,
          leaderId: leader.id,
          seriesId: series.id,
          visibility: SessionVisibility.PUBLIC,
          sessionType: studyData.sessionType,
          imageUrl: studyData.imageUrl,
          scripturePassages: {
            create: passages,
          },
        },
      })

      totalSessions++
    }

    weekOffset += studyData.weeks.length
    console.log(`✅ Created "${studyData.title}" - ${studyData.weeks.length} sessions`)
  }

  console.log(`\n✅ Successfully created ${totalSessions} additional study sessions for ${year}`)
  console.log('\n📖 Study Types Added:')
  console.log(`   - Topical Studies: ${studyPlans.topical.length} series`)
  console.log(`   - Book Studies: ${studyPlans.bookStudies.length} series`)
  console.log(`   - Character Studies: ${studyPlans.characterStudies.length} series`)
  console.log(`   - Thematic Studies: ${studyPlans.thematicStudies.length} series`)
  console.log('\n💡 To add these studies for another year, run: npm run db:seed:studies <year>')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding additional studies:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
