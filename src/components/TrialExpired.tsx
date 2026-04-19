import { CONTACT_INFO } from "@/lib/constants";

export default function TrialExpired() {
  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold mb-3">免費試用期已結束</h2>
      <p className="text-text-secondary mb-8">
        您的 30 天免費試用已到期。如需繼續使用教案產生器，請聯繫我們升級為付費會員。
      </p>

      <div className="space-y-4">
        <a
          href={`mailto:${CONTACT_INFO.email}?subject=AIRDA 教案產生器 — 升級會員&body=您好，我想了解教案產生器的付費方案。`}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent-blue text-white font-medium text-sm hover:bg-accent-blue-light hover:shadow-[0_0_24px_rgba(37,99,235,0.4)] transition-all duration-300"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
          聯繫升級
        </a>

        <p className="text-sm text-text-tertiary">
          或致電 {CONTACT_INFO.phone}
        </p>
      </div>
    </div>
  );
}
