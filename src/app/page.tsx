import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME } from "@/lib/auth/constants";

export default async function RootPage() {
  const cookieStore = await cookies();

  if (cookieStore.has(ADMIN_COOKIE_NAME)) {
    redirect("/admin");
  }

  redirect("/login");
}
