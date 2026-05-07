import { Alert, Box } from '@mui/material';

type Feedback = {
  severity: 'success' | 'info';
  message: string;
};

type FeedbackMessageProps = {
  feedback: Feedback | null;
};

export function FeedbackMessage({ feedback }: FeedbackMessageProps) {
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

export type { Feedback };
