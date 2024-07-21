import * as React from 'react';
import PropTypes from 'prop-types';
import logo from '../../../assets/logo.png';
import {Link} from 'react-router-dom'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ToggleColorMode from './ToggleColorMode';

const logoStyle = {
  width: '50px',
  cursor: 'pointer',
};

function AppAppBar({ mode, toggleColorMode }) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: 'black', padding: '16px' }}
      >
         <Link to="/">
                <img src={logo} alt="Logo" style={logoStyle} />
            </Link>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          {/* <ToggleColorMode sx={{backgroundColor: 'blue'}} mode={mode} toggleColorMode={toggleColorMode} /> */}
          <Button
            color="primary"
            variant="text"
            size="small"
            component={Link}
            to="/login"
            target="_blank"
          >
            Log in
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="small"
            component={Link}
            to="/signup"
            target="_blank"
          >
            Sign up
          </Button>

                  </Box>
      </Box>
    </div>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;
