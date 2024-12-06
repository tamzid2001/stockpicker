// components/NewsOutlet.js

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Grid, Box, CircularProgress } from '@mui/material';

const NewsOutlet = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uuids, setUuids] = useState('');

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuids }),
            });
            const data = await response.json();
            setNews(prevNews => [...prevNews, ...data.data.main.stream]);
            setUuids(data.data.main.pagination.uuids);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNews();
    }, []);

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Latest News
            </Typography>
            <Grid container spacing={3}>
                {news.map((article, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {article.content.thumbnail && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={article.content.thumbnail.resolutions[0].url}
                                    alt={article.content.title}
                                />
                            )}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    {article.content.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {article.content.provider.displayName}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2 }}>
                                <Button 
                                    size="small" 
                                    href={article.content.clickThroughUrl?.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Read More
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <Button variant="contained" onClick={fetchNews} disabled={!uuids}>
                        Load More
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default NewsOutlet;