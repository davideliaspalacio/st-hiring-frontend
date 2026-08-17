import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { Settings } from '../../types/api';

interface SettingsState {
  data: Settings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  savedAt: number | null;
}

const initialState: SettingsState = {
  data: null,
  loading: false,
  saving: false,
  error: null,
  savedAt: null,
};

/**
 * The API answers 400 with { error } when validation fails, so the message is
 * pulled out of the body rather than reporting a bare status code.
 */
const readError = async (response: Response, fallback: string) => {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? fallback;
  } catch {
    return fallback;
  }
};

export const fetchSettings = createAsyncThunk<
  Settings,
  void,
  { rejectValue: string }
>('settings/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/settings');

    if (!response.ok) {
      return rejectWithValue(
        await readError(response, `Request failed with status ${response.status}`),
      );
    }

    return (await response.json()) as Settings;
  } catch {
    return rejectWithValue('Could not reach the server');
  }
});

export const saveSettings = createAsyncThunk<
  Settings,
  Settings,
  { rejectValue: string }
>('settings/save', async (settings, { rejectWithValue }) => {
  try {
    const response = await fetch('/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      return rejectWithValue(
        await readError(response, `Request failed with status ${response.status}`),
      );
    }

    return (await response.json()) as Settings;
  } catch {
    return rejectWithValue('Could not reach the server');
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    dismissFeedback: (state) => {
      state.error = null;
      state.savedAt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unexpected error loading settings';
      })
      .addCase(saveSettings.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.savedAt = null;
      })
      // Storing the response rather than the submitted values keeps the form in
      // sync with what the server actually persisted.
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload;
        state.savedAt = Date.now();
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? 'Unexpected error saving settings';
      });
  },
});

export const { dismissFeedback } = settingsSlice.actions;

export default settingsSlice.reducer;
