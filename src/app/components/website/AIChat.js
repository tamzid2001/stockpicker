import React, { useState } from 'react';
import { 
  Drawer, IconButton, Box, Avatar, Typography, TextField, List, ListItem, Divider,
  Button, Fab, Badge
} from '@mui/material';
import { Chat, ThumbUp, ThumbDown, Person, SmartToy, Close, Info } from '@mui/icons-material';

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
      }

      // Add the AI response as a separate message
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: aiResponse }
      ]);
    } catch (error) {
      console.error('Error in AI chat:', error);
      setChatMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
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
        <Badge color="primary" variant="dot">
          <Chat />
        </Badge>
      </Fab>

      <Drawer
        anchor="right"
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        sx={{ width: 360, flexShrink: 0 }}
        PaperProps={{ sx: { width: 360, boxShadow: 4 } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <SmartToy />
            </Avatar>
            <Typography variant="h6">StockBot</Typography>
          </Box>
          <IconButton onClick={() => setChatOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider />

        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: '12px', mb: 2 }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Info sx={{ mr: 1 }} />
            <strong>How it works:</strong>
          </Typography>
          <Typography variant="body2">
            StockBot is your AI assistant for stock analysis. Ask questions about stocks, get real-time insights, and understand market trends.
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '60vh', p: 2 }}>
          <List>
            {chatMessages.map((message, index) => (
              <ListItem key={index} alignItems="flex-start">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main', mr: 2 }}>
                    {message.role === 'user' ? <Person /> : <SmartToy />}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {message.role === 'user' ? 'You' : 'StockBot'}
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
        </Box>

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask about stocks..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
            sx={{ mt: 2 }}
          />
          <Button
            onClick={handleChatSubmit}
            color="primary"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Send
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default AIChat;
