import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ModernFloralRedTemplate from "./templates/ModernFloralRed";
import BlueModernFloralTemplate from "./templates/BlueModernFloral";
import BiruMudaFloralTemplate from "./templates/BiruMudaFloral";
import SoftFloralPinkTemplate from "./templates/SoftFloralPink";
import { getWishes, incrementInvitationViews } from "@/app/actions/invitation";

export const dynamic = "force-dynamic";

export default async function InvitationPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    
    // Auto-increment views on load
    await incrementInvitationViews(slug);
    
    // Gunakan raw query agar kolom story dan musicUrl terbaca (bypass Prisma Client out-of-sync)
    const invitations = await prisma.$queryRawUnsafe(
        `SELECT * FROM "invitation" WHERE "slug" = $1`,
        slug
    ) as any[];

    const invitation = invitations[0];

    if (!invitation) return notFound();

    // Fetch real wishes
    const wishes = await getWishes(invitation.id);

    // Map database data to template props with fallbacks
    const data = {
        id: invitation.id,
        brideName: invitation.brideName || "",
        brideShort: invitation.brideShort || "",
        brideInstagram: invitation.brideInstagram || "",
        brideImage: invitation.brideImage || "",
        groomName: invitation.groomName || "",
        groomShort: invitation.groomShort || "",
        groomInstagram: invitation.groomInstagram || "",
        groomImage: invitation.groomImage || "",
        brideParents: invitation.brideParents || "",
        groomParents: invitation.groomParents || "",
        akadDate: invitation.akadDate,
        akadTime: invitation.akadTime || "",
        akadPlace: invitation.akadPlace || "",
        akadAddress: invitation.akadAddress || "",
        akadMaps: invitation.akadMaps || "",
        resepsiDate: invitation.resepsiDate,
        resepsiTime: invitation.resepsiTime || "",
        resepsiPlace: invitation.resepsiPlace || "",
        resepsiAddress: invitation.resepsiAddress || "",
        resepsiMaps: invitation.resepsiMaps || "",
        gallery: JSON.parse(invitation.gallery || "[]") as string[],
        gifts: JSON.parse(invitation.gifts || "[]") as any[],
        wishes: wishes.map((w: any) => ({
            name: w.name,
            message: w.message,
            time: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(w.createdAt)
        })),
        musicUrl: invitation.musicUrl || "",
        story: typeof invitation.story === 'string' ? invitation.story : JSON.stringify(invitation.story || [])
    };

    // Render based on theme
    if (invitation.themeId === "soft-floral-pink") {
        return <SoftFloralPinkTemplate data={data} />;
    }

    if (invitation.themeId === "blue-modern-floral") {
        return <BlueModernFloralTemplate data={data} />;
    }

    if (invitation.themeId === "biru-muda-floral") {
        return <BiruMudaFloralTemplate data={data} />;
    }

    // Default to Modern Floral Red
    return <ModernFloralRedTemplate data={data} />;
}
