'use server';

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";

// Helper to bypass Prisma Client validation issues on Windows
async function rawUpdateInvitation(id: string, data: any) {
    // Daftar kolom resmi yang ada di database agar tidak terjadi error "column not found"
    const allowedColumns = [
        'slug', 'status', 'brideName', 'brideShort', 'groomName', 'groomShort',
        'brideParents', 'groomParents', 'akadDate', 'akadTime', 'akadPlace',
        'akadAddress', 'akadMaps', 'resepsiDate', 'resepsiTime', 'resepsiPlace',
        'resepsiAddress', 'resepsiMaps', 'gallery', 'gifts', 'updatedAt',
        'brideImage', 'brideInstagram', 'groomImage', 'groomInstagram',
        'musicUrl', 'story', 'themeId'
    ];

    const fields = Object.keys(data).filter(k => allowedColumns.includes(k));
    const setClause = fields.map((k, i) => `"${k}" = $${i + 1}`).join(', ');
    const values = fields.map(k => {
        const val = data[k];
        if (val instanceof Date) return val.toISOString();
        return val;
    });
    
    const query = `UPDATE "invitation" SET ${setClause} WHERE "id" = $${fields.length + 1}`;
    console.log("EXECUTE SQL:", query);
    console.log("VALUES:", [...values, id]);
    
    await (prisma as any).$executeRawUnsafe(
        query,
        ...values,
        id
    );
}

async function rawCreateInvitation(data: any) {
    const allowedColumns = [
        'id', 'slug', 'userId', 'status', 'brideName', 'brideShort', 'groomName', 'groomShort',
        'brideParents', 'groomParents', 'akadDate', 'akadTime', 'akadPlace',
        'akadAddress', 'akadMaps', 'resepsiDate', 'resepsiTime', 'resepsiPlace',
        'resepsiAddress', 'resepsiMaps', 'gallery', 'gifts', 'createdAt', 'updatedAt',
        'brideImage', 'brideInstagram', 'groomImage', 'groomInstagram',
        'musicUrl', 'story', 'themeId'
    ];

    const fields = Object.keys(data).filter(k => allowedColumns.includes(k));
    const columns = fields.map(k => `"${k}"`).join(', ');
    const placeHolders = fields.map((_, i) => `$${i + 1}`).join(', ');
    const values = fields.map(k => {
        const val = data[k];
        if (val instanceof Date) return val.toISOString();
        return val;
    });

    const query = `INSERT INTO "invitation" (${columns}) VALUES (${placeHolders})`;
    console.log("EXECUTE INSERT SQL:", query);
    console.log("VALUES:", values);

    await (prisma as any).$executeRawUnsafe(
        query,
        ...values
    );
}

