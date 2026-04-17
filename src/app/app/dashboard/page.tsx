"use client";

import Link from "next/link";
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

function formatMonthKey(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export default function DashboardPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("lessons") || "[]");
    setLessons(stored);
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}`;

    const thisMonthLessons = lessons.filter(
      (lesson) => formatMonthKey(lesson.createdAt) === currentMonthKey
    );

    const totalObjectives = lessons.reduce((sum, lesson) => {
      return sum + (lesson.objectives?.length || 0);
    }, 0);

    return {
      totalLessons: lessons.length,
      thisMonthLessons: thisMonthLessons.length,
      averageObjectives:
        lessons.length > 0
          ? (totalObjectives / lessons.length).toFixed(1)
          : "0",
    };
  }, [lessons]);

  const recentLessons = useMemo(() => {
    return [...lessons]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [lessons]);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              LessonMate Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Chào mừng bạn quay lại
            </h1>
            <p className="mt-2 text-slate-600">
              Theo dõi hoạt động gần đây và tiếp tục tạo giáo án nhanh hơn.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/lessons/new"
              className="rounded-xl bg-slate-900 px-5 py-3 text-white hover:opacity-90"
            >
              Tạo giáo án mới
            </Link>
            <Link
              href="/app/history"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-900 hover:bg-slate-100"
            >
              Xem lịch sử
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Tổng giáo án"
            value={stats.totalLessons.toString()}
            helper="Tổng số lesson đã được lưu"
          />
          <StatCard
            label="Tạo trong tháng này"
            value={stats.thisMonthLessons.toString()}
            helper="Số lesson được tạo trong tháng hiện tại"
          />
          <StatCard
            label="Mục tiêu trung bình"
            value={stats.averageObjectives}
            helper="Số objective trung bình mỗi lesson"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Giáo án gần đây
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  5 lesson mới nhất của bạn.
                </p>
              </div>

              <Link
                href="/app/history"
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Xem tất cả
              </Link>
            </div>

            {recentLessons.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed bg-slate-50 p-10 text-center text-slate-500">
                Bạn chưa có lesson nào. Hãy tạo lesson đầu tiên để bắt đầu.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {recentLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {lesson.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                          {lesson.summary}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(lesson.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <Link
                        href={`/app/history/${lesson.id}`}
                        className="shrink-0 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Hành động nhanh
              </h2>
              <div className="mt-4 grid gap-3">
                <QuickAction
                  href="/app/lessons/new"
                  title="Tạo giáo án mới"
                  desc="Bắt đầu một lesson mới với form tạo giáo án."
                />
                <QuickAction
                  href="/app/history"
                  title="Mở lịch sử"
                  desc="Xem lại, copy hoặc export lesson đã tạo."
                />
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Gợi ý sử dụng
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Tạo lesson theo từng kỹ năng như Speaking, Grammar, Reading.</li>
                <li>• Dùng History để lưu và tái sử dụng lesson cũ.</li>
                <li>• Copy hoặc Export PDF để dùng ngay trên lớp.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </div>
  );
}

function QuickAction({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
    >
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </Link>
  );
}