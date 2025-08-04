import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, CircularProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { deleteUserAccount, exportUserData } from '../../firebase';
import { User } from 'firebase/auth';
import BillingHistory from './BillingHistory';

const AccountManagement = ({ user }: { user: User }) => {
  const [openDialog, setOpenDialog] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', email: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);


  const handleDialogOpen = (dialog) => setOpenDialog(dialog);
  const handleDialogClose = () => setOpenDialog('');
  const handleSnackbar = (message, severity = 'success') => setSnackbar({ open: true, message, severity });
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const downloadJsonFile = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (type) => {
    if (type === 'export') {
      if (!user) {
        handleSnackbar('User not authenticated', 'error');
        handleDialogClose();
        return;
      }

      setIsExporting(true);
      try {
        const userData = await exportUserData(user);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `my-language-chatbot-data-${timestamp}.json`;
        downloadJsonFile(userData, filename);
        handleSnackbar('Data exported successfully!', 'success');
      } catch (error) {
        console.error('Error exporting data:', error);
        handleSnackbar('Failed to export data. Please try again.', 'error');
      } finally {
        setIsExporting(false);
      }
      handleDialogClose();
      return;
    }

    if (type !== 'delete') {
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
        default:
          break;
      }
      setForm({ oldPassword: '', newPassword: '', email: '' });
      return;
    }

    // Handle account deletion
    if (!user) {
      handleSnackbar('User not authenticated', 'error');
      handleDialogClose();
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteUserAccount(user);
      if (success) {
        handleSnackbar('Account successfully deleted. You will be signed out.', 'success');
        // The user will be automatically signed out after account deletion
      } else {
        handleSnackbar('Failed to delete account. Try to login in again.', 'error');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      handleSnackbar('An error occurred while deleting your account. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
      handleDialogClose();
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
                <Typography variant="subtitle1" fontWeight={700}>Billing History</Typography>
              </Box>
              <Button variant="outlined" color="info" size="small" onClick={() => handleDialogOpen('billing')}>View</Button>
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

      {/* Billing History Component */}
      <BillingHistory 
        open={openDialog === 'billing'} 
        onClose={handleDialogClose}
        user={user}
      />

      {/* Delete Account Dialog */}
      <Dialog open={openDialog === 'delete'} onClose={handleDialogClose}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon color="warning" /> Delete Account
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action is <b>irreversible</b>. Deleting your account will permanently delete:
          </Alert>
          <Box sx={{ ml: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>• All your chats and conversations</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• All messages and translations</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• Your settings and preferences</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• Your user profile and account information</Typography>
          </Box>
          <Alert severity="error">
            <b>Are you absolutely sure you want to proceed?</b>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={isDeleting}>Cancel</Button>
          <Button
            onClick={() => handleSubmit('delete')}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Data Dialog */}
      <Dialog open={openDialog === 'export'} onClose={handleDialogClose}>
        <DialogTitle>Export Data</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Download all your data in JSON format, including:</Typography>
          <Box sx={{ ml: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>• All your chats and conversations</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• All messages and translations</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• Your settings and preferences</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• Any feedback or feature requests you've submitted</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>• Your user profile information</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            The data will be downloaded as a JSON file that you can save and view.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={isExporting}>Cancel</Button>
          <Button 
            onClick={() => handleSubmit('export')} 
            variant="contained"
            disabled={isExporting}
            startIcon={isExporting ? <CircularProgress size={20} /> : <FileDownloadIcon />}
          >
            {isExporting ? 'Exporting...' : 'Export'}
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

export default AccountManagement;