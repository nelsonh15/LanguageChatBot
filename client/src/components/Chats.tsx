import React, { useState } from "react";
import { List, ListItem, ListItemButton, IconButton, ListItemText, Button, TextField, Menu, MenuItem, ListItemAvatar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RenameDialog from './RenameDialog';
import LanguageAvatar from './LanguageAvatar';

interface Chat {
  id: string;
  chat: string;
  language: string;
  translatedLanguage: string;
  messages: Array<{
    addedAt: {
      seconds: number;
      nanoseconds: number;
    };
    content: string;
    role: string;
  }>;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuChatId, setMenuChatId] = useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, chatId: string) => {
    event.stopPropagation();
    setMenuChatId(chatId);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuChatId(null);
  };

  const handleRenameClick = () => {
    if (menuChatId) {
      setSelectedChatId(menuChatId);
      setRenameDialogOpen(true);
      handleMenuClose();
    }
  };

  const handleDeleteClick = () => {
    if (menuChatId) {
      deleteChatHandler(menuChatId);
      handleMenuClose();
    }
  };

  const handleRenameSubmit = (newName: string) => {
    if (selectedChatId) {
      onRenameChat(selectedChatId, newName);
    }
  };

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    try {
      const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
      return date.toLocaleDateString();
    } catch (error) {
      return 'Date unavailable';
    }
  };

  const filteredChats = Object.values(chats).filter(chat =>
    chat.chat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Button variant="contained" onClick={handleNewChatClick}> New Chat </Button>
      <TextField
        fullWidth
        size="small"
        placeholder="Search chats..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ margin: '10px 0' }}
      />
      <List>
        {filteredChats.reverse().map((chat) => (
          <ListItem
            key={chat.id}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="more"
                onClick={(e) => handleMenuOpen(e, chat.id)}
                size="small"
              >
                <MoreVertIcon />
              </IconButton>
            }
          >
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
              <ListItemAvatar>
                <LanguageAvatar
                  primaryLanguage={chat.language}
                  translatedLanguage={chat.translatedLanguage}
                />
              </ListItemAvatar>
              <ListItemText
                primary={chat.chat}
                secondary={chat.messages.length > 0
                  ? `Last modified on ${formatDate(chat.messages[chat.messages.length - 1].addedAt)}`
                  : 'No messages yet'
                }
                sx={{
                  '& .MuiListItemText-secondary': {
                    fontSize: '0.75rem',
                    color: 'text.secondary'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleRenameClick}>
          <EditIcon fontSize="small" style={{ marginRight: '8px', color: "blue" }} />
          Rename
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon fontSize="small" style={{ marginRight: '8px', color: "red" }} />
          Delete
        </MenuItem>
      </Menu>
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
