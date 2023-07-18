import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import { alpha } from '@mui/system';

export default function DropdownMenu({ changeNamespace, namespaces=[] }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
          {namespaces && namespaces.map((namespace) =>
          (
            <MenuItem key={namespace} onClick={(e) => {
              changeNamespace(namespace);
              handleClose();
            }}>
                {namespace}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </Box>
  );
}
