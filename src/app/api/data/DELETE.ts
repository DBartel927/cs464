import * as z from "zod";
import { getSupabaseClient } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function DELETE(
  request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const supabase = getSupabaseClient();

  if (slug) {
    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('dataset_slug', slug);

    if (error) {
      return Response.json({ error: "Failed to delete dataset" }, { status: 500 });
    }

    return Response.json({ message: "Dataset deleted successfully" }, { status: 200 });
  }
  return Response.json({ message: "No slug provided" }, { status: 400 });
}
