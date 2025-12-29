import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

import { api } from "../../../lib/api/api";
import { logErrorResponse } from "../_utils/utils";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();

    const url = new URL(request.url);

    const page = Number(url.searchParams.get("page") ?? "1") || 1;
    const perPage = Number(url.searchParams.get("perPage") ?? "12") || 12;

    const search = url.searchParams.get("search") ?? "";
    const tagRaw = url.searchParams.get("tag") ?? "";

   
    const tag = tagRaw === "All" ? "" : tagRaw;

    const res = await api.get("/notes", {
      params: {
        page,
        perPage,
        ...(search ? { search } : {}),
        ...(tag ? { tag } : {}),
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status ?? 500 }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    const res = await api.post("/notes", body, {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status ?? 500 }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
