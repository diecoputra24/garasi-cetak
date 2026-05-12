import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { slug, ...data } = body;

        const invitation = await prisma.invitation.create({
            data: {
                slug: slug || `invitation-${Date.now()}`,
                userId: session.user.id,
                themeId: "default", // Should be passed from UI
                ...data,
                gallery: JSON.stringify(data.gallery || []),
                gifts: JSON.stringify(data.gifts || []),
            }
        });

        return NextResponse.json(invitation);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invitations = await prisma.invitation.findMany({
        where: {
            userId: session.user.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return NextResponse.json(invitations);
}
