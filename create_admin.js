const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  const email = 'admin@example.com';
  const password = 'admin123'; // Change this in production!
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if admin already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      console.log('Admin user already exists:', email);
      console.log('User ID:', existing.id);
      console.log('Role:', existing.role);

      // Update to admin if not already
      if (existing.role !== 'ADMIN') {
        const updated = await prisma.user.update({
          where: { email },
          data: { role: 'ADMIN' },
        });
        console.log('✅ Updated existing user to ADMIN role');
      }

      return existing;
    }

    // Create new admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'System Administrator',
        role: 'ADMIN',
        bio: 'System administrator account',
        emailNotifications: true,
        prayerNotifications: true,
        commentNotifications: true,
        bibleTranslation: 'ESV',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', admin.id);
    console.log('');
    console.log('⚠️  Please change the password after first login!');

    return admin;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
