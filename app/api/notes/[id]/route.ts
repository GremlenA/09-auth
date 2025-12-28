import { NextResponse } from "next/server";
import { api } from "../../../../lib/api/api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

type Context = {
  params: Promise<{ id: string }>;
};

/* ========= GET NOTE ========= */
export async function GET(_: Request, context: Context) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();

    const res = await api.get(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data },
        { status: error.response?.status ?? 500 }
      );
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/* ========= DELETE NOTE ========= */
export async function DELETE(_: Request, context: Context) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();

    const res = await api.delete(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data },
        { status: error.response?.status ?? 500 }
      );
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/* ========= UPDATE NOTE ========= */
export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const body = await request.json();

    const res = await api.patch(`/notes/${id}`, body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data },
        { status: error.response?.status ?? 500 }
      );
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
