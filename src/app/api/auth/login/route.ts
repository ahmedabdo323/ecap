import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !verifyPassword(password, admin.password)) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = signToken({ id: admin.id, email: admin.email });
  return NextResponse.json({ token, name: admin.name });
}
