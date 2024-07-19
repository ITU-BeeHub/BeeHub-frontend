import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ textAlign: 'center', py: 2, mt: 'auto', backgroundColor: '#f5f5f5' }}>
      <Typography variant="body1">
        My Footer Content
      </Typography>
    </Box>
  );
}