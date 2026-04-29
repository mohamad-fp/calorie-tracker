import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <main className="mx-auto max-w-[430px] px-4 pt-4 pb-24">
        {children}
      </main>
      <BottomNav />
    </AuthGuard>
  );
}
