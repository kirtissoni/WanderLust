import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const drawerWidth = 240;
const navItems = ['Home', 'Explore', 'Host', 'About'];

function Navbar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawer = (
    <Box sx={{ textAlign: 'center', height: '100%', backgroundColor: '#fafafa' }}>
      <Typography 
        variant="h6" 
        sx={{ 
          my: 3, 
          color: '#FF385C', 
          fontWeight: 'bold',
          fontSize: '1.5rem'
        }}
      >
        Wanderlust
      </Typography>
      <Divider />
      <List sx={{ px: 2, py: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              sx={{ 
                textAlign: 'left',
                borderRadius: 2,
                '&:hover': { 
                  backgroundColor: '#fff5f7'
                }
              }}
            >
              <ListItemText
                primary={item}
                primaryTypographyProps={{ 
                  style: { 
                    color: '#222', 
                    fontWeight: 500,
                    fontSize: '1rem'
                  } 
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            borderColor: '#FF385C',
            color: '#FF385C',
            textTransform: 'none',
            fontWeight: 600,
            py: 1,
            borderRadius: 2,
            '&:hover': { 
              backgroundColor: '#fff5f7',
              borderColor: '#FF385C'
            },
          }}
        >
          Log In
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#FF385C',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            py: 1,
            borderRadius: 2,
            boxShadow: 'none',
            '&:hover': { 
              backgroundColor: '#E31C5F',
              boxShadow: '0 2px 8px rgba(255, 56, 92, 0.3)'
            },
          }}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <CssBaseline />
      <AppBar
        component="nav"
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #ebebeb',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: '#222'
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              color: '#FF385C',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Wanderlust
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item}
                sx={{
                  color: '#222',
                  fontWeight: 500,
                  textTransform: 'none',
                  px: 2,
                  borderRadius: 3,
                  '&:hover': { 
                    backgroundColor: '#f7f7f7'
                  },
                }}
              >
                {item}
              </Button>
            ))}

            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1 }} />

            <Button
              variant="text"
              sx={{
                color: '#222',
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                borderRadius: 3,
                '&:hover': { 
                  backgroundColor: '#f7f7f7'
                },
              }}
            >
              Log In
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#FF385C',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                borderRadius: 3,
                boxShadow: 'none',
                '&:hover': { 
                  backgroundColor: '#E31C5F',
                  boxShadow: '0 2px 8px rgba(255, 56, 92, 0.3)'
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;