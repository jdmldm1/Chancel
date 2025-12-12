import { PrismaClient, AchievementCategory, AchievementTier, CriteriaType } from '@prisma/client'

export async function seedAchievements(prisma: PrismaClient) {
  console.log('Seeding achievements...')

  const achievements = [
    // ==============================
    // SCRIPTURE READING (5 tiers)
    // ==============================
    {
      code: 'READER_BRONZE',
      name: 'Bronze Reader',
      description: 'Complete 5 scripture passages',
      category: AchievementCategory.SCRIPTURE_READING,
      tier: AchievementTier.BRONZE,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 5,
      isHidden: false,
      iconUrl: '/badges/reader-bronze.svg',
    },
    {
      code: 'READER_SILVER',
      name: 'Silver Reader',
      description: 'Complete 25 scripture passages',
      category: AchievementCategory.SCRIPTURE_READING,
      tier: AchievementTier.SILVER,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 25,
      isHidden: false,
      iconUrl: '/badges/reader-silver.svg',
    },
    {
      code: 'READER_GOLD',
      name: 'Gold Reader',
      description: 'Complete 100 scripture passages',
      category: AchievementCategory.SCRIPTURE_READING,
      tier: AchievementTier.GOLD,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 100,
      isHidden: false,
      iconUrl: '/badges/reader-gold.svg',
    },
    {
      code: 'READER_PLATINUM',
      name: 'Platinum Reader',
      description: 'Complete 500 scripture passages',
      category: AchievementCategory.SCRIPTURE_READING,
      tier: AchievementTier.PLATINUM,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 500,
      isHidden: false,
      iconUrl: '/badges/reader-platinum.svg',
    },
    {
      code: 'READER_DIAMOND',
      name: 'Diamond Reader',
      description: 'Complete 1000 scripture passages',
      category: AchievementCategory.SCRIPTURE_READING,
      tier: AchievementTier.DIAMOND,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 1000,
      isHidden: false,
      iconUrl: '/badges/reader-diamond.svg',
    },

    // ==============================
    // SESSION PARTICIPATION (5 tiers)
    // ==============================
    {
      code: 'PARTICIPANT_BRONZE',
      name: 'Bronze Participant',
      description: 'Join your first session',
      category: AchievementCategory.SESSION_PARTICIPATION,
      tier: AchievementTier.BRONZE,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 1,
      isHidden: false,
      iconUrl: '/badges/participant-bronze.svg',
    },
    {
      code: 'PARTICIPANT_SILVER',
      name: 'Silver Participant',
      description: 'Join 5 sessions',
      category: AchievementCategory.SESSION_PARTICIPATION,
      tier: AchievementTier.SILVER,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 5,
      isHidden: false,
      iconUrl: '/badges/participant-silver.svg',
    },
    {
      code: 'PARTICIPANT_GOLD',
      name: 'Gold Participant',
      description: 'Join 25 sessions',
      category: AchievementCategory.SESSION_PARTICIPATION,
      tier: AchievementTier.GOLD,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 25,
      isHidden: false,
      iconUrl: '/badges/participant-gold.svg',
    },
    {
      code: 'PARTICIPANT_PLATINUM',
      name: 'Platinum Participant',
      description: 'Join 100 sessions',
      category: AchievementCategory.SESSION_PARTICIPATION,
      tier: AchievementTier.PLATINUM,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 100,
      isHidden: false,
      iconUrl: '/badges/participant-platinum.svg',
    },
    {
      code: 'PARTICIPANT_DIAMOND',
      name: 'Diamond Participant',
      description: 'Join 250 sessions',
      category: AchievementCategory.SESSION_PARTICIPATION,
      tier: AchievementTier.DIAMOND,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 250,
      isHidden: false,
      iconUrl: '/badges/participant-diamond.svg',
    },

    // ==============================
    // SESSION COMPLETION (5 tiers)
    // ==============================
    {
      code: 'COMPLETER_BRONZE',
      name: 'Bronze Completer',
      description: 'Complete your first session (all passages read)',
      category: AchievementCategory.SESSION_COMPLETION,
      tier: AchievementTier.BRONZE,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 1,
      isHidden: false,
      iconUrl: '/badges/completer-bronze.svg',
    },
    {
      code: 'COMPLETER_SILVER',
      name: 'Silver Completer',
      description: 'Complete 5 sessions',
      category: AchievementCategory.SESSION_COMPLETION,
      tier: AchievementTier.SILVER,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 5,
      isHidden: false,
      iconUrl: '/badges/completer-silver.svg',
    },
    {
      code: 'COMPLETER_GOLD',
      name: 'Gold Completer',
      description: 'Complete 25 sessions',
      category: AchievementCategory.SESSION_COMPLETION,
      tier: AchievementTier.GOLD,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 25,
      isHidden: false,
      iconUrl: '/badges/completer-gold.svg',
    },
    {
      code: 'COMPLETER_PLATINUM',
      name: 'Platinum Completer',
      description: 'Complete 50 sessions',
      category: AchievementCategory.SESSION_COMPLETION,
      tier: AchievementTier.PLATINUM,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 50,
      isHidden: false,
      iconUrl: '/badges/completer-platinum.svg',
    },
    {
      code: 'COMPLETER_DIAMOND',
      name: 'Diamond Completer',
      description: 'Complete 100 sessions',
      category: AchievementCategory.SESSION_COMPLETION,
      tier: AchievementTier.DIAMOND,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 100,
      isHidden: false,
      iconUrl: '/badges/completer-diamond.svg',
    },

    // ==============================
    // COMMENTING (5 tiers)
    // ==============================
    {
      code: 'COMMENTER_BRONZE',
      name: 'Bronze Contributor',
      description: 'Post 5 comments or messages',
      category: AchievementCategory.COMMENTING,
      tier: AchievementTier.BRONZE,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 5,
      isHidden: false,
      iconUrl: '/badges/commenter-bronze.svg',
    },
    {
      code: 'COMMENTER_SILVER',
      name: 'Silver Contributor',
      description: 'Post 25 comments or messages',
      category: AchievementCategory.COMMENTING,
      tier: AchievementTier.SILVER,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 25,
      isHidden: false,
      iconUrl: '/badges/commenter-silver.svg',
    },
    {
      code: 'COMMENTER_GOLD',
      name: 'Gold Contributor',
      description: 'Post 100 comments or messages',
      category: AchievementCategory.COMMENTING,
      tier: AchievementTier.GOLD,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 100,
      isHidden: false,
      iconUrl: '/badges/commenter-gold.svg',
    },
    {
      code: 'COMMENTER_PLATINUM',
      name: 'Platinum Contributor',
      description: 'Post 500 comments or messages',
      category: AchievementCategory.COMMENTING,
      tier: AchievementTier.PLATINUM,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 500,
      isHidden: false,
      iconUrl: '/badges/commenter-platinum.svg',
    },
    {
      code: 'COMMENTER_DIAMOND',
      name: 'Diamond Contributor',
      description: 'Post 1000 comments or messages',
      category: AchievementCategory.COMMENTING,
      tier: AchievementTier.DIAMOND,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 1000,
      isHidden: false,
      iconUrl: '/badges/commenter-diamond.svg',
    },

    // ==============================
    // GROUP PARTICIPATION (5 tiers)
    // ==============================
    {
      code: 'GROUP_BRONZE',
      name: 'Bronze Member',
      description: 'Join your first group',
      category: AchievementCategory.GROUP_PARTICIPATION,
      tier: AchievementTier.BRONZE,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 1,
      isHidden: false,
      iconUrl: '/badges/group-bronze.svg',
    },
    {
      code: 'GROUP_SILVER',
      name: 'Silver Member',
      description: 'Join 3 groups',
      category: AchievementCategory.GROUP_PARTICIPATION,
      tier: AchievementTier.SILVER,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 3,
      isHidden: false,
      iconUrl: '/badges/group-silver.svg',
    },
    {
      code: 'GROUP_GOLD',
      name: 'Gold Member',
      description: 'Join 10 groups',
      category: AchievementCategory.GROUP_PARTICIPATION,
      tier: AchievementTier.GOLD,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 10,
      isHidden: false,
      iconUrl: '/badges/group-gold.svg',
    },
    {
      code: 'GROUP_PLATINUM',
      name: 'Platinum Member',
      description: 'Join 25 groups',
      category: AchievementCategory.GROUP_PARTICIPATION,
      tier: AchievementTier.PLATINUM,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 25,
      isHidden: false,
      iconUrl: '/badges/group-platinum.svg',
    },
    {
      code: 'GROUP_DIAMOND',
      name: 'Diamond Member',
      description: 'Join 50 groups',
      category: AchievementCategory.GROUP_PARTICIPATION,
      tier: AchievementTier.DIAMOND,
      criteriaType: CriteriaType.COUNT,
      criteriaValue: 50,
      isHidden: false,
      iconUrl: '/badges/group-diamond.svg',
    },

    // ==============================
    // STREAK BADGES (5 milestones)
    // ==============================
    {
      code: 'STREAK_7_DAY',
      name: '7-Day Streak',
      description: 'Active for 7 consecutive days',
      category: AchievementCategory.STREAK,
      tier: null,
      criteriaType: CriteriaType.STREAK,
      criteriaValue: 7,
      isHidden: false,
      iconUrl: '/badges/streak-7.svg',
    },
    {
      code: 'STREAK_14_DAY',
      name: '14-Day Streak',
      description: 'Active for 14 consecutive days',
      category: AchievementCategory.STREAK,
      tier: null,
      criteriaType: CriteriaType.STREAK,
      criteriaValue: 14,
      isHidden: false,
      iconUrl: '/badges/streak-14.svg',
    },
    {
      code: 'STREAK_30_DAY',
      name: '30-Day Streak',
      description: 'Active for 30 consecutive days',
      category: AchievementCategory.STREAK,
      tier: null,
      criteriaType: CriteriaType.STREAK,
      criteriaValue: 30,
      isHidden: false,
      iconUrl: '/badges/streak-30.svg',
    },
    {
      code: 'STREAK_100_DAY',
      name: '100-Day Streak',
      description: 'Active for 100 consecutive days',
      category: AchievementCategory.STREAK,
      tier: null,
      criteriaType: CriteriaType.STREAK,
      criteriaValue: 100,
      isHidden: false,
      iconUrl: '/badges/streak-100.svg',
    },
    {
      code: 'STREAK_365_DAY',
      name: 'Year-Long Dedication',
      description: 'Active for 365 consecutive days',
      category: AchievementCategory.STREAK,
      tier: null,
      criteriaType: CriteriaType.STREAK,
      criteriaValue: 365,
      isHidden: false,
      iconUrl: '/badges/streak-365.svg',
    },

    // ==============================
    // SPECIAL EVENT BADGES (2 examples)
    // ==============================
    {
      code: 'EVENT_EASTER_2025',
      name: 'Easter Study 2025',
      description: 'Participated in Easter study challenge',
      category: AchievementCategory.SPECIAL_EVENT,
      tier: null,
      criteriaType: CriteriaType.MANUAL,
      criteriaValue: 1,
      isHidden: false,
      iconUrl: '/badges/easter-2025.svg',
    },
    {
      code: 'EVENT_CHRISTMAS_2025',
      name: 'Christmas Study 2025',
      description: 'Participated in Christmas study challenge',
      category: AchievementCategory.SPECIAL_EVENT,
      tier: null,
      criteriaType: CriteriaType.MANUAL,
      criteriaValue: 1,
      isHidden: false,
      iconUrl: '/badges/christmas-2025.svg',
    },

    // ==============================
    // HIDDEN/SECRET BADGES (5)
    // ==============================
    {
      code: 'HIDDEN_FIRST_COMMENT',
      name: 'First Steps',
      description: 'Posted your first comment',
      category: AchievementCategory.HIDDEN,
      tier: null,
      criteriaType: CriteriaType.COMPOSITE,
      criteriaValue: 1,
      isHidden: true,
      iconUrl: '/badges/first-comment.svg',
    },
    {
      code: 'HIDDEN_EARLY_BIRD',
      name: 'Early Bird',
      description: 'Commented before 6 AM',
      category: AchievementCategory.HIDDEN,
      tier: null,
      criteriaType: CriteriaType.COMPOSITE,
      criteriaValue: 1,
      isHidden: true,
      iconUrl: '/badges/early-bird.svg',
    },
    {
      code: 'HIDDEN_NIGHT_OWL',
      name: 'Night Owl',
      description: 'Commented after 10 PM',
      category: AchievementCategory.HIDDEN,
      tier: null,
      criteriaType: CriteriaType.COMPOSITE,
      criteriaValue: 1,
      isHidden: true,
      iconUrl: '/badges/night-owl.svg',
    },
    {
      code: 'HIDDEN_CONVERSATION_STARTER',
      name: 'Conversation Starter',
      description: 'Started a thread with 10+ replies',
      category: AchievementCategory.HIDDEN,
      tier: null,
      criteriaType: CriteriaType.COMPOSITE,
      criteriaValue: 10,
      isHidden: true,
      iconUrl: '/badges/conversation.svg',
    },
    {
      code: 'HIDDEN_PRAYER_WARRIOR',
      name: 'Prayer Warrior',
      description: 'Created 50 prayer requests',
      category: AchievementCategory.HIDDEN,
      tier: null,
      criteriaType: CriteriaType.COMPOSITE,
      criteriaValue: 50,
      isHidden: true,
      iconUrl: '/badges/prayer-warrior.svg',
    },
  ]

  let createdCount = 0
  let updatedCount = 0

  for (const achievement of achievements) {
    const existing = await prisma.achievement.findUnique({
      where: { code: achievement.code },
    })

    if (existing) {
      await prisma.achievement.update({
        where: { code: achievement.code },
        data: achievement,
      })
      updatedCount++
    } else {
      await prisma.achievement.create({
        data: achievement,
      })
      createdCount++
    }
  }

  console.log(`✓ Achievements seeded: ${createdCount} created, ${updatedCount} updated`)
  console.log(`Total achievements: ${achievements.length}`)
}

// Allow running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const prisma = new PrismaClient()
  seedAchievements(prisma)
    .then(() => {
      console.log('Seeding complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}
