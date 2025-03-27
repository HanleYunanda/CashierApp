import {
    Container,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Grid2,
    InputLabel,
    Stack
} from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import CustomTable from '../../component/CustomTable';

const cols = [
    {
        field: 'transactionCode',
        headerName: 'Transcation Code',
        flex: 4,
    },
    {
        field: 'createdBy',
        headerName: 'Cashier',
        flex: 4,
    },
    {
        field: 'totalPrice',
        headerName: 'Total Price',
        flex: 4,
    },
]

function TransactionReportPage() {

    // Hook
    const token = useSelector((state) => state.auth.token);
    const [filterShowed, setFilterShowed] = useState(true);
    const [filter, setFilter] = useState({
        periodStart: null,
        periodEnd: null,
    });
    const [data, setData] = useState(null);

    // Memo Function
    const salesX = useMemo(() => {
        if(data == null) {
            return null;
        }
        const xAxis = data.salesReport.map((item) => item._id);
        return xAxis;
    }, [data]);

    const salesY = useMemo(() => {
        if(data == null) {
            return null;
        }
        const yAxis = data.salesReport.map((item) => item.transactionCount);
        return yAxis;
    }, [data]);

    const productsChart = useMemo(() => {
        if(data == null) {
            return null;
        }
        const chartData = data.productsReport.map((item) => {
            return {
                id: item.productId,
                value: item.totalQuantity,
                label: item.productName,
            }
        });

        return chartData;
    }, [data]);

    // Function
    const handleFilter = () => {
        const fetchData = async() => {
            const response = await fetch('http://localhost:3500/transaction/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    periodStart: filter.periodStart.toISOString(),
                    periodEnd: filter.periodEnd.toISOString(),
                })
            });

            const data = await response.json();
            setData({
                transactions: data.transactions,
                salesReport: data.salesReport,
                productsReport: data.productsReport,
            });
            console.log(data);
        }
        
        fetchData();
    };

    return (
        <Container sx={{
            my: 3,
        }}>
            <Button variant='contained' onClick={() => setFilterShowed((state) => !state)}>Filter</Button>
            {
                filterShowed &&
                <Card sx={{
                    mt: 1,
                    mb: 5
                }}>
                    <CardContent>
                        <InputLabel htmlFor="period">Period</InputLabel>
                        <Stack direction='row'>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    views={['month', 'year']}
                                    sx={{ width:'50%', mr:5 }}
                                    value={filter.periodStart}
                                    onChange={(newValue) => {
                                        newValue = moment(newValue).startOf('month');
                                        setFilter({...filter, periodStart: newValue});
                                    }}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                    views={['month', 'year']}
                                    sx={{ width:'50%', ml:5 }}
                                    value={filter.periodEnd}
                                    onChange={(newValue) => {
                                        newValue = moment(newValue).endOf('month');
                                        setFilter({...filter, periodEnd: newValue});
                                    }}
                                />
                            </LocalizationProvider>
                        </Stack>
                    </CardContent>
                    <CardActions>
                        <Button onClick={handleFilter}>Search</Button>
                    </CardActions>
                </Card>
            }
            <Grid2 container spacing={2}>
                {
                    data != null &&
                    <Grid2 size={6}>
                        <Card sx={{
                            display:'flex',
                            justifyContent:'center',
                            padding: 3
                        }}>
                            <LineChart
                                xAxis={[
                                    {
                                        scaleType: 'point',
                                        data: salesX
                                    }
                                ]}
                                series={[
                                    {
                                    data: salesY
                                    },
                                ]}
                                width={500}
                                height={300}
                            />
                        </Card>
                    </Grid2>
                }
                {
                    data != null &&
                    <Grid2 size={6}>
                        <Card sx={{
                            display:'flex',
                            justifyContent:'center',
                            padding: 3
                        }}>
                            <PieChart
                                series={[
                                    {
                                        data: productsChart,
                                    },
                                ]}
                                width={500}
                                height={300}
                                margin={{ top: 0, bottom: 100, left: 0, right:0 }}
                                slotProps={{
                                    legend: {
                                        direction: 'row',
                                        position: { vertical: 'bottom', horizontal: 'middle' },
                                        padding: 0,
                                    },
                                }}
                            />
                        </Card>
                    </Grid2>
                }
                <Grid2 size={12}>
                    <Card>
                        <CardContent>
                            {
                                data != null &&
                                <CustomTable cols={cols} data={data.transactions} />
                            }
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Container>
    )
}

export default TransactionReportPage;