export async function createInvitation(data: any) {
    const session = await getServerSession();

    if (!session) throw new Error("Unauthorized");

    const {
        brideShort,
        groomShort,
        themeId,
        ...rest
    } = data;

    // Generate Slug
    let slug = `${brideShort.toLowerCase()}-dan-${groomShort.toLowerCase()}`.replace(/\s+/g, '-');
    const existing = await prisma.invitation.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Math.floor(Math.random() * 1000)}`;

    const theme = await prisma.theme.findFirst({
        where: {
            OR: [ { id: themeId }, { slug: themeId } ]
        }
    });

    if (!theme) throw new Error(`Tema "${themeId}" tidak ditemukan`);

    const randomId = Math.random().toString(36).substring(2, 15);

    const invitationData = {
        ...rest,
        id: randomId,
        brideShort,
        groomShort,
        slug,
        themeId: theme.id,
        userId: session.user.id,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        gallery: typeof rest.gallery === 'string' ? rest.gallery : JSON.stringify(rest.gallery || []),
        gifts: typeof rest.gifts === 'string' ? rest.gifts : JSON.stringify(rest.gifts || []),
        story: typeof rest.story === 'string' ? rest.story : JSON.stringify(rest.story || []),
    };

    await rawCreateInvitation(invitationData);
    return { success: true, slug: invitationData.slug };
}

export async function updateInvitation(id: string, data: any) {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const theme = await prisma.theme.findFirst({
        where: { OR: [ { id: data.themeId }, { slug: data.themeId } ] }
    });

    if (!theme) throw new Error("Theme not found");

    const { brideShort, groomShort } = data;
    let slug = data.slug;
    
    // Auto-regenerate slug if names are provided
    if (brideShort && groomShort) {
        slug = `${brideShort.toLowerCase()}-dan-${groomShort.toLowerCase()}`.replace(/\s+/g, '-');
    }

    const updateData = {
        ...data,
        slug,
        themeId: theme.id,
        updatedAt: new Date(),
        gallery: typeof data.gallery === 'string' ? data.gallery : JSON.stringify(data.gallery || []),
        gifts: typeof data.gifts === 'string' ? data.gifts : JSON.stringify(data.gifts || []),
        story: typeof data.story === 'string' ? data.story : JSON.stringify(data.story || []),
    };

    await rawUpdateInvitation(id, updateData);
    console.log("SUCCESS: Invitation updated via Raw SQL bypass");
    return { success: true, slug: updateData.slug || id };
}


export async function getInvitationById(id: string) {
    const session = await getServerSession();

    if (!session) throw new Error("Unauthorized");

    const inv = await prisma.$queryRawUnsafe(
        `SELECT * FROM "invitation" WHERE "id" = $1 AND "userId" = $2`,
        id,
        session.user.id
    ) as any[];

    return inv[0] || null;
}

export async function submitRSVP(invitationId: string, data: { name: string, total: number, status: string }) {
    // Check if invitation exists to avoid Foreign Key error (especially in preview)
    const invitation = await prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!invitation) {
        console.warn(`RSVP ignored: Invitation ${invitationId} not found (might be preview)`);
        return { success: true };
    }

    const p = prisma as any;
    const model = p.rSVP || p.RSVP;
    if (!model) throw new Error("Model RSVP tidak ditemukan");
    await model.create({ data: { ...data, invitationId } });
    return { success: true };
}

export async function submitWish(invitationId: string, data: { name: string, message: string }) {
    // Check if invitation exists to avoid Foreign Key error (especially in preview)
    const invitation = await prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!invitation) {
        console.warn(`Wish ignored: Invitation ${invitationId} not found (might be preview)`);
        return { success: true };
    }

    const p = prisma as any;
    const model = p.wish || p.Wish;
    if (!model) throw new Error("Model Wish tidak ditemukan");
    await model.create({ data: { ...data, invitationId } });
    return { success: true };
}

export async function getWishes(invitationId: string) {
    const p = prisma as any;
    const model = p.wish || p.Wish;
    if (!model) return [];
    return await model.findMany({
        where: { invitationId },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getRSVPs(invitationId: string) {
    const p = prisma as any;
    const model = p.rSVP || p.RSVP;
    if (!model) return [];
    return await model.findMany({
        where: { invitationId },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getInvitationsByUserId(userId: string) {
    return await prisma.invitation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getMyInvitations() {
    const session = await getServerSession();

    if (!session) throw new Error("Unauthorized");

    return await prisma.invitation.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getGuests(invitationId: string) {
    const p = prisma as any;
    const model = p.guest || p.Guest;
    if (!model) return [];
    return await model.findMany({
        where: { invitationId },
        orderBy: { createdAt: 'desc' }
    });
}

export async function addGuest(invitationId: string, data: { name: string, phoneNumber?: string }) {
    const p = prisma as any;
    const model = p.guest || p.Guest;
    if (!model) throw new Error("Model Guest tidak ditemukan");
    return await model.create({
        data: {
            ...data,
            invitationId
        }
    });
}

export async function addGuestsBulk(invitationId: string, guests: { name: string, phoneNumber?: string }[]) {
    const p = prisma as any;
    const model = p.guest || p.Guest;
    if (!model) throw new Error("Model Guest tidak ditemukan");
    
    // Prisma createMany might not be supported on all providers (like SQLite in some versions)
    // but db push worked so it should be fine. However, SQLite doesn't support createMany.
    // Let's do it in a transaction or loop for compatibility.
    const results = [];
    for (const guest of guests) {
        const res = await model.create({
            data: {
                ...guest,
                invitationId
            }
        });
        results.push(res);
    }
    return results;
}

export async function deleteGuest(id: string) {
    const p = prisma as any;
    const model = p.guest || p.Guest;
    if (!model) throw new Error("Model Guest tidak ditemukan");
    return await model.delete({
        where: { id }
    });
}

export async function deleteInvitation(id: string) {
    const session = await getServerSession();

    if (!session) throw new Error("Unauthorized");

    // Ensure the user owns this invitation
    const invitation = await prisma.invitation.findUnique({
        where: { id, userId: session.user.id }
    });

    if (!invitation) throw new Error("Invitation not found or unauthorized");

    await prisma.invitation.delete({
        where: { id }
    });

    return { success: true };
}
import { headers } from 'next/headers';

export async function incrementInvitationViews(slug: string) {
    try {
        const head = await headers();
        const ua = head.get('user-agent') || "";
        const ip = head.get('x-forwarded-for')?.split(',')[0] || head.get('x-real-ip') || "unknown";
        
        // Simple Device Detection
        let deviceType = "Desktop";
        if (/mobile/i.test(ua)) deviceType = "Mobile";
        else if (/tablet/i.test(ua)) deviceType = "Tablet";

        // Find invitation ID using raw query for reliability
        const invitations = await (prisma as any).$queryRawUnsafe(
            `SELECT "id" FROM "invitation" WHERE "slug" = $1`,
            slug
        ) as any[];
        
        const inv = invitations[0];
        if (!inv) return;

        // Unique Visitor Logic: Check if same IP visited this invitation in the last 30 minutes
        const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        const recentVisits = await (prisma as any).$queryRawUnsafe(`
            SELECT "id" FROM "visit_log" 
            WHERE "invitationId" = $1 AND "ipAddress" = $2 AND "createdAt" >= $3
            LIMIT 1
        `, inv.id, ip, thirtyMinsAgo) as any[];

        const recentVisit = recentVisits[0];

        if (!recentVisit) {
            // Increment views count
            await (prisma as any).$executeRawUnsafe(
                `UPDATE "invitation" SET "views" = COALESCE("views", 0) + 1 WHERE "id" = $1`,
                inv.id
            );

            // Create detailed log
            const logId = Math.random().toString(36).substring(2, 15);
            await (prisma as any).$executeRawUnsafe(
                `INSERT INTO "visit_log" ("id", "invitationId", "ipAddress", "userAgent", "deviceType", "createdAt") VALUES ($1, $2, $3, $4, $5, $6)`,
                logId,
                inv.id,
                ip,
                ua,
                deviceType,
                new Date().toISOString()
            );
        }
    } catch (error) {
        console.error("Tracking Error:", error);
    }
}
