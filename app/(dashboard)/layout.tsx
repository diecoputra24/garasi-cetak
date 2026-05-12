import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { DashboardClientLayout } from "@/components/DashboardClientLayout";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();

    if (!session) {
        redirect("/login");
    }

    return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
