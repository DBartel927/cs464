import { Box, Alert } from '@mui/material';

type Feedback = {
  severity: 'success' | 'info';
  message: string;
} | null;

type FeedbackBoxProps = {
  feedback: Feedback;
};

export default function FeedbackBox({ feedback }: FeedbackBoxProps) {
  return (
    <Box sx={{ minHeight: 48, mb: 3 }}>
      {feedback && (
        <Alert severity={feedback.severity}>
          {feedback.message}
        </Alert>
      )}
    </Box>
  );
}