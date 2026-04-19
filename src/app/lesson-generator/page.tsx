import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LessonGenerator from "@/components/LessonGenerator";
import TrialExpired from "@/components/TrialExpired";

export const metadata: Metadata = {
  title: "教案產生器 | AIRDA 人工智慧與機器人發展協會",
  description:
    "輸入主題，即時產出完整 18 頁機器人教案大綱。適用於 Matrix Mini R4 感測器教學。",
};

const TRIAL_DAYS = 30;

export default async function LessonGeneratorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/lesson-generator");
  }

  // 計算試用期
  const createdAt = new Date(user.created_at);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, TRIAL_DAYS - diffDays);
  const isExpired = daysLeft <= 0;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Page header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-blue/30 text-accent-blue text-xs mb-6">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
              教案產生器
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              輸入主題，產出
              <span className="text-accent-blue">完整教案</span>
            </h1>
            <p className="mt-4 text-text-secondary max-w-xl mx-auto">
              基於 AIRDA 標準 18 頁教案架構，自動產生涵蓋理論講解、動手實作、
              程式教學與創意挑戰的完整教案大綱。
            </p>

            {/* Trial status */}
            {!isExpired && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                免費試用剩餘 {daysLeft} 天
              </div>
            )}
          </div>

          {/* Content or Paywall */}
          {isExpired ? <TrialExpired /> : <LessonGenerator />}
        </div>
      </main>
      <Footer />
    </>
  );
}
