import React, { useState } from "react";
import { List, ListItem, ListItemButton, IconButton, ListItemText, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RenameDialog from './RenameDialog';

interface Chat {
  id: string;
  chat: string;
  language: string;
  translatedLanguage: string;
  messages: any[];
}

interface ChatsProps {
  chats: Record<string, Chat>;
  deleteChatHandler: (chatId: string) => void;
  switchChat: (chatId: string) => void;
  handleNewChatClick: () => void;
  currentChatId: string | null;
  onRenameChat: (chatId: string, newName: string) => void;
}

const Chats = ({ chats, deleteChatHandler, switchChat, handleNewChatClick, currentChatId, onRenameChat }: ChatsProps) => {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleRenameClick = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedChatId(chatId);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = (newName: string) => {
    if (selectedChatId) {
      onRenameChat(selectedChatId, newName);
    }
  };

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
                backgroundColor: chat.id === currentChatId ? '#d3d3d3' : 'transparent',
                '&:hover': {
                  backgroundColor: '#d3d3d3',
                },
              }}>
              <ListItemText primary={chat.chat} />
              <div>
                <IconButton
                  aria-label="edit"
                  size="small"
                  onClick={(e) => handleRenameClick(chat.id, e)}
                  style={{ marginRight: '8px' }}>
                  <EditIcon fontSize="small" style={{ color: "blue" }} />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChatHandler(chat.id);
                  }}>
                  <DeleteIcon fontSize="small" style={{ color: "red" }} />
                </IconButton>
              </div>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {selectedChatId && (
        <RenameDialog
          open={renameDialogOpen}
          currentName={chats[selectedChatId]?.chat || ''}
          onClose={() => setRenameDialogOpen(false)}
          onSubmit={handleRenameSubmit}
        />
      )}
    </>
  );
};

export default Chats;
