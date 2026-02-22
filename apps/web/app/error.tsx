"use client";

import { Button } from "@workspace/ui/components/button";

export default function Error({ reset }: { reset: () => void }) {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Error</h1>
      <Button onClick={reset}>Retry</Button>
    </div>
  );
}
