import * as z from "zod";
import { getSupabaseClient } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const supabase = getSupabaseClient();
    
    // 1. Use .partial() so Zod doesn't complain about missing fields
    const PartialData = Data.partial();
    const body = PartialData.parse(await request.json());

    // If the body is empty, return early
    if (Object.keys(body).length === 0) {
      return Response.json({ error: "No update fields provided" }, { status: 400 });
    }

    // 2. Fetch the current dataset ID first (needed for item updates)
    const { data: existingDataset, error: findError } = await supabase
      .from('datasets')
      .select('id')
      .eq('dataset_slug', slug)
      .single();

    if (findError || !existingDataset) {
      return Response.json({ error: "Dataset not found" }, { status: 404 });
    }

    const datasetId = existingDataset.id;

    // 3. Update Dataset Fields
    // We only update fields present in the request body
    const datasetUpdates: any = {
      updated_at: new Date().toISOString(),
    };
    if (body.slug) datasetUpdates.dataset_slug = body.slug;
    if (body.title) datasetUpdates.title = body.title;
    if (body.description !== undefined) datasetUpdates.description = body.description;

    const { error: updateError } = await supabase
      .from('datasets')
      .update(datasetUpdates)
      .eq('id', datasetId);

    if (updateError) return Response.json({ error: "Update failed" }, { status: 500 });

    // 4. Update Items (only if 'items' was included in the PATCH body)
    if (body.items) {
      // Validate unique order
      const orderSet = new Set(body.items.map(i => i.order));
      if (orderSet.size !== body.items.length) {
        return Response.json({ error: "Item order values must be unique" }, { status: 400 });
      }

      // Clear existing items and re-insert (Standard sync strategy)
      await supabase.from('dataset_items').delete().eq('dataset_id', datasetId);
      
      const itemsToInsert = body.items.map(item => ({
        dataset_id: datasetId,
        item_name: item.name,
        item_order: item.order,
      }));

      const { error: itemsError } = await supabase
        .from('dataset_items')
        .insert(itemsToInsert);

      if (itemsError) return Response.json({ error: "Failed to update items" }, { status: 500 });
    }

    return Response.json({ message: "Dataset patched successfully" });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.flatten() }, { status: 400 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
