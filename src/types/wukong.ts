// 孫悟空導師系統 — 共用型別定義

export interface SubsystemStatus {
  id: "jindouyun" | "jingguzhou" | "jingubang";
  name: string;
  description: string;
  status: "online" | "offline" | "warning";
  lastUpdated: string;
  metrics: Record<string, string | number>;
}

export interface RecognitionResult {
  objectId: string;
  label: string;
  confidence: number;
  boundingBox: { x: number; y: number; w: number; h: number };
  timestamp: string;
}

export interface VisionStatus {
  cameraOnline: boolean;
  fps: number;
  resolution: string;
  activeModel: string;
  objectsDetected: number;
  lastFrame: string;
}

export interface FocusMetrics {
  attentionScore: number;
  postureScore: number;
  sessionDuration: number;
  focusHistory: { time: string; score: number }[];
  alerts: { type: string; message: string; timestamp: string }[];
}

export interface EngineeringNote {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  tags: string[];
}

// ── AI 分析結果 ──────────────────────────────

export interface AIAnalysisResult {
  recognized_text: string;
  subject: string;
  difficulty: string;
  question_summary: string;
  solution: string;
  explanation: string;
  key_concepts: string[];
  confidence: number;
  captured_at: string;
  image_path: string;
}

// ── 學習分析 ──────────────────────────────────

export interface AnalyticsData {
  subject_accuracy: Record<string, number>;
  recent_trend: { date: string; correct: number; total: number }[];
  weak_areas: {
    subject: string;
    difficulty: string;
    total: number;
    correct: number;
    accuracy: number;
  }[];
  total_questions: number;
  total_correct: number;
  study_streak_days: number;
}

// ── NotebookLM 內容生成 ─────────────────────

export interface MindMapData {
  central_topic: string;
  branches: {
    label: string;
    color: string;
    children: { label: string; detail: string }[];
  }[];
}

export interface ChartData {
  title: string;
  chart_type: string;
  summary: string;
  concepts: { name: string; importance: number; mastery_tip: string }[];
  relationships: { from: string; to: string; relation: string }[];
  study_priorities: { concept: string; reason: string; priority: string }[];
}

export interface PresentationData {
  title: string;
  subtitle: string;
  slides: {
    slide_number: number;
    title: string;
    content_type: string;
    bullet_points: string[];
    speaker_notes: string;
    visual_suggestion: string;
  }[];
}

export interface QuizData {
  quiz_title: string;
  questions: {
    id: number;
    type: string;
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
    concept_tested: string;
    difficulty: string;
  }[];
}

export interface QuizResultRecord {
  id: string;
  subject: string;
  question_summary: string;
  is_correct: boolean;
  user_answer: string;
  correct_answer: string;
  difficulty: string;
  ai_explanation: string;
  timestamp: string;
}
