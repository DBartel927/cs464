'use client';
import { useState, useEffect } from 'react';
import {
  Box, Button
} from '@mui/material';

import { Dataset, DatasetItem, DatasetMeta } from '@/types/data';
import DatasetSelector from '@/components/DatasetSelector';
import DatasetHeader from '@/components/DatasetHeader';
import FeedbackBox from '@/components/FeedbackBox';
import SortableItemList from '@/components/SortableItemList';
import {
  shuffleItems,
  countCorrectItems,
} from '@/utils/puzzle';

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [shuffledItems, setShuffledItems] = useState<DatasetItem[]>([]);
  const [datasetMeta, setDatasetMeta] = useState<DatasetMeta[]>([])
  const [feedback, setFeedback] = useState<{
    severity: 'success' | 'info';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/titles')
      .then((r: Response) => r.json())
      .then((data: DatasetMeta[]) => setDatasetMeta(data));
  }, []);

  useEffect(() => {
    if (dataset) {
      setShuffledItems(shuffleItems(dataset.items));
      setFeedback(null);
    }
  }, [dataset]);

  useEffect(() => {
    if (datasetMeta.length > selectedIndex) {
      fetch(`/api/data?name=${datasetMeta[selectedIndex].dataset_slug}`)
        .then((r: Response) => r.json())
        .then((data: Dataset) => setDataset(data));
    }
  }, [selectedIndex, datasetMeta]);

  const handleCheckOrder = () => {
    if (dataset) {
      const correctCount = countCorrectItems(shuffledItems, dataset.items);

      if (correctCount === dataset.items.length) {
        setFeedback({
          severity: 'success',
          message: 'Correct! You solved the puzzle.',
        });
      } else {
        setFeedback({
          severity: 'info',
          message: `${correctCount} of ${dataset.items.length} items are in the correct position.`,
        });
      }
    }
  };

  const handleReorder = (newOrder: DatasetItem[]) => {
    setShuffledItems(newOrder);
    setFeedback(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      <DatasetSelector
        selectedIndex={selectedIndex}
        datasetMeta={datasetMeta}
        onChange={setSelectedIndex}
      />

      <Button variant="contained" onClick={handleCheckOrder} sx={{ mb: 2 }}>
        Check Order
      </Button>

      <FeedbackBox feedback={feedback} />

      <DatasetHeader dataset={dataset} />

      <SortableItemList
        items={shuffledItems}
        hasFeedback={feedback !== null}
        onReorder={handleReorder}
      />
    </Box>
  );
}
