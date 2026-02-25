import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const countries = await prisma.country.findMany({
    orderBy: { nameEn: "asc" },
  });
  return NextResponse.json(countries);
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { nameEn, nameAr, nameFr, slug } = await request.json();

  if (!nameEn || !slug) {
    return NextResponse.json({ error: "nameEn and slug are required" }, { status: 400 });
  }

  const existing = await prisma.country.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A country with this slug already exists" }, { status: 409 });
  }

  const country = await prisma.country.create({
    data: { nameEn, nameAr: nameAr || "", nameFr: nameFr || "", slug },
  });
  return NextResponse.json(country, { status: 201 });
}
