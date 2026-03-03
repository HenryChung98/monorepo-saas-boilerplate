import Link from "next/link";
import { Home } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Link href="/" className="flex items-center gap-2 mb-8 text-2xl font-bold hover:opacity-80">
        <Home />
        <span>CRM</span>
      </Link>

      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
