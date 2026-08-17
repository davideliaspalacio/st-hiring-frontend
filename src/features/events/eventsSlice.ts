import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Event, Paginated } from '../../types/api';

export const PAGE_SIZE = 12;

interface EventsState {
  items: Event[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: EventsState = {
  items: [],
  page: 1,
  pageSize: PAGE_SIZE,
  total: 0,
  totalPages: 1,
  loading: false,
  error: null,
};

/**
 * Relative path on purpose: the Vite dev server proxies /events to the API, so
 * hardcoding an absolute URL would bypass the proxy and trigger CORS.
 */
export const fetchEvents = createAsyncThunk<
  Paginated<Event>,
  number | undefined,
  { rejectValue: string }
>('events/fetch', async (page = 1, { rejectWithValue }) => {
  try {
    const response = await fetch(`/events?page=${page}&pageSize=${PAGE_SIZE}`);

    if (!response.ok) {
      return rejectWithValue(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as Paginated<Event>;
  } catch {
    return rejectWithValue('Could not reach the server');
  }
});

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Paging metadata comes from the response, not from what was requested,
      // so a clamped or corrected page is reflected in the controls.
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unexpected error loading events';
      });
  },
});

export default eventsSlice.reducer;
