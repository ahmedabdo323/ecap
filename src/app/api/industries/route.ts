import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const industries = await prisma.industry.findMany({
    orderBy: { nameEn: "asc" },
  });
  return NextResponse.json(industries);
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { nameEn, nameAr, nameFr, slug, color } = await request.json();

  if (!nameEn || !slug) {
    return NextResponse.json({ error: "nameEn and slug are required" }, { status: 400 });
  }

  const existing = await prisma.industry.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "An industry with this slug already exists" }, { status: 409 });
  }

  const industry = await prisma.industry.create({
    data: { nameEn, nameAr: nameAr || "", nameFr: nameFr || "", slug, color: color || "gray" },
  });
  return NextResponse.json(industry, { status: 201 });
}
