import { useState } from 'react';

import {
  Card,
  CardContent,
  Typography,
} from '@mui/material';

import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Reorder } from 'motion/react';

import { DatasetItem } from '@/types/data';
import { getItemStatus, statusColors } from '@/utils/puzzle';

type SortableItemListProps = {
  items: DatasetItem[];
  hasFeedback: boolean;
  onReorder: (newOrder: DatasetItem[]) => void;
};

export default function SortableItemList({
  items,
  hasFeedback,
  onReorder,
}: SortableItemListProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Reorder.Group
      as="div"
      values={items}
      onReorder={onReorder}
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {items.map((item, index) => (
        <Reorder.Item
          key={item.order}
          value={item}
          as="div"
          style={{ position: 'relative' }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        >
          <Card
            variant="outlined"
            sx={{
              cursor: isDragging ? 'grabbing' : 'grab',
              backgroundColor: statusColors[getItemStatus(item, index, hasFeedback)],
              transition: 'background-color 0.3s ease',
            }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
              <DragHandleIcon color="action" />
              <Typography variant="body1">{item.name}</Typography>
            </CardContent>
          </Card>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}