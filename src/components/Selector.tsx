import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { DatasetMeta } from '@/types/data';

type DatasetSelectorProps = {
  datasetMeta: DatasetMeta[];
  selectedIndex: number;
  onChange: (selectedIndex: number) => void;
};

export function DatasetSelector({ datasetMeta, selectedIndex, onChange }: DatasetSelectorProps) {
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel>Select a dataset</InputLabel>
      <Select
        value={selectedIndex}
        label="Select a dataset"
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {datasetMeta.map((ds, i) => (
          <MenuItem key={ds.id} value={i}>{ds.title}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
