"use client";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/FormField";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" />

      <div className="bg-white rounded-xl border p-5 space-y-6">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">Account</h3>
          <p className="text-sm text-gray-500 mb-4">Manage your account and sign out.</p>
          <Button variant="danger" onClick={handleSignOut}>Sign Out</Button>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-900 mb-1">About</h3>
          <p className="text-sm text-gray-500">
            F&P Civil Project Hub v1.0<br />
            Built with Next.js + Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
