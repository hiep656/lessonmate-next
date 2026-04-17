"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  objectives?: string[];
  warmUp?: string;
  mainActivity?: string;
  practice?: string;
  assessment?: string;
  homework?: string;
  createdAt: string;
};

export default function LessonDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("lessons") || "[]") as Lesson[];
    const found = stored.find((item) => item.id === id) || null;
    setLesson(found);
  }, [id]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 2200);

    return () => clearTimeout(timer);
  }, [toast]);

  const fullLessonText = useMemo(() => {
    if (!lesson) return "";

    return [
      `TIÊU ĐỀ: ${lesson.title}`,
      ``,
      `TÓM TẮT:`,
      `${lesson.summary || "Chưa có nội dung."}`,
      ``,
      `MỤC TIÊU BÀI HỌC:`,
      ...(lesson.objectives && lesson.objectives.length > 0
        ? lesson.objectives.map((item, index) => `${index + 1}. ${item}`)
        : ["Chưa có mục tiêu."]),
      ``,
      `KHỞI ĐỘNG:`,
      `${lesson.warmUp || "Chưa có nội dung."}`,
      ``,
      `HOẠT ĐỘNG CHÍNH:`,
      `${lesson.mainActivity || "Chưa có nội dung."}`,
      ``,
      `LUYỆN TẬP:`,
      `${lesson.practice || "Chưa có nội dung."}`,
      ``,
      `ĐÁNH GIÁ:`,
      `${lesson.assessment || "Chưa có nội dung."}`,
      ``,
      `BÀI TẬP VỀ NHÀ:`,
      `${lesson.homework || "Chưa có nội dung."}`,
      ``,
      `THỜI GIAN TẠO: ${
        lesson.createdAt ? new Date(lesson.createdAt).toLocaleString() : ""
      }`,
    ].join("\n");
  }, [lesson]);

  async function handleCopyLesson() {
    if (!fullLessonText) return;

    try {
      await navigator.clipboard.writeText(fullLessonText);
      setToast("Đã copy toàn bộ giáo án");
    } catch {
      setToast("Copy thất bại, hãy thử lại");
    }
  }

  function handlePrint() {
    window.print();
  }

  if (!lesson) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold">Không tìm thấy giáo án</h1>
          <p className="mt-2 text-slate-600">
            Giáo án này có thể đã bị xóa hoặc chưa được lưu.
          </p>

          <Link
            href="/app/history"
            className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 text-white hover:opacity-90"
          >
            Quay lại lịch sử
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl print:max-w-none">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            <p className="text-sm text-slate-500">
              {new Date(lesson.createdAt).toLocaleString()}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              {lesson.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopyLesson}
              className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:opacity-90"
            >
              Copy toàn bộ
            </button>

            <button
              onClick={handlePrint}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 hover:bg-slate-100"
            >
              In / Export PDF
            </button>

            <Link
              href="/app/history"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 hover:bg-slate-100"
            >
              ← Quay lại
            </Link>
          </div>
        </div>

        <div className="mb-8 hidden print:block">
          <h1 className="text-3xl font-bold text-slate-900">{lesson.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {new Date(lesson.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="space-y-5">
          <SectionCard title="Tóm tắt">
            <p className="text-slate-700">{lesson.summary}</p>
          </SectionCard>

          <SectionCard title="Mục tiêu bài học">
            {lesson.objectives && lesson.objectives.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 text-slate-700">
                {lesson.objectives.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500">Chưa có mục tiêu.</p>
            )}
          </SectionCard>

          <SectionCard title="Khởi động">
            <p className="text-slate-700">{lesson.warmUp || "Chưa có nội dung."}</p>
          </SectionCard>

          <SectionCard title="Hoạt động chính">
            <p className="text-slate-700">
              {lesson.mainActivity || "Chưa có nội dung."}
            </p>
          </SectionCard>

          <SectionCard title="Luyện tập">
            <p className="text-slate-700">{lesson.practice || "Chưa có nội dung."}</p>
          </SectionCard>

          <SectionCard title="Đánh giá">
            <p className="text-slate-700">
              {lesson.assessment || "Chưa có nội dung."}
            </p>
          </SectionCard>

          <SectionCard title="Bài tập về nhà">
            <p className="text-slate-700">{lesson.homework || "Chưa có nội dung."}</p>
          </SectionCard>
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg print:hidden">
          {toast}
        </div>
      ) : null}
    </main>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm print:break-inside-avoid print:rounded-none print:border print:shadow-none">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}