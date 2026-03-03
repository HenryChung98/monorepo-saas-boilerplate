"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showSocial?: boolean;
}

export function AuthCard({ title, description, children, footer, showSocial = false }: AuthCardProps) {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          {showSocial && (
            <div className="mt-4 pt-4 border-t">
              <Button type="button" variant="destructive" onClick={handleGoogleLogin} className="w-full">
                Sign in with Google
              </Button>
            </div>
          )}
        </CardContent>
        {footer && <CardFooter className="flex flex-col gap-2">{footer}</CardFooter>}
      </Card>
    </div>
  );
}