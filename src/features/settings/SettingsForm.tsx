import { useEffect } from 'react';
import { useFormik } from 'formik';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CURRENCIES, type Settings } from '../../types/api';
import { settingsSchema } from './settingsSchema';
import { dismissFeedback, fetchSettings, saveSettings } from './settingsSlice';

const EMPTY_SETTINGS: Settings = {
  currency: 'USD',
  maxTicketsPerOrder: 10,
  salesEnabled: true,
  supportEmail: '',
};

const SettingsForm = () => {
  const dispatch = useAppDispatch();
  const { data, loading, saving, error, savedAt } = useAppSelector(
    (state) => state.settings,
  );

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const formik = useFormik<Settings>({
    initialValues: data ?? EMPTY_SETTINGS,
    // The initial values arrive from the API after the first render, so the
    // form has to pick them up once the request resolves.
    enableReinitialize: true,
    validationSchema: settingsSchema,
    onSubmit: (values) => {
      dispatch(saveSettings(values));
    },
  });

  if (loading && !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress aria-label="Loading settings" />
      </Box>
    );
  }

  return (
    <Card variant="outlined" sx={{ maxWidth: 720 }}>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Sales settings
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                id="currency"
                name="currency"
                label="Currency"
                value={formik.values.currency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.currency && Boolean(formik.errors.currency)}
                helperText={formik.touched.currency && formik.errors.currency}
              >
                {CURRENCIES.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                id="maxTicketsPerOrder"
                name="maxTicketsPerOrder"
                label="Max tickets per order"
                value={formik.values.maxTicketsPerOrder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.maxTicketsPerOrder &&
                  Boolean(formik.errors.maxTicketsPerOrder)
                }
                helperText={
                  formik.touched.maxTicketsPerOrder &&
                  formik.errors.maxTicketsPerOrder
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="supportEmail"
                name="supportEmail"
                label="Support email"
                value={formik.values.supportEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.supportEmail && Boolean(formik.errors.supportEmail)
                }
                helperText={formik.touched.supportEmail && formik.errors.supportEmail}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    id="salesEnabled"
                    name="salesEnabled"
                    checked={formik.values.salesEnabled}
                    onChange={formik.handleChange}
                  />
                }
                label="Sales enabled"
              />
            </Grid>
          </Grid>

          <Stack spacing={2} sx={{ mt: 3 }}>
            {error && (
              <Alert severity="error" onClose={() => dispatch(dismissFeedback())}>
                {error}
              </Alert>
            )}

            {savedAt && !error && (
              <Alert severity="success" onClose={() => dispatch(dismissFeedback())}>
                Settings saved
              </Alert>
            )}

            <Box>
              <Button
                type="submit"
                variant="contained"
                disabled={saving || !formik.dirty}
              >
                {saving ? 'Saving…' : 'Save settings'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SettingsForm;
