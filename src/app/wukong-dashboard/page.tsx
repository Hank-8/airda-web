import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import WukongDashboard from "@/components/wukong/WukongDashboard";

export const metadata: Metadata = {
  title: "悟空儀表板 | AIRDA 人工智慧與機器人發展協會",
  description:
    "孫悟空 AI 智慧學習系統 — 視覺辨識、姿態偵測、知識庫管理、學習分析一站式儀表板。",
};

export default async function WukongDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/wukong-dashboard");
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <WukongDashboard />
      </main>
    </>
  );
}
