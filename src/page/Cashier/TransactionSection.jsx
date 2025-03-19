import { Card, CardHeader, CardContent, CardActions, Typography, Stack, Button } from '@mui/material';
import TransactionList from '../../component/TransactionList';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function TransactionSection() {

    const navigate = useNavigate();
    const totalPrice = useSelector((state) => state.transaction.totalPrice);

    const handleSubmit = () => {
        navigate('/transaction');
    }

    return (
        <Card 
            sx={{
                position: 'sticky',
                top: 0,
            }}
        >
            <CardHeader
                title="Cart"
                subheader=""
            />
            <CardContent>
                <TransactionList />
                <Stack direction="row" justifyContent="space-between" >
                    <Typography variant="body1" color="initial">
                        Total :
                    </Typography>
                    <Typography variant="body1" color="initial">
                        Rp {totalPrice}
                    </Typography>
                </Stack>
            </CardContent>
            <CardActions sx={{ display:'flex', justifyContent:'end' }}>
                <Button onClick={handleSubmit}>Submit</Button>
            </CardActions>
        </Card>
    )
}