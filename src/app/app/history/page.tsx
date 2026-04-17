"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function HistoryPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("lessons") || "[]");
    setLessons(stored);
  }, []);

  function handleDelete(id: string) {
    const nextLessons = lessons.filter((lesson) => lesson.id !== id);
    setLessons(nextLessons);
    localStorage.setItem("lessons", JSON.stringify(nextLessons));
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Lịch sử giáo án</h1>
            <p className="mt-2 text-slate-600">
              Xem lại các giáo án bạn đã tạo gần đây.
            </p>
          </div>

          <Link
            href="/app/lessons/new"
            className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:opacity-90"
          >
            Tạo giáo án mới
          </Link>
        </div>

        {lessons.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed bg-white p-10 text-center text-slate-500">
            Chưa có giáo án nào. Hãy tạo bài đầu tiên của bạn.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="rounded-2xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {lesson.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-slate-600">
                      {lesson.summary}
                    </p>

                    <p className="mt-3 text-sm text-slate-400">
                      {new Date(lesson.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/app/history/${lesson.id}`}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
                    >
                      Xem chi tiết
                    </Link>

                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}