import { getSupabaseClient } from '@/lib/supabase'

export async function GET() {
    try {
        const supabase = getSupabaseClient()

        const { data, error } = await supabase
            .from('datasets')
            .select('id, dataset_slug, title')
            .order('dataset_slug', { ascending: true })

        if (error) {
            throw error
        }

        return Response.json({ datasets: data || [] })
    } catch (error) {
        console.error('Database error:', error)
        return Response.json({ error: 'Failed to fetch dataset summaries' }, { status: 500 })
    }
}