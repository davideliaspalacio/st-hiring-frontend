import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Event } from '../../types/api';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
};

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const availableCount = event.availableTicketsCount ?? 0;

  return (
    <Card variant="outlined" sx={{ height: '100%', display: 'flex' }}>
      <CardContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}
      >
        <Typography variant="h6" component="h2" sx={{ lineHeight: 1.3 }}>
          {event.name}
        </Typography>

        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            {formatDate(event.date)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.location ?? 'Location to be announced'}
          </Typography>
        </Stack>

        {/* Clamped so cards in a row keep a consistent height regardless of
            how long the seeded description happens to be. */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.description}
        </Typography>

        <Box sx={{ mt: 'auto', pt: 1 }}>
          <Chip
            size="small"
            color={availableCount > 0 ? 'success' : 'default'}
            variant={availableCount > 0 ? 'filled' : 'outlined'}
            label={
              availableCount > 0
                ? `${availableCount.toLocaleString()} tickets available`
                : 'Sold out'
            }
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCard;
