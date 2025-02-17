import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <Sidebar />
        <div className="sm:ml-16 sm:mt-3 ml-2 mt-2">
          {children}
          <Toaster />
        </div>
    </div>
  );
}
