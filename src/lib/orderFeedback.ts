import { DatasetItem } from '@/types/data';

export type ItemStatus = 'correct' | 'close' | 'wrong' | 'default';

export const statusColors: Record<ItemStatus, string> = {
  correct: '#e6f4ea',
  close: '#fff9e6',
  wrong: '#f0f0f0',
  default: 'white',
};

export function getItemStatus(item: DatasetItem, index: number, checked: boolean): ItemStatus {
  if (!checked) {
    return 'default';
  }

  const diff = Math.abs(item.order - (index + 1));

  if (diff === 0) {
    return 'correct';
  }

  if (diff <= 2) {
    return 'close';
  }

  return 'wrong';
}

export function countCorrectItems(items: DatasetItem[]): number {
  return items.reduce((count, item, index) => {
    return item.order === index + 1 ? count + 1 : count;
  }, 0);
}