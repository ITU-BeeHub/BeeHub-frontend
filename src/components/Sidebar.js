import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';

import BeeIcon from '../assets/icons/bee-icon.png';
import HomeIcon from '../assets/icons/home-icon.png';
import LoginIcon from '../assets/icons/login-icon.png';
import ProfileIcon from '../assets/icons/profile-icon.png';

const Sidebar = ({ open, onClose, expanded, onToggleExpand }) => {
  const menuItems = [
    { text: 'Home', icon: HomeIcon, path: '/' },
    { text: 'Profile', icon: ProfileIcon, path: '/profile' },
    { text: 'Login', icon: LoginIcon, path: '/login' },
    { text: 'Bee Picker', icon: BeeIcon, path: '/beePicker' },
  ];

  const leftPadding = expanded ? '16px' : '5px';

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: expanded ? 240 : 60,
          height: '100%',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          margin: 0,
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <Link to={item.path} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItem
                button
                sx={{
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  paddingLeft: leftPadding,
                  transition: 'padding-left 0.3s',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    marginLeft: expanded ? 0 : '6px',
                    marginRight: expanded ? '16px' : '0px',
                    transition: 'margin-left 0.3s',
                    justifyContent: 'center',
                  }}
                >
                  <img src={item.icon} alt={item.text} style={{ width: 36, height: 36 }} />
                </ListItemIcon>
                {expanded && <ListItemText primary={item.text} />}
              </ListItem>
            </Link>
          ))}
        </List>
        <IconButton onClick={onToggleExpand} style={{ alignSelf: 'center' }}>
          {expanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
