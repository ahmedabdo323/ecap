import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const industryId = searchParams.get("industryId") || "";
  const countryId = searchParams.get("countryId") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "6");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (search) {
    where.OR = [
      { nameEn: { contains: search } },
      { nameAr: { contains: search } },
      { nameFr: { contains: search } },
      { descEn: { contains: search } },
      { website: { contains: search } },
      { country: { nameEn: { contains: search } } },
      { country: { nameAr: { contains: search } } },
      { industry: { nameEn: { contains: search } } },
      { industry: { nameAr: { contains: search } } },
    ];
  }

  if (industryId) {
    where.industryId = industryId;
  }

  if (countryId) {
    where.countryId = countryId;
  }

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: { country: true, industry: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.count({ where }),
  ]);

  return NextResponse.json({
    projects,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { verifyToken } = await import("@/lib/auth");
  const user = verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const body = await request.json();
  const project = await prisma.project.create({
    data: body,
    include: { country: true, industry: true },
  });
  return NextResponse.json(project, { status: 201 });
}
