import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Please sign in first" },
        { status: 401 }
      );
    }

    const { userId, quantities, total } = await request.json();
    console.log(userId, quantities, total);

    const user = await db.query(`SELECT * FROM orders`)
    console.log(user.rows)
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error(err);  // now you can see the actual error
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}