// components/AIChat.js

import React, { useState } from 'react';
import { 
  Fab, Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, List, ListItem, ListItemText, Box, Avatar, Typography 
} from '@mui/material';
import { Chat, ThumbUp, ThumbDown, Person, SmartToy } from '@mui/icons-material';

const AIChat = ({ stockData }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState({}); // Track feedback state

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

  const handleFeedback = (index, feedback) => {
    setFeedbackGiven(prev => ({ ...prev, [index]: feedback }));
    console.log(`Feedback for message ${index}: ${feedback}`);
    // Handle feedback logic (e.g., send to server, update state, etc.)
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
        <DialogContent dividers>
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {chatMessages.map((message, index) => (
              <ListItem key={index} alignItems="flex-start">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main', mr: 2 }}>
                    {message.role === 'user' ? <Person /> : <SmartToy />}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {message.role === 'user' ? 'You' : 'AI'}
                    </Typography>
                    <Typography variant="body2">{message.content}</Typography>
                  </Box>
                </Box>
                {message.role === 'assistant' && !feedbackGiven[index] && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleFeedback(index, 'like')}
                    >
                      <ThumbUp />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleFeedback(index, 'dislike')}
                    >
                      <ThumbDown />
                    </IconButton>
                  </Box>
                )}
                {message.role === 'assistant' && feedbackGiven[index] && (
                  <Typography variant="body2" sx={{ mt: 1, color: feedbackGiven[index] === 'like' ? 'green' : 'red' }}>
                    {feedbackGiven[index] === 'like' ? 'You liked this response' : 'You disliked this response'}
                  </Typography>
                )}
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
            sx={{ mt: 2 }}
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
