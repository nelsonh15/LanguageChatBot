import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  TableSortLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { User } from 'firebase/auth';

interface BillingItem {
  id: number;
  itemName: string;
  price: string;
  description: string;
  date: string;
}

interface BillingHistoryProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

const BillingHistory: React.FC<BillingHistoryProps> = ({ open, onClose, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Placeholder billing history data
  const billingHistory: BillingItem[] = [
    { id: 1, itemName: 'Premium Subscription', price: '$9.99', description: 'Monthly premium plan with unlimited translations', date: '2024-01-15' },
    { id: 2, itemName: 'Voice Translation Pack', price: '$4.99', description: 'Advanced voice translation features', date: '2024-01-01' },
    { id: 3, itemName: 'Premium Subscription', price: '$9.99', description: 'Monthly premium plan with unlimited translations', date: '2023-12-15' },
    { id: 4, itemName: 'Language Pack - Spanish', price: '$2.99', description: 'Enhanced Spanish language support and phrases', date: '2023-12-01' },
    { id: 5, itemName: 'Premium Subscription', price: '$9.99', description: 'Monthly premium plan with unlimited translations', date: '2023-11-15' },
    { id: 6, itemName: 'AI Chat Enhancement', price: '$7.99', description: 'Advanced AI conversation features', date: '2023-11-01' },
    { id: 7, itemName: 'Premium Subscription', price: '$9.99', description: 'Monthly premium plan with unlimited translations', date: '2023-10-15' },
    { id: 8, itemName: 'Language Pack - French', price: '$2.99', description: 'Enhanced French language support and phrases', date: '2023-10-01' },
    { id: 9, itemName: 'Premium Subscription', price: '$9.99', description: 'Monthly premium plan with unlimited translations', date: '2023-09-15' },
    { id: 10, itemName: 'Export Data Premium', price: '$1.99', description: 'Premium data export with analytics', date: '2023-09-01' }
  ];

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort function
  const sortData = (data: BillingItem[]) => {
    return [...data].sort((a, b) => {
      let aValue: any = a[sortField as keyof BillingItem];
      let bValue: any = b[sortField as keyof BillingItem];

      // Handle different data types
      if (sortField === 'price') {
        aValue = parseFloat(aValue.replace('$', ''));
        bValue = parseFloat(bValue.replace('$', ''));
      } else if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Filter and sort billing history
  const filteredBillingHistory = sortData(
    billingHistory.filter(item =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleClose = () => {
    setSearchTerm(''); // Reset search when closing
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Billing History</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </Box>
        
        <TableContainer 
          component={Paper} 
          sx={{ 
            maxHeight: 400, 
            border: '1px solid rgba(0, 0, 0, 0.04)',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'itemName'}
                    direction={sortField === 'itemName' ? sortDirection : 'asc'}
                    onClick={() => handleSort('itemName')}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Item Name
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={sortField === 'price'}
                    direction={sortField === 'price' ? sortDirection : 'asc'}
                    onClick={() => handleSort('price')}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'description'}
                    direction={sortField === 'description' ? sortDirection : 'asc'}
                    onClick={() => handleSort('description')}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Description
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={sortField === 'date'}
                    direction={sortField === 'date' ? sortDirection : 'asc'}
                    onClick={() => handleSort('date')}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBillingHistory.length > 0 ? (
                filteredBillingHistory.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {item.itemName}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="success.main" fontWeight={600}>
                        {item.price}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      {searchTerm ? 'No items found matching your search.' : 'No billing history available.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredBillingHistory.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total transactions: {filteredBillingHistory.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total spent: ${filteredBillingHistory.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0).toFixed(2)}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillingHistory;