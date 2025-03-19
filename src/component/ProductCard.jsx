import * as React from 'react';
import { Card, CardMedia, CardActions, CardContent, Button, Typography, ButtonGroup, TextField } from '@mui/material';
import coffee from '../assets/coffee.jpg';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { useDispatch } from 'react-redux';
import { transactionActions } from '../store/transactionSlice';

export default function ProductCard({ product }) {
    const dispatch = useDispatch();

    function handleClick() {
        dispatch(transactionActions.addTransaction({
            productId: product._id,
            name: product.name,
            pricePerUnit: product.price,
            quantity: 1
        }));
    }

    return (
        <Button onClick={handleClick} key={product.id}>
            <Card sx={{ width: 250 }}>
                <CardMedia
                    component="img"
                    alt="green iguana"
                    height="130"
                    image={coffee}
                />
                <CardContent>
                    <Typography variant="h5" component="div">
                        {product.name}
                    </Typography>
                    <Typography component="div" sx={{ color: 'text.secondary' }}>Rp {product.price}</Typography>
                </CardContent>
            </Card>
        </Button>
    );
}