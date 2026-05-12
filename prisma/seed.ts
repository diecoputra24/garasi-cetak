import { PrismaClient } from '@prisma/client';
import { auth } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Seed User
    const email = 'garasicetaku@gmail.com';
    const password = 'admin@123';
    
    // Cek apakah user sudah ada
    let user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log('Creating admin user...');
        // We use better-auth's API to ensure the password is hashed correctly
        try {
            const res = await auth.api.signUpEmail({
                body: {
                    email,
                    password,
                    name: 'Admin Garasi Cetak',
                }
            });
            console.log('Admin user created via better-auth!');
            
            // Dapatkan user yang baru dibuat
            user = await prisma.user.findUnique({
                where: { email }
            });
            
            // Set role as admin
            if (user) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { role: 'admin' }
                });
            }
        } catch (error) {
            console.error('Error creating user with better-auth:', error);
            // Fallback: If better-auth API fails in CLI context, you might need to register via the UI first
            console.log('Please register manually via the UI if the above failed.');
        }
    } else {
        console.log('Admin user already exists.');
    }

    // 2. Seed Themes
    console.log('Creating themes...');
    const themesData = [
        { name: 'Soft Floral Pink', slug: 'soft-floral-pink', category: 'pernikahan' },
        { name: 'Blue Modern Floral', slug: 'blue-modern-floral', category: 'pernikahan' },
        { name: 'Modern Floral Red', slug: 'modern-floral-red', category: 'pernikahan' },
        { name: 'Biru Muda Floral', slug: 'biru-muda-floral', category: 'pernikahan' },
        { name: 'Rustic Elegance', slug: 'rustic-elegance', category: 'pernikahan' },
    ];

    for (const t of themesData) {
        await prisma.theme.upsert({
            where: { slug: t.slug },
            update: {},
            create: t,
        });
    }
    console.log('Themes created.');

    // 3. Seed Sample Invitation
    if (user) {
        console.log('Creating sample invitation...');
        const theme = await prisma.theme.findUnique({ where: { slug: 'soft-floral-pink' } });
        
        if (theme) {
            await prisma.invitation.upsert({
                where: { slug: 'romeo-juliet' },
                update: {},
                create: {
                    slug: 'romeo-juliet',
                    userId: user.id,
                    themeId: theme.id,
                    brideName: 'Juliet Capulet',
                    brideShort: 'Juliet',
                    groomName: 'Romeo Montague',
                    groomShort: 'Romeo',
                    akadDate: new Date('2026-12-20T08:00:00Z'),
                    akadTime: '08:00 - 10:00',
                    akadPlace: 'Masjid Agung',
                    resepsiDate: new Date('2026-12-20T11:00:00Z'),
                    resepsiTime: '11:00 - Selesai',
                    resepsiPlace: 'Gedung Serbaguna',
                }
            });
            console.log('Sample invitation created: /invitation/romeo-juliet');
        }
    }

    console.log('✅ Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
