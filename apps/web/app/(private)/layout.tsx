import { PrivateProviders } from "@/components/private-provider";

function PrivateLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pl-15 p-3 min-w-5xl max-w-8xl">
        <div className="min-h-screen px-5 py-2">
          <div className="mx-auto">{children}</div>
        </div>
      </div>
    </>
  );
}

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateProviders>
      <PrivateLayoutInner>{children}</PrivateLayoutInner>
    </PrivateProviders>
  );
}
