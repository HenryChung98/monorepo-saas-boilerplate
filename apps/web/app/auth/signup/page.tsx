import { createMetadata } from "@/lib/metadata";
import SignUpForm from "../_components/signup-form";

export const metadata = createMetadata(
  "/auth/signup",
  "Sign Up",
  "Create a new account"
);

export default function SignUpPage() {
  return (
    <SignUpForm />
  );
}