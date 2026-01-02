import { Sidebar } from "../common/Sidebar";
import { Topbar } from "../common/Topbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 bg-background">{children}</main>
      </div>
    </div>
  );
}
