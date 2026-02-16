import { createMetadata } from "@/lib/metadata";
import SignUpClient from "./client-component";

export const metadata = createMetadata(
  "/signup",
  "Sign Up",
  "Create a new account"
);

export default function SignUpPage() {
  return <SignUpClient />;
}