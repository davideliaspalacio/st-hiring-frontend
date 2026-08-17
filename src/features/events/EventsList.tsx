import { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import EventCard from './EventCard';
import { fetchEvents } from './eventsSlice';

const EventsList = () => {
  const dispatch = useAppDispatch();
  const { items, page, pageSize, total, totalPages, loading, error } =
    useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents(1));
  }, [dispatch]);

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => dispatch(fetchEvents(page))}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  // Only the very first load shows a spinner instead of the grid; later page
  // changes keep the current page visible so the layout does not jump.
  if (loading && items.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress aria-label="Loading events" />
      </Box>
    );
  }

  if (items.length === 0) {
    return <Alert severity="info">No events to show yet.</Alert>;
  }

  const firstOnPage = (page - 1) * pageSize + 1;
  const lastOnPage = Math.min(page * pageSize, total);

  return (
    <Box sx={{ opacity: loading ? 0.6 : 1, transition: 'opacity 150ms' }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {firstOnPage}–{lastOnPage} of {total} events
      </Typography>

      {/* One column on phones, two on tablets, three on desktop. */}
      <Grid container spacing={2}>
        {items.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_event, value) => dispatch(fetchEvents(value))}
            disabled={loading}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default EventsList;
