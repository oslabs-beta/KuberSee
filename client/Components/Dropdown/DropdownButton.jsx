import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import { alpha } from '@mui/system';

export default function DropdownMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [namespaces, setNamespaces] = useState([]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchNamespace = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        console.log(data);
        //set the namespace state.
        setNamespaces(data.namespace);
      } catch (error) {
        console.log('Error fetching namespaces', error);
      }
    };
    fetchNamespace();
  }, []);

  return (
    <Box display='flex' justifyContent='center' alignItems='center'>
      <div>
        <Button
          style={{ backgroundColor: alpha('#ffffff', 0.25) }}
          id='fade-button'
          aria-controls={open ? 'fade-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          Namespaces
        </Button>
        <Menu
          id='fade-menu'
          MenuListProps={{
            'aria-labelledby': 'fade-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          {namespaces &&
            namespaces.map((namespace) => (
              <MenuItem key={namespace} onClick={handleClose}>
                {namespace}
              </MenuItem>
            ))}
        </Menu>
      </div>
    </Box>
  );
}
