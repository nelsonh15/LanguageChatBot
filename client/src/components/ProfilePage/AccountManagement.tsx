import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const AccountManagement = () => {
  const [openDialog, setOpenDialog] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', email: '' });

  const handleDialogOpen = (dialog) => setOpenDialog(dialog);
  const handleDialogClose = () => setOpenDialog('');
  const handleSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (type) => {
    handleDialogClose();
    switch (type) {
      case 'password':
        handleSnackbar('Password changed (placeholder)', 'success');
        break;
      case 'email':
        handleSnackbar('Email changed (placeholder)', 'success');
        break;
      case 'subscription':
        handleSnackbar('Subscription management opened (placeholder)', 'info');
        break;
      case 'delete':
        handleSnackbar('Account deleted (placeholder)', 'warning');
        break;
      case 'export':
        handleSnackbar('Data exported (placeholder)', 'info');
        break;
      default:
        break;
    }
    setForm({ oldPassword: '', newPassword: '', email: '' });
  };

  return (
    <Grid item xs={12} md={4}>
      <Stack spacing={3}>
        <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' } }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <CreditCardIcon color="info" fontSize="large" />
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight={700}>Subscription / Billing</Typography>
              </Box>
              <Button variant="outlined" color="info" size="small" onClick={() => handleDialogOpen('subscription')}>Manage</Button>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' } }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <DeleteIcon color="error" fontSize="large" />
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight={700}>Delete Account</Typography>
              </Box>
              <Button variant="contained" color="error" size="small" onClick={() => handleDialogOpen('delete')}>Delete</Button>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ boxShadow: 3, borderRadius: 3, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)' } }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <FileDownloadIcon color="success" fontSize="large" />
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight={700}>Export Data</Typography>
              </Box>
              <Button variant="outlined" color="success" size="small" onClick={() => handleDialogOpen('export')}>Export</Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Subscription Plan Dialog */}
      <Dialog open={openDialog === 'subscription'} onClose={handleDialogClose}>
        <DialogTitle>Subscription Plan / Billing Info</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Current Plan: <b>Free</b></Typography>
          <Typography gutterBottom>Renewal Date: --/--/----</Typography>
          <Button variant="outlined" sx={{ mt: 2 }}>Manage Subscription</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={openDialog === 'delete'} onClose={handleDialogClose}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="warning" /> Delete Account
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action is <b>irreversible</b>. Are you sure you want to delete your account?
          </Alert>
          <TextField
            margin="dense"
            label="Enter your password to confirm"
            name="oldPassword"
            type="password"
            fullWidth
            value={form.oldPassword}
            onChange={handleFormChange}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={() => handleSubmit('delete')} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Export Data Dialog */}
      <Dialog open={openDialog === 'export'} onClose={handleDialogClose}>
        <DialogTitle>Export Data</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Download all your data in JSON format.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={() => handleSubmit('export')} variant="contained">Export</Button>
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

export default AccountManagement;