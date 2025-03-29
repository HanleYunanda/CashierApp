import {
    Container,
    Card,
    CardHeader,
    CardContent,
    Button, Typography,
    Alert
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomTable from '../../component/CustomTable';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function UpdateButton({ dataId }) {
    const nav = useNavigate();
    const handleClick = () => { nav('/product/edit/' + dataId) }
    return (
        <Button onClick={handleClick}>Edit</Button>
    );
}

const cols = [
    {
        headerName: 'Action',
        sortable: false,
        renderCell: (params) => {
            return (
                <UpdateButton dataId={params.row._id}></UpdateButton>
            )
        }
    },
    {
        field: 'name',
        headerName: 'Product Name',
        flex: 3,
    },
    {
        field: 'price',
        headerName: 'Price',
        flex: 2,
    },
    {
        field: 'active',
        headerName: 'Status',
        flex: 1,
        valueFormatter: (value) => {
            return value ? 'Active' : 'Inactive';
        }
    },
    {
        field: 'createdAt',
        headerName: 'Created At',
        flex: 2,
        valueFormatter: (value) => {
            return moment(value).format('DD-MM-YYYY');
        }
    },
    {
        field: 'updatedAt',
        headerName: 'Updated At',
        flex: 2,
        valueFormatter: (value) => {
            return moment(value).format('DD-MM-YYYY');
        }
    },
]

function ListProductPage() {

    const token = useSelector((state) => state.auth.token);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('http://localhost:3500/product', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });

            if(response.ok) {
                const data = await response.json();
                setData(data);
            }
        }

        try {
            fetchProducts();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }, [token]);

    let table = (
        <Alert severity="info">No data available</Alert>
    );
    if(!isLoading) {
        if(data.length != 0) {
            table = <CustomTable cols={cols} data={data}></CustomTable>;
        }
    }

    return (
        <Container sx={{
            my: 3,
        }}>
            <Card>
                {/* <CardHeader
                    title="Products"
                /> */}
                <CardContent>
                    <Typography variant="h4" color="initial" textAlign={'center'}>Products</Typography>
                    <Button variant="contained" onClick={() => nav('/product/create')} sx={{ mb:3 }}>Create</Button>
                    {table}
                    {/* <CustomTable cols={cols} data={data}></CustomTable> */}
                </CardContent>
            </Card>
        </Container>
    )
}

export default ListProductPage;