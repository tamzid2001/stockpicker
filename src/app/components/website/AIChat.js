import React, { useState } from 'react';
import { 
  Drawer, IconButton, Box, Avatar, Typography, TextField, List, ListItem, Divider,
  Button, Fab, Badge, Input
} from '@mui/material';
import { Chat, ThumbUp, ThumbDown, Person, SmartToy, Close, Info, AttachFile, Mic } from '@mui/icons-material';

const AIChat = ({ stockData }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChatSubmit = async () => {
    if (!userMessage.trim() && !selectedFile) return;

    const newUserMessage = { role: 'user', content: userMessage, stockData: stockData };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');

    // Prepare form data
    const formData = new FormData();
    formData.append('data', JSON.stringify([...chatMessages, newUserMessage]));
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        body: formData,
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
    } finally {
      setSelectedFile(null); // Reset file after submission
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFeedback = (index, feedback) => {
    setFeedbackGiven(prev => ({ ...prev, [index]: feedback }));
    console.log(`Feedback for message ${index}: ${feedback}`);
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
            StockBot is your AI assistant for stock analysis. Ask questions about stocks, get real-time insights, and understand market trends. You can also upload files or voice notes for further assistance.
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <IconButton component="label">
              <AttachFile />
              <input type="file" hidden onChange={handleFileChange} />
            </IconButton>
            <Button
              onClick={handleChatSubmit}
              color="primary"
              variant="contained"
            >
              Send
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AIChat;
