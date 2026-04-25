import { redirect } from "next/navigation";

// Root redirects to feed (middleware handles unauthenticated → /login)
export default function Root() {
  redirect("/feed");
}
