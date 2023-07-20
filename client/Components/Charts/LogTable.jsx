import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useState } from 'react';

// const VISIBLE_FIELDS = ['headers', 'message'];

export default function LogTable() {
  // const { data } = useDemoData({
  //   dataSet: 'Log Data',
  //   visibleFields: VISIBLE_FIELDS,
  //   rowLength: 100,
  // });
  const [rows, setRows] = useState([{ id: 1, header: '', message: '' }]);
  const columns = [
    { field: 'header', headerName: 'Header', width: 500 },
    {
      field: 'message',
      headerName: 'Message',
      width: 1500,
    },
  ];

  useEffect(() => {
    console.log('Log Table UseEffect');
    fetch('/api/logs')
      .then((data) => data.json())
      .then((res) => {
        setRows(res['kube-system=kube-controller-manager-minikube']);
      })
      .catch((err) => console.log(err));
  }, []);

  // Otherwise filter will be applied on fields such as the hidden column id
  // const columns = React.useMemo(
  //   () => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
  //   [data.columns],
  // );

  return (
    <Box sx={{ height: 900, width: '70%', backgroundColor: '#D3D3D3' }}>

      <DataGrid
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        columns={columns}
        rows={rows}
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
