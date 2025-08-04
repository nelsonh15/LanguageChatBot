import React, { useState } from 'react';
import { Grid, Paper, Typography, Stack, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { storeUserIssue, storeUserFeature } from '../../firebase';

const FeedbackSupport: React.FC<{ user: any }> = ({ user }) => {
  const [openDialog, setOpenDialog] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [form, setForm] = useState({ issue: '', feature: '' });
  // Remove error state, only use counter

  const CHAR_LIMIT = 300;

  const handleDialogOpen = (dialog: string) => setOpenDialog(dialog);
  const handleDialogClose = () => setOpenDialog('');
  const handleSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'success') => setSnackbar({ open: true, message, severity });
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (type: 'issue' | 'feature') => {
    if (form[type].length > CHAR_LIMIT) {
      return;
    }
    handleDialogClose();
    if (type === 'issue') {
      if (user && form.issue.trim()) {
        await storeUserIssue(user, form.issue);
      }
      handleSnackbar('Issue reported', 'success');
    }
    else if (type === 'feature') {
      if (user && form.feature.trim()) {
        await storeUserFeature(user, form.feature);
      }
      handleSnackbar('Feature suggestion sent', 'success');
    }
    setForm({ ...form, [type]: '' });
  };

  return (
    <Grid item xs={12}>
      <Paper elevation={4} sx={{ mt: 6, borderRadius: 4, background: 'linear-gradient(90deg, #f5f7fa 0%, #c3cfe2 100%)', p: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>Feedback & Support</Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Have an issue or a great idea? Let us know!
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button startIcon={<BugReportIcon />} variant="contained" color="warning" onClick={() => handleDialogOpen('issue')}>Report Issue</Button>
            <Button startIcon={<LightbulbIcon />} variant="outlined" color="primary" onClick={() => handleDialogOpen('feature')}>Suggest Feature</Button>
          </Stack>
        </Box>
      </Paper>

      {/* Report an Issue Dialog */}
      <Dialog open={openDialog === 'issue'} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Report an Issue</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Describe the issue"
            name="issue"
            multiline
            minRows={3}
            fullWidth
            value={form.issue}
            onChange={handleFormChange}
            autoFocus
            helperText={
              <span style={{ color: form.issue.length > CHAR_LIMIT ? 'red' : undefined }}>
                {`${form.issue.length}/${CHAR_LIMIT} characters`}
              </span>
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={() => handleSubmit('issue')}
            variant="contained"
            disabled={form.issue.length === 0 || form.issue.length > CHAR_LIMIT}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Suggest a Feature Dialog */}
      <Dialog open={openDialog === 'feature'} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Suggest a Feature</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Describe your idea"
            name="feature"
            multiline
            minRows={3}
            fullWidth
            value={form.feature}
            onChange={handleFormChange}
            autoFocus
            helperText={
              <span style={{ color: form.feature.length > CHAR_LIMIT ? 'red' : undefined }}>
                {`${form.feature.length}/${CHAR_LIMIT} characters`}
              </span>
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={() => handleSubmit('feature')}
            variant="contained"
            disabled={form.feature.length === 0 || form.feature.length > CHAR_LIMIT}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity as any} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default FeedbackSupport; 