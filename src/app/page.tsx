export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 rounded-full border border-slate-200 bg-white px-4 py-1 text-sm text-slate-600 shadow-sm">
          AI lesson planning for teachers
        </span>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
          LessonMate
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Tạo giáo án trong 5–10 phút cho giáo viên, gia sư và người dạy online.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/app/dashboard"
            className="rounded-xl bg-slate-900 px-6 py-3 text-white transition hover:opacity-90"
          >
            Bắt đầu
          </a>
          <a
            href="/app/lessons/new"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-slate-900 transition hover:bg-slate-100"
          >
            Tạo giáo án mẫu
          </a>
        </div>
      </section>
    </main>
  );
}