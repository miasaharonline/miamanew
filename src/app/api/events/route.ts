import { NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const startDate = url.searchParams.get("start_date");
  const endDate = url.searchParams.get("end_date");

  let query = supabase
    .from("events")
    .select("*")
    .eq("user_id", session.session.user.id)
    .order("start_time", { ascending: true });

  if (startDate) {
    query = query.gte("start_time", startDate);
  }

  if (endDate) {
    query = query.lte("start_time", endDate);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Set default call_type if not provided
    if (!body.call_type) {
      body.call_type = "phone_call";
    }

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          ...body,
          user_id: session.session.user.id,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ event: data[0] });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
