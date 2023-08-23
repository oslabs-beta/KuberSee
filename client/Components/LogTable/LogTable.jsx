import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

// const VISIBLE_FIELDS = ['headers', 'message'];

export default function LogTable({logs}) {
  const columns = [
    { field: 'header', headerName: 'Header', width: 500 },
    {
      field: 'message',
      headerName: 'Message',
      width: 1500,
    },
  ];

  return (
    <Box sx={{ height: 900, width: '70%', backgroundColor: '#D3D3D3' }}>
      <DataGrid
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        columns={columns}
        rows={logs}
        slots={{ toolbar: GridToolbar }}
        sx={{
          boxShadow: 2,
          border: 0,
          color: 'black',
          // borderColor: 'primary.light',

          '& .MuiDataGrid-cell:hover': {
            color: 'primary.light',
          },
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
    </Box>
  );
}
