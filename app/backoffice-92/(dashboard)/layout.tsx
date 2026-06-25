import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSession || !adminSecret || adminSession.value !== adminSecret) {
        redirect('/backoffice-92/login');
    }

    return (
        <div className="admin-theme flex h-screen overflow-hidden">

            <AdminSidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto bg-background p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
