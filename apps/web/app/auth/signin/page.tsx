import { createMetadata } from "@/lib/metadata";
import SignInClient from "./client-component";

export const metadata = createMetadata(
  "/signin",
  "Sign In",
  "Sign in to your account"
);

export default function SignInPage() {
  return <SignInClient />;
}