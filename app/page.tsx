import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to dashboard home
  redirect("/dashboard")
}
