import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

export default function CustomTable({ cols, data }) {
    return (
        <Paper sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={cols}
                initialState={{ pagination: { page: 0, pageSize: 5 } }}
                pageSizeOptions={[5, 10]}
                sx={{ border: 0 }}
                getRowId={(row) => row._id}
            />
        </Paper>
    );
}