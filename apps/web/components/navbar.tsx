"use client";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "./auth-provider";
import { Button } from "@workspace/ui/components/button";
import { Link } from "@/i18n/navigation";

export const NavBar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
    { label: "Docs", href: "/docs" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
          >
            Logo
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Button variant="default">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};
