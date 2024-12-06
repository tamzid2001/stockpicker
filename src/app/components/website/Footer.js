// components/Footer.js
import React from 'react';
import { 
  Box, Container, Grid, Typography, Link, IconButton, 
  Divider, useTheme, useMediaQuery 
} from '@mui/material';
import { 
  Facebook, Twitter, LinkedIn, Instagram, 
  Coffee, TrendingUp, Timeline, ChatBubble, 
  Insights, NewReleases, Assessment 
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const sectionLinks = [
    { name: 'Real-Time Analytics', icon: TrendingUp, href: '#analytics' },
    { name: 'Advanced Charting', icon: Timeline, href: '#charting' },
    { name: 'AI Assistant', icon: ChatBubble, href: '#ai-assistant' },
    { name: 'Predictive Insights', icon: Insights, href: '#insights' },
    { name: 'Breaking News', icon: NewReleases, href: '#news' },
    { name: 'Portfolio Analysis', icon: Assessment, href: '#portfolio' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ];

  const legalLinks = [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Security', href: '/security' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-evenly">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Features
            </Typography>
            {sectionLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                color="text.secondary"
                display="flex"
                alignItems="center"
                sx={{ mb: 0.5 }}
              >
                <link.icon sx={{ mr: 1, fontSize: 20 }} />
                {link.name}
              </Link>
            ))}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Company
            </Typography>
            {companyLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                color="text.secondary"
                display="block"
                sx={{ mb: 0.5 }}
              >
                {link.name}
              </Link>
            ))}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                color="text.secondary"
                display="block"
                sx={{ mb: 0.5 }}
              >
                {link.name}
              </Link>
            ))}
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ mb: 2 }}>
              <IconButton aria-label="Facebook" color="primary">
                <Facebook />
              </IconButton>
              <IconButton aria-label="Twitter" color="primary">
                <Twitter />
              </IconButton>
              <IconButton aria-label="LinkedIn" color="primary">
                <LinkedIn />
              </IconButton>
              <IconButton aria-label="Instagram" color="primary">
                <Instagram />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Subscribe to our newsletter for updates and insights.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Stock Analysis Pro. All rights reserved.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Developed by Tamzid Ullah
            </Typography>
          </Grid>
          <Grid item>
            <Link
              href="https://www.buymeacoffee.com/tamzidullah"
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Coffee sx={{ mr: 1 }} />
              Support the Developer
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;