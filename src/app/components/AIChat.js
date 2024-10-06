// components/AIChat.js
import React, { useState } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import { Chat } from '@mui/icons-material';

const AIChat = ({ stockData }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const handleChatSubmit = async () => {
    if (!userMessage.trim()) return;
  
    const newUserMessage = { role: 'user', content: userMessage, stockData: stockData };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
  
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...chatMessages, newUserMessage]),
      });
  
      if (!response.body) throw new Error('No response body');
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiResponse += decoder.decode(value);
        setChatMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: aiResponse };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error in AI chat:', error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
  };

  return (
    <>
      <Fab 
        color="secondary" 
        aria-label="chat"
        onClick={() => setChatOpen(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Chat />
      </Fab>

      <Dialog open={chatOpen} onClose={() => setChatOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>AI Assistant</DialogTitle>
        <DialogContent>
          <List>
            {chatMessages.map((message, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={message.role === 'user' ? 'You' : 'AI'}
                  secondary={message.content}
                />
              </ListItem>
            ))}
          </List>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask about stocks..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatOpen(false)}>Close</Button>
          <Button onClick={handleChatSubmit} color="primary">Send</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AIChat;