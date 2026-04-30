'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent,
  Select, MenuItem, FormControl, InputLabel,
  Button, Alert, Chip
} from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Reorder } from 'motion/react';

import { Dataset, DatasetItem, DatasetMeta } from '@/types/data';

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dataset, setDataset] = useState<Dataset | null>(null)
  // const { title, description, items } = datasets[selectedIndex];

  const [shuffledItems, setShuffledItems] = useState<DatasetItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [datasetMeta, setDatasetMeta] = useState<DatasetMeta[]>([])
  const [checked, setChecked] = useState(false);
  const [hintItemName, setHintItemName] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    severity: 'success' | 'info',
    message: string
  } | null>(null);

  useEffect(() => {
    fetch("/api/titles")
      .then((r: Response) => r.json())
      .then((data: DatasetMeta[]) => setDatasetMeta(data))
  }, [])

  useEffect(() => {
    if (dataset) {
      const shuffled = [...dataset.items].sort(() => Math.random() - 0.5);
      setShuffledItems(shuffled);
      setFeedback(null);
      setChecked(false);
      setHintItemName(null);
    }

  }, [dataset]);

  useEffect(() => {
    if (datasetMeta.length > selectedIndex){
    fetch(`/api/data?name=${datasetMeta[selectedIndex].dataset_slug}`)
      .then((r: Response) => r.json())
      .then((data: Dataset) => setDataset(data))
    }

  }, [selectedIndex, datasetMeta])

  const getItemFeedback = (item: DatasetItem, index: number) => {
    if (item.order === dataset?.items[index].order) {
      return 'correct';
    }
  const correctIndex = dataset?.items.findIndex((correctItem) => correctItem.order === item.order) ?? -1;
  if (correctIndex !== -1 && Math.abs(correctIndex - index) === 1) {
    return 'close';
  }
  return 'wrong';
};
const getCardColor = (item: DatasetItem, index: number) => {
  if (!checked) {
    return {};
  }

  const result = getItemFeedback(item, index);

  if (result === 'correct') {
    return {
      bgcolor: '#e8f5e9',
      borderColor: '#2e7d32',
    };
  }
  if (result === 'close') {
    return {
      bgcolor: '#fffde7',
      borderColor: '#fbc02d',
    };
  }
  return {
    bgcolor: '#eeeeee',
    borderColor: '#9e9e9e',
    opacity: 0.5,
  };
};

const getHintDirection = (item: DatasetItem, index: number) => {
  const correctIndex = dataset?.items.findIndex((correctItem) => correctItem.order === item.order) ?? -1;

  if (correctIndex === -1 || correctIndex === index) {
    return null;
  }
  return correctIndex < index ? 'up' : 'down';
};

  const handleCheckOrder = () => {
    if (dataset) {
      setChecked(true);
      const correctCount = shuffledItems.reduce((count, item, index) => {
        return item.order === dataset.items[index].order ? count + 1 : count;
      }, 0);

      const incorrectItems = shuffledItems.filter((item, index) => {
        return item.order !== dataset.items[index].order;
      });

      if (incorrectItems.length > 0) {
        const randomIncorrectItem = incorrectItems[Math.floor(Math.random() * incorrectItems.length)];
        setHintItemName(randomIncorrectItem.name);
      } else {
        setHintItemName(null);
      }

      if (correctCount === dataset.items.length) {
        setFeedback({
          severity: 'success',
          message: 'Correct! You solved the puzzle.'
        });
      } else {
        setFeedback({
          severity: 'info',
          message: `${correctCount} of ${dataset.items.length} items are in the correct position.`
        });
      }
    }
  };

  const handleReorder = (newOrder: DatasetItem[]) => {
    setShuffledItems(newOrder);
    setFeedback(null);
    setChecked(false);
    setHintItemName(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>

      {/* Dropdown */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select a dataset</InputLabel>
        <Select
          value={selectedIndex}
          label="Select a dataset"
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
        >
          {datasetMeta.map((ds, i) => (
            <MenuItem key={i} value={i}>{ds.title}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={handleCheckOrder} sx={{ mb: 2 }}>
        Check Order
      </Button>

      <Box sx={{ minHeight: 48, mb: 3 }}>
        {feedback && (
          <Alert severity={feedback.severity}>
            {feedback.message}
          </Alert>
        )}
      </Box>

      {/* Title & description from the JSON */}
      {
        dataset ?
          <>
            <Typography variant="h4" gutterBottom>{dataset.title}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {dataset.description}
            </Typography>
          </>

          :
          <h3> loading... </h3>
      }


      {/* Item cards */}
      <Reorder.Group
        as="div"
        values={shuffledItems}
        onReorder={handleReorder}
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {shuffledItems.map((item, index) => {
          const hintDirection = getHintDirection(item, index);
          const showHint = checked && hintItemName === item.name && hintDirection;
        
        return (
          <Reorder.Item
            key={item.name}
            value={item}
            as="div"
            style={{ position: 'relative' }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
          >
            <Card variant="outlined" sx={{ cursor: isDragging ? 'grabbing' : 'grab', ...getCardColor(item, index), }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '12px !important' }}>
                <DragHandleIcon color="action" />
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                  {item.name}
                </Typography>
                {showHint && (
                  <Chip
                    icon={hintDirection === 'up' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                    label={hintDirection === 'up' ? 'Move up' : 'Move down'}
                    size="small"
                    color="primary"
                  />
                )}
              </CardContent>
            </Card>
          </Reorder.Item>
        );
        })}
      </Reorder.Group>
    </Box>
  );
}