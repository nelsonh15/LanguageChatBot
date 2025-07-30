import React, { useState } from "react";
import { 
  Button,
  Box,
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle,
  TextField,
  FormControl
} from '@mui/material';
import LanguageDropdown from "./LanguageDropdown"

const LanguageDialog = ({ open, onClose, onSubmit }) => {
  const [chatName, setChatName] = useState('');
  const [dropdown1, setdropdown1] = useState('');
  const [dropdown2, setdropdown2] = useState(''); 

  const handleSubmit = () => {
    onSubmit(chatName, dropdown1, dropdown2);
    setChatName('')
    setdropdown1('')
    setdropdown2('')
    onClose();
  };
  const isFormFilled = chatName && dropdown1 && dropdown2;
  
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle align='center'>New Chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a chat name. Then, choose a language you want to speak in, as well as the language you would like a translation to.
          </DialogContentText>
          <TextField required autoFocus margin="dense" id="name" label="Chat Name" fullWidth variant="standard" value={chatName} onChange={(e) => setChatName(e.target.value)}/>
            <Box component="form" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center', mt: 3}}>
              <FormControl required sx={{ m: 1, minWidth: 120 }}>
                <LanguageDropdown label={'Language'} setDropdown={setdropdown1}/>
              </FormControl>
        
              <FormControl required sx={{ m: 1, minWidth: 120 }}>
                <LanguageDropdown label={'Translates to'} setDropdown={setdropdown2}/>
              </FormControl>
            </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isFormFilled}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default LanguageDialog