import { Sidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div>
        <Sidebar />
        <div className="sm:ml-16 sm:mt-3 ml-2 mt-2">
          {children}
          <Toaster />
        </div>
      </div>
    </AuthProvider>
  );
}
