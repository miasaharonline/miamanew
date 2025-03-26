import { NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", session.session.user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ event: data });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // First check if the event belongs to the user
    const { data: existingEvent } = await supabase
      .from("events")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", session.session.user.id)
      .single();

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("events")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", session.session.user.id)
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();

  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // First check if the event belongs to the user
  const { data: existingEvent } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", session.session.user.id)
    .single();

  if (!existingEvent) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", params.id)
    .eq("user_id", session.session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
