/**
 * 呼叫 FastAPI 後端產生 PPTX 教案並觸發下載
 */

const API_BASE = "https://airda-api-production.up.railway.app";

export async function downloadLessonPPTX(topic: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/generate-lesson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "未知錯誤" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${topic}_教案.pptx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
