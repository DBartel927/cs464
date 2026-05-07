import { Card, CardContent, Typography } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Reorder } from 'motion/react';

import { DatasetItem } from '@/types/data';
import { getItemStatus, statusColors } from '@/lib/orderFeedback';

type SortableItemCardProps = {
  item: DatasetItem;
  index: number;
  checked: boolean;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
};

export function SortableItemCard({
  item,
  index,
  checked,
  isDragging,
  onDragStart,
  onDragEnd,
}: SortableItemCardProps) {
  const status = getItemStatus(item, index, checked);

  return (
    <Reorder.Item
      key={item.order}
      value={item}
      as="div"
      style={{ position: 'relative' }}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Card
        variant="outlined"
        sx={{
          cursor: isDragging ? 'grabbing' : 'grab',
          backgroundColor: statusColors[status],
          transition: 'background-color 0.3s ease',
        }}
      >
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
          <DragHandleIcon color="action" />
          <Typography variant="body1">{item.name}</Typography>
        </CardContent>
      </Card>
    </Reorder.Item>
  );
}
