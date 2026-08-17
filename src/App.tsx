import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import EventsList from './features/events/EventsList';
import SettingsForm from './features/settings/SettingsForm';

// No router is installed and the brief rules out new dependencies, so the two
// views are switched with tabs rather than routes.
const TABS = [
  { label: 'Events', panel: <EventsList /> },
  { label: 'Settings', panel: <SettingsForm /> },
];

const App = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="h1">
            See Tickets
          </Typography>
        </Toolbar>

        <Tabs
          value={activeTab}
          onChange={(_event, value: number) => setActiveTab(value)}
          variant="fullWidth"
          sx={{ borderTop: 1, borderColor: 'divider' }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.label} label={tab.label} />
          ))}
        </Tabs>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Both panels stay mounted so switching tabs does not refetch, but
            only the active one is visible. */}
        {TABS.map((tab, index) => (
          <Box key={tab.label} hidden={activeTab !== index}>
            {tab.panel}
          </Box>
        ))}
      </Container>
    </Box>
  );
};

export default App;
