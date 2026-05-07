import { Reorder } from 'motion/react';
import { DatasetItem } from '@/types/data';
import { SortableItemCard } from './Cardlogic';

type SortableItemListProps = {
  items: DatasetItem[];
  checked: boolean;
  isDragging: boolean;
  onReorder: (items: DatasetItem[]) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
};

export function SortableItemList({
  items,
  checked,
  isDragging,
  onReorder,
  onDragStart,
  onDragEnd,
}: SortableItemListProps) {
  return (
    <Reorder.Group
      as="div"
      values={items}
      onReorder={onReorder}
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {items.map((item, index) => (
        <SortableItemCard
          key={item.order}
          item={item}
          index={index}
          checked={checked}
          isDragging={isDragging}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </Reorder.Group>
  );
}
