"use client";

import { useMemo, useState } from "react";

type SkillFocus =
  | "Speaking"
  | "Grammar"
  | "Reading"
  | "Writing"
  | "Listening"
  | "Vocabulary";

type Proficiency = "Beginner" | "Elementary" | "Intermediate" | "Advanced";

type TeachingStyle = "Interactive" | "Exam-focused" | "Communicative" | "Basic";

type LessonPlan = {
  title: string;
  summary: string;
  objectives: string[];
  warmUp: string;
  mainActivity: string;
  practice: string;
  assessment: string;
  homework: string;
};

type TemplateKey = "custom" | "speaking" | "grammar" | "vocabulary";

type TemplateConfig = {
  key: TemplateKey;
  title: string;
  description: string;
  topic: string;
  skillFocus: SkillFocus;
  gradeLevel: string;
  duration: string;
  proficiency: Proficiency;
  teachingStyle: TeachingStyle;
  goal: string;
  notes: string;
};

const templates: TemplateConfig[] = [
  {
    key: "speaking",
    title: "Speaking lesson",
    description: "Phù hợp cho tiết nói, hoạt động cặp đôi, giao tiếp ngắn.",
    topic: "Daily routines",
    skillFocus: "Speaking",
    gradeLevel: "Lớp 6",
    duration: "45",
    proficiency: "Elementary",
    teachingStyle: "Communicative",
    goal:
      "Học sinh có thể nói ngắn gọn về thói quen hàng ngày và hỏi đáp với bạn cùng lớp.",
    notes: "Ưu tiên pair work, speaking prompts, hoạt động trao đổi nhanh.",
  },
  {
    key: "grammar",
    title: "Grammar lesson",
    description: "Phù hợp cho tiết dạy cấu trúc, ví dụ và controlled practice.",
    topic: "Simple present tense",
    skillFocus: "Grammar",
    gradeLevel: "Lớp 7",
    duration: "45",
    proficiency: "Elementary",
    teachingStyle: "Basic",
    goal:
      "Học sinh hiểu và sử dụng được thì hiện tại đơn trong câu khẳng định và phủ định.",
    notes: "Nên có ví dụ rõ ràng, bài tập ngắn, kiểm tra nhanh cuối giờ.",
  },
  {
    key: "vocabulary",
    title: "Vocabulary lesson",
    description: "Phù hợp cho tiết từ vựng, luyện nhớ từ, áp dụng vào ngữ cảnh.",
    topic: "Food and drinks",
    skillFocus: "Vocabulary",
    gradeLevel: "Lớp 5",
    duration: "40",
    proficiency: "Beginner",
    teachingStyle: "Interactive",
    goal:
      "Học sinh ghi nhớ và sử dụng được từ vựng cơ bản về đồ ăn và đồ uống.",
    notes: "Ưu tiên flashcards, matching game, repetition và quick quiz.",
  },
];

export default function NewLessonPage() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateKey>("custom");

  const [topic, setTopic] = useState("Food");
  const [skillFocus, setSkillFocus] = useState<SkillFocus>("Speaking");
  const [gradeLevel, setGradeLevel] = useState("Lớp 6");
  const [duration, setDuration] = useState("45");
  const [proficiency, setProficiency] = useState<Proficiency>("Elementary");
  const [teachingStyle, setTeachingStyle] =
    useState<TeachingStyle>("Interactive");
  const [goal, setGoal] = useState(
    "Học sinh có thể nói về món ăn yêu thích và hỏi đáp đơn giản về sở thích ăn uống."
  );
  const [notes, setNotes] = useState(
    "Lớp đông, ưu tiên hoạt động cặp đôi và trò chơi ngắn."
  );

  const [generated, setGenerated] = useState<LessonPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const estimatedBlocks = useMemo(() => {
    const total = Number(duration);
    return {
      warmUp: Math.max(5, Math.round(total * 0.15)),
      main: Math.max(15, Math.round(total * 0.45)),
      practice: Math.max(10, Math.round(total * 0.25)),
      assessment: Math.max(5, Math.round(total * 0.15)),
    };
  }, [duration]);

  function applyTemplate(templateKey: TemplateKey) {
    setSelectedTemplate(templateKey);

    if (templateKey === "custom") return;

    const template = templates.find((item) => item.key === templateKey);
    if (!template) return;

    setTopic(template.topic);
    setSkillFocus(template.skillFocus);
    setGradeLevel(template.gradeLevel);
    setDuration(template.duration);
    setProficiency(template.proficiency);
    setTeachingStyle(template.teachingStyle);
    setGoal(template.goal);
    setNotes(template.notes);
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setError("");
    setGenerated(null);

    try {
      const res = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          skillFocus,
          gradeLevel,
          duration,
          proficiency,
          teachingStyle,
          goal,
          notes,
        }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const rawText = await res.text();
        console.error("Non-JSON response:", rawText);
        throw new Error("API không trả về JSON. Kiểm tra route /api/generate-lesson.");
      }

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Không tạo được giáo án.");
      }

      setGenerated(data.lessonPlan);

      const existing = JSON.parse(localStorage.getItem("lessons") || "[]");

      const newLesson = {
        id: crypto.randomUUID(),
        ...data.lessonPlan,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("lessons", JSON.stringify([newLesson, ...existing]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
              Lesson Generator
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              Tạo giáo án
            </h1>
            <p className="mt-2 text-slate-600">
              Chọn template phù hợp hoặc tự nhập để tạo một lesson plan nhanh hơn.
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Preset templates
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Chọn nhanh một mẫu để auto điền form.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {templates.map((template) => {
                  const isActive = selectedTemplate === template.key;

                  return (
                    <button
                      key={template.key}
                      type="button"
                      onClick={() => applyTemplate(template.key)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <div className="text-base font-semibold">
                        {template.title}
                      </div>
                      <p
                        className={`mt-2 text-sm ${
                          isActive ? "text-slate-200" : "text-slate-600"
                        }`}
                      >
                        {template.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate("custom")}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
                >
                  Chuyển về nhập tay
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Thông tin bài học
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Chủ đề bài học">
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    placeholder="Ví dụ: Food"
                  />
                </Field>

                <Field label="Khối lớp">
                  <input
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                    placeholder="Ví dụ: Lớp 6"
                  />
                </Field>

                <Field label="Kỹ năng">
                  <select
                    value={skillFocus}
                    onChange={(e) => setSkillFocus(e.target.value as SkillFocus)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  >
                    <option>Speaking</option>
                    <option>Grammar</option>
                    <option>Reading</option>
                    <option>Writing</option>
                    <option>Listening</option>
                    <option>Vocabulary</option>
                  </select>
                </Field>

                <Field label="Thời lượng">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  >
                    <option value="30">30 phút</option>
                    <option value="40">40 phút</option>
                    <option value="45">45 phút</option>
                    <option value="60">60 phút</option>
                    <option value="90">90 phút</option>
                  </select>
                </Field>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Mức độ và phong cách dạy
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Trình độ học sinh">
                  <select
                    value={proficiency}
                    onChange={(e) =>
                      setProficiency(e.target.value as Proficiency)
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  >
                    <option>Beginner</option>
                    <option>Elementary</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </Field>

                <Field label="Phong cách dạy">
                  <select
                    value={teachingStyle}
                    onChange={(e) =>
                      setTeachingStyle(e.target.value as TeachingStyle)
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  >
                    <option>Interactive</option>
                    <option>Exam-focused</option>
                    <option>Communicative</option>
                    <option>Basic</option>
                  </select>
                </Field>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Mục tiêu bài học
              </h2>
              <div className="mt-4 space-y-4">
                <Field label="Mục tiêu chính">
                  <textarea
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  />
                </Field>

                <Field label="Ghi chú thêm">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              Gợi ý phân bổ thời gian: warm-up {estimatedBlocks.warmUp} phút ·
              hoạt động chính {estimatedBlocks.main} phút · luyện tập{" "}
              {estimatedBlocks.practice} phút · đánh giá {estimatedBlocks.assessment} phút
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="rounded-2xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? "Đang tạo giáo án..." : "Tạo giáo án"}
              </button>

              <button
                onClick={() => {
                  setGenerated(null);
                  setError("");
                }}
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-900 transition hover:bg-slate-100"
              >
                Xóa kết quả
              </button>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
              Lesson Preview
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Kết quả giáo án
            </h2>
            <p className="mt-2 text-slate-600">
              Dùng template để tạo lesson nhanh hơn và nhất quán hơn.
            </p>
          </div>

          {!generated ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              Chọn template hoặc nhập tay, sau đó bấm tạo giáo án để xem kết quả.
            </div>
          ) : (
            <div className="space-y-5">
              <ResultCard title="Tiêu đề bài học">
                <p className="text-slate-700">{generated.title}</p>
              </ResultCard>

              <ResultCard title="Tóm tắt">
                <p className="text-slate-700">{generated.summary}</p>
              </ResultCard>

              <ResultCard title="Mục tiêu">
                <ul className="list-disc space-y-2 pl-5 text-slate-700">
                  {generated.objectives.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ResultCard>

              <ResultCard title="Khởi động">
                <p className="text-slate-700">{generated.warmUp}</p>
              </ResultCard>

              <ResultCard title="Hoạt động chính">
                <p className="text-slate-700">{generated.mainActivity}</p>
              </ResultCard>

              <ResultCard title="Luyện tập">
                <p className="text-slate-700">{generated.practice}</p>
              </ResultCard>

              <ResultCard title="Đánh giá nhanh">
                <p className="text-slate-700">{generated.assessment}</p>
              </ResultCard>

              <ResultCard title="Bài tập về nhà">
                <p className="text-slate-700">{generated.homework}</p>
              </ResultCard>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function ResultCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      {children}
    </div>
  );
}