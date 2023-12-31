import React from "react";
import { List, ListItem, ListItemButton, IconButton, ListItemText, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const Chats = ({ chats, deleteChatHandler, switchChat, handleNewChatClick, currentChatId }) => {
  return (
    <>
      <Button variant="contained" onClick={handleNewChatClick}> New Chat </Button>
      <List>
        {Object.values(chats).reverse().map((chat) => (
          <ListItem key={chat.id} disablePadding>
            <ListItemButton 
              onClick={() => switchChat(chat.id)} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                height: '69px',
                backgroundColor: chat.id === currentChatId ? '#d3d3d3' : 'transparent', // Conditional background color
                '&:hover': {
                  backgroundColor: '#d3d3d3',
                },
              }}>
              <ListItemText primary={chat.chat} />
              <IconButton 
                aria-label="delete" 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation(); // Prevents triggering switchChat when clicking the delete icon
                  deleteChatHandler(chat.id);
                }}>
                <DeleteIcon fontSize="small" style={{ color: "red" }} />
              </IconButton>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Chats;
