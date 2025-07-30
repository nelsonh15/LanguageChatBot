import React from 'react';
import { Grid, Card, CardContent, Stack, Box, Typography, Chip, LinearProgress, useTheme } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';

const mostActiveDays = ['Monday', 'Thursday'];

const StatsCards = () => {
  const theme = useTheme();
  return (
    <Grid item xs={12} md={8}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: theme.palette.primary.light, color: theme.palette.primary.contrastText, boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CalendarTodayIcon fontSize="large" />
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Date Joined</Typography>
                  <Typography variant="h6" fontWeight={700}>Jan 1, 2023</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: theme.palette.secondary.light, color: theme.palette.secondary.contrastText, boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <AccessTimeIcon fontSize="large" />
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Practice Time</Typography>
                  <Typography variant="h6" fontWeight={700}>12 hrs 34 mins</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: theme.palette.info.light, color: theme.palette.info.contrastText, boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <BarChartIcon fontSize="large" />
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Most Active Days</Typography>
                  <Stack direction="row" spacing={1} mt={0.5}>
                    {mostActiveDays.map(day => (
                      <Chip key={day} label={day} size="small" color="primary" sx={{ bgcolor: 'white', color: theme.palette.primary.main, fontWeight: 700 }} />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* Weekly Goal Progress */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 4, borderRadius: 3, p: 2, background: 'linear-gradient(90deg, #fbc2eb 0%, #a6c1ee 100%)' }}>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={3}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">Weekly Goal Progress</Typography>
                  <LinearProgress variant="determinate" value={60} sx={{ height: 12, borderRadius: 5, mt: 1, mb: 1, background: 'rgba(255,255,255,0.5)' }} />
                  <Typography variant="h6" fontWeight={700}>60% of 5h goal</Typography>
                  <Typography variant="body2" color="text.secondary">Keep going! You're almost there 🎯</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StatsCards; 