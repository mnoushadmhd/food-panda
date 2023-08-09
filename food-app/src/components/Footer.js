import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import React from 'react'

const Footer = () => {
  return (
    <Box marginTop={5}>
        <AppBar position="relative" color="primary" style={{ zIndex: 5}}>
            <Toolbar>
            <Typography variant="body1" color="inherit">
                © 2023 Food_Panda. All Rights Reserved.
            </Typography>
            </Toolbar>
        </AppBar>
    </Box>

  )
}

export default Footer