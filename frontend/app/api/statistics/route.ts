export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
// frontend/app/api/statistics/route.ts
import { NextResponse } from "next/server";
import Cookies from "js-cookie" // instala con npm i js-cookie

export async function GET(request: Request) {
    const token = Cookies.get("accessToken");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/statistics`, {
    headers: {
    Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    });

    const data = await response.json();
    return NextResponse.json(data);
}

