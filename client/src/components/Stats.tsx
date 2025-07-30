import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Avatar, Chip, Divider, LinearProgress, Stack, Tooltip, IconButton } from '@mui/material';
import { TrendingUp, AccessTime, Language, Forum, VolumeUp, Translate, EmojiEvents, Star, Leaderboard, ArrowUpward, ErrorOutline, CheckCircle, RecordVoiceOver, MenuBook, TrackChanges, EmojiObjects, Flag } from '@mui/icons-material';
// If you have @mui/x-charts installed, you can use real charts. Otherwise, use placeholders.
// import { BarChart, LineChart, PieChart, RadarChart } from '@mui/x-charts';

const placeholderChart = (
  <Box sx={{ height: 120, bgcolor: 'grey.200', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'grey.500', fontSize: 18 }}>
    Chart Placeholder
  </Box>
);

const Stats = () => {
  return (
    <Box sx={{ p: { xs: 1, md: 4 }, bgcolor: 'grey.100', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Language Learning Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {/* 1. Language Learning Overview */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Language Learning Overview</Typography>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Language color="primary" />
                <Typography>Current Language(s): <b>Spanish, French</b></Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <TrendingUp color="success" />
                <Typography>Current Streak: <b>7 days</b></Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <AccessTime color="secondary" />
                <Typography>Daily Practice: <b>25 mins</b></Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <AccessTime color="action" />
                <Typography>Total Time: <b>12 hrs</b></Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <MenuBook color="info" />
                <Typography>Words Learned: <b>320</b></Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* 2. Conversation Metrics */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Conversation Metrics</Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Forum color="primary" />
                  <Typography>Total Conversations: <b>54</b></Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ArrowUpward color="success" />
                  <Typography>Avg. Conversation Length: <b>8 turns</b></Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Language color="secondary" />
                  <Typography>Most Used Language: <b>Spanish</b></Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircle color="info" />
                  <Typography>AI Confidence: <b>92%</b></Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* 3. Vocabulary & Grammar Insights */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Vocabulary & Grammar Insights</Typography>
              <Typography variant="subtitle2">Top New Words This Week</Typography>
              <Stack direction="row" spacing={1} mb={1}>
                <Chip label="viajar" color="primary" />
                <Chip label="comida" color="primary" />
                <Chip label="aprender" color="primary" />
              </Stack>
              <Typography variant="subtitle2">Common Mistakes</Typography>
              <Stack direction="row" spacing={1} mb={1}>
                <Chip icon={<ErrorOutline />} label="Verb tense" color="warning" />
                <Chip icon={<ErrorOutline />} label="Gender agreement" color="warning" />
              </Stack>
              <Typography variant="subtitle2">Suggested Words to Review</Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="negocio" color="default" />
                <Chip label="rápido" color="default" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* 4. Speaking Proficiency */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Speaking Proficiency</Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <RecordVoiceOver color="primary" />
                  <Typography>Speech Clarity: <b>87%</b></Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <VolumeUp color="secondary" />
                  <Typography>Fluency Score: <b>80%</b></Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTime color="action" />
                  <Typography>Speaking Duration: <b>12 min/session</b></Typography>
                </Stack>
                <Typography variant="subtitle2">Confidence Trend</Typography>
                {placeholderChart}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* 5. Translation Usage Insights */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Translation Usage Insights</Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Translate color="primary" />
                  <Typography>Translations Used: <b>18</b></Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <MenuBook color="secondary" />
                  <Typography>Most Translated: <b>"negocio"</b></Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTime color="action" />
                  <Typography>Time Relying on Translation: <b>8 min</b></Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircle color="success" />
                  <Typography>Direct Comprehension: <b>70%</b></Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* 6. Progress & Goals */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Progress & Goals</Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrackChanges color="primary" />
                  <Typography>Weekly Goal: <b>120/150 min</b></Typography>
                </Stack>
                <LinearProgress variant="determinate" value={80} sx={{ height: 8, borderRadius: 5, mb: 1 }} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Flag color="secondary" />
                  <Typography>Level: <b>Intermediate</b></Typography>
                </Stack>
                <Typography variant="subtitle2">Skill Radar</Typography>
                {placeholderChart}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* 7. Recommendations Section */}
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recommendations</Typography>
              <Typography variant="subtitle2">Practice Topics</Typography>
              <Stack direction="row" spacing={1} mb={1}>
                <Chip label="Travel" color="primary" />
                <Chip label="Business" color="primary" />
                <Chip label="Casual" color="primary" />
              </Stack>
              <Typography variant="subtitle2">Grammar Lessons</Typography>
              <Stack direction="row" spacing={1} mb={1}>
                <Chip label="Past Tense" color="secondary" />
                <Chip label="Subjunctive" color="secondary" />
              </Stack>
              <Typography variant="subtitle2">New Vocabulary Themes</Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="Food" color="info" />
                <Chip label="Travel" color="info" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* 8. Engagement & Gamification */}
        <Grid item xs={12} md={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Engagement & Gamification</Typography>
              <Stack direction="row" spacing={2} mb={1}>
                <Tooltip title="7-day streak">
                  <Avatar sx={{ bgcolor: 'warning.main' }}><Star /></Avatar>
                </Tooltip>
                <Tooltip title="100 messages sent">
                  <Avatar sx={{ bgcolor: 'info.main' }}><EmojiEvents /></Avatar>
                </Tooltip>
                <Tooltip title="Leaderboard">
                  <Avatar sx={{ bgcolor: 'success.main' }}><Leaderboard /></Avatar>
                </Tooltip>
              </Stack>
              <Typography variant="subtitle2">Motivational Quote</Typography>
              <Typography fontStyle="italic" color="text.secondary">
                "El éxito es la suma de pequeños esfuerzos repetidos día tras día."
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Stats; 