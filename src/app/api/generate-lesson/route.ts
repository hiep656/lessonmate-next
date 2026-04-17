import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const topic = body.topic || "Food";
  const skill = body.skillFocus || "Speaking";
  const level = body.proficiency || "Elementary";
  const duration = body.duration || "45";

  return NextResponse.json({
    ok: true,
    lessonPlan: {
      title: `${skill} Lesson: ${topic}`,
      summary: `Lesson ${duration} phút giúp học sinh ${level} luyện ${skill} với chủ đề "${topic}".`,
      objectives: [
        `Hiểu từ vựng về ${topic}`,
        `Thực hành ${skill}`,
        `Đạt mục tiêu: ${body.goal}`,
      ],
      warmUp: `Trò chơi đoán từ về ${topic}`,
      mainActivity: `Hoạt động nhóm nói về ${topic}`,
      practice: `Làm bài tập cặp đôi`,
      assessment: `Hỏi nhanh cuối giờ`,
      homework: `Viết 5 câu về ${topic}`,
    },
  });
}