import { Spinner } from "@workspace/ui/components/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-4">
      <Spinner /> Loading...
    </div>
  );
}
