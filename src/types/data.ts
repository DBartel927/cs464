export interface DatasetItem {
    item_name: string
    item_order: number
}

export interface Dataset {
    id: number
    dataset_slug: string
    title: string
    description: string | null
}

export interface DatasetResponse {
    title: string
    description: string
    items: {
        name: string
        order: number
    }[]
}