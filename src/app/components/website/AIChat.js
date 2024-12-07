import React, { useState, useEffect } from 'react';
import { 
  Drawer, IconButton, Box, Avatar, Typography, TextField, List, ListItem, Divider,
  Button, Fab, Badge, CircularProgress, InputAdornment, Tooltip
} from '@mui/material';
import { 
  Chat, ThumbUp, ThumbDown, Person, SmartToy, Close, Info, Fullscreen, FullscreenExit, Delete, Send 
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css'; // Import KaTeX CSS for LaTeX rendering

const AIChat = ({ stockData }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatMessages, isAssistantTyping]);

  const handleChatSubmit = async () => {
    if (!userMessage.trim()) return;

    const newUserMessage = { role: 'user', content: userMessage, stockData: stockData };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');

    // Add a placeholder for the assistant's incoming message
    setChatMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    setIsAssistantTyping(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...chatMessages, newUserMessage]),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          // Decode the current chunk in streaming mode
          const chunkValue = decoder.decode(value, { stream: !done });
          if (chunkValue) {
            setChatMessages(prevMessages => {
              const messages = [...prevMessages];
              const lastIndex = messages.length - 1;
              // Append the new chunk to the assistant's last message
              messages[lastIndex] = {
                ...messages[lastIndex],
                content: messages[lastIndex].content + chunkValue,
              };
              return messages;
            });
          }
        }
      }

      // Final flush of the decoder to get any remaining text
      const finalChunk = decoder.decode();
      if (finalChunk) {
        setChatMessages(prevMessages => {
          const messages = [...prevMessages];
          const lastIndex = messages.length - 1;
          messages[lastIndex] = {
            ...messages[lastIndex],
            content: messages[lastIndex].content + finalChunk,
          };
          return messages;
        });
      }

    } catch (error) {
      console.error('Error in AI chat:', error);
      setChatMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsAssistantTyping(false);
    }
  };

  const handleFeedback = (index, feedback) => {
    setFeedbackGiven(prev => ({ ...prev, [index]: feedback }));
    console.log(`Feedback for message ${index}: ${feedback}`);
  };

  const clearChat = () => {
    setChatMessages([]);
    setFeedbackGiven({});
  };

  const chatContent = (
    <>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <SmartToy />
          </Avatar>
          <Typography variant="h6">StockBot</Typography>
        </Box>
        <Box>
          <Tooltip title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}>
            <IconButton onClick={() => setIsFullScreen(!isFullScreen)}>
              {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Close Chat">
            <IconButton onClick={() => setChatOpen(false)}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Divider />

      {/* Info Section */}
      <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: '12px', mb: 2 }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Info sx={{ mr: 1 }} />
          <strong>How it works:</strong>
        </Typography>
        <Typography variant="body2">
          StockBot is your AI assistant for stock analysis. Ask questions about stocks, get real-time insights, and understand market trends.
        </Typography>
      </Box>

      {/* Messages */}
      <Box 
        id="chat-container" 
        sx={{
          overflowY: 'auto',
          maxHeight: isFullScreen ? 'calc(100vh - 250px)' : '80vh',
          p: 2,
          pb: 0
        }}
      >
        <List>
          {chatMessages.map((message, index) => (
            <ListItem key={index} alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main', 
                    mr: 2 
                  }}
                >
                  {message.role === 'user' ? <Person /> : <SmartToy />}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                    {message.role === 'user' ? 'You' : 'StockBot'}
                    {message.role === 'assistant' && index === chatMessages.length - 1 && isAssistantTyping && (
                      <CircularProgress size={16} sx={{ ml: 1 }} />
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box
  sx={{
    bgcolor: message.role === 'user' ? 'primary.light' : 'secondary.light',
    color: 'black',
    p: 2,
    borderRadius: 2,
    width: '100%',
    mb: 1,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxHeight: '40vh',
    overflowY: 'auto'
  }}
>
  <ReactMarkdown
    children={message.content}
    remarkPlugins={[remarkMath]}
    rehypePlugins={[rehypeKatex]}
    components={{
      p: ({ node, ...props }) => (
        <p style={{ margin: 0, padding: 0, lineHeight: '1.4' }} {...props} />
      ),
    }}
  />
</Box>



              {message.role === 'assistant' && !feedbackGiven[index] && !isAssistantTyping && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, width: '100%' }}>
                  <Tooltip title="Like this response">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleFeedback(index, 'like')}
                    >
                      <ThumbUp />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Dislike this response">
                    <IconButton 
                      color="error" 
                      onClick={() => handleFeedback(index, 'dislike')}
                    >
                      <ThumbDown />
                    </IconButton>
                  </Tooltip>
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

      {/* Input Area */}
      <Box sx={{ p: 2, pt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Tooltip title="Clear Chat">
            <IconButton onClick={clearChat}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about stocks..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
          sx={{ mt: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" onClick={handleChatSubmit}>
                  <Send />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
    </>
  );

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

      {isFullScreen && chatOpen ? (
        // Full-Screen Mode
        <Box 
          sx={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            bgcolor: 'background.paper', 
            zIndex: 2000,
            display: 'flex', 
            flexDirection: 'column'
          }}
        >
          {chatContent}
        </Box>
      ) : (
        // Drawer Mode
        <Drawer
          anchor="right"
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          sx={{ width: 360, flexShrink: 0 }}
          PaperProps={{ sx: { width: 360, boxShadow: 4 } }}
        >
          {chatContent}
        </Drawer>
      )}
    </>
  );
};

export default AIChat;
