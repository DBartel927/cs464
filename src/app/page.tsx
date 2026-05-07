'use client';
import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';

import { Dataset, DatasetItem, DatasetMeta } from '@/types/data';
import { countCorrectItems } from '@/lib/orderFeedback';
import { DatasetHeader } from '@/components/Header';
import { DatasetSelector } from '@/components/Selector';
import { Feedback, FeedbackMessage } from '@/components/Feedback';
import { SortableItemList } from '@/components/Itemlist';

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  // const { title, description, items } = datasets[selectedIndex];

  const [shuffledItems, setShuffledItems] = useState<DatasetItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [datasetMeta, setDatasetMeta] = useState<DatasetMeta[]>([]);
  const [checked, setChecked] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    fetch('/api/titles')
      .then((r: Response) => r.json())
      .then((data: DatasetMeta[]) => setDatasetMeta(data));
  }, []);

  useEffect(() => {
    if (dataset) {
      const shuffled = [...dataset.items].sort(() => Math.random() - 0.5);
      setShuffledItems(shuffled);
      setChecked(false);
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
      setChecked(true);

      const correctCount = countCorrectItems(shuffledItems);

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
    setChecked(false);
    setFeedback(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>

      {/* Dropdown */}
      <DatasetSelector
        datasetMeta={datasetMeta}
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      />

      <Button variant="contained" onClick={handleCheckOrder} sx={{ mb: 2 }}>
        Check Order
      </Button>

      <FeedbackMessage feedback={feedback} />

      {/* Title & description from the JSON */}
      <DatasetHeader dataset={dataset} />

      {/* Item cards */}
      <SortableItemList
        items={shuffledItems}
        checked={checked}
        isDragging={isDragging}
        onReorder={handleReorder}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      />
    </Box>
  );
}