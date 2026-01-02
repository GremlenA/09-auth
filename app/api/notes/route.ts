import { NextRequest, NextResponse } from "next/server";
import { getNotes, createNote } from "@/lib/api/serverApi";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = searchParams.get("page");
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");

    const data = await getNotes({
      page: page ? Number(page) : undefined,
      search: search ?? undefined,
      tag: tag ?? undefined,
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = await createNote(body);

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to create note" },
      { status: 500 }
    );
  }
}
