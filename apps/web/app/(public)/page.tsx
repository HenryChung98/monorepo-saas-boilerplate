import HomeClient from "./home-client";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <HomeClient />
      </div>
    </div>
  );
}
