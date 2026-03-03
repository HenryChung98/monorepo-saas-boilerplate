import { createMetadata } from "@/lib/metadata";
import SignInForm from "../_components/signin-form";

export const metadata = createMetadata(
  "/auth/signin",
  "Sign In",
  "Sign in to your account"
);

export default function SignInPage() {
  return <SignInForm />;
}