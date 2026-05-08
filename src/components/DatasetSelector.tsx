import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

import { DatasetMeta } from '@/types/data';

type DatasetSelectorProps = {
  selectedIndex: number;
  datasetMeta: DatasetMeta[];
  onChange: (index: number) => void;
};

export default function DatasetSelector({
  selectedIndex,
  datasetMeta,
  onChange,
}: DatasetSelectorProps) {
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel>Select a dataset</InputLabel>
      <Select
        value={selectedIndex}
        label="Select a dataset"
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {datasetMeta.map((ds, i) => (
          <MenuItem key={ds.dataset_slug} value={i}>
            {ds.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}