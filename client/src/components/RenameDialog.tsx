import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

interface RenameDialogProps {
  open: boolean;
  currentName: string;
  onClose: () => void;
  onSubmit: (newName: string) => void;
}

const RenameDialog = ({ open, currentName, onClose, onSubmit }: RenameDialogProps) => {
  const [newName, setNewName] = useState(currentName);

  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  const handleSubmit = () => {
    onSubmit(newName);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rename Chat</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Chat Name"
          type="text"
          fullWidth
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenameDialog;
