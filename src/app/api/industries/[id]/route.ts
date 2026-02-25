import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

function authorize(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  return verifyToken(token);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { nameEn, nameAr, nameFr, slug, color } = await request.json();

  const industry = await prisma.industry.update({
    where: { id },
    data: { nameEn, nameAr, nameFr, slug, color },
  });
  return NextResponse.json(industry);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const projectCount = await prisma.project.count({ where: { industryId: id } });
  if (projectCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${projectCount} project(s) use this industry` },
      { status: 400 }
    );
  }

  await prisma.industry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
