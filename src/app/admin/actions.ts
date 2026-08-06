"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export type ActionResponse = {
  error?: string;
  success?: boolean;
};

export async function loginAction(formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Double check that the user has an administrative role before letting them in
  if (data.user) {
    const { data: profile } = (await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single()) as { data: { role: string } | null };

    const isAuthorized = profile && (profile.role === "admin" || profile.role === "viewer");

    if (!isAuthorized) {
      await supabase.auth.signOut();
      return { error: "Access denied. Administrative privileges are required." };
    }
  }

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
