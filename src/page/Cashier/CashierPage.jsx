import { Box, Stack, Divider } from '@mui/material';
import { ProductSection } from './ProductSection';
import { TransactionSection } from './TransactionSection';
import { useLoaderData } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function CashierPage() {

    const token = useSelector((state) => state.auth.token);
    const [products, setProducts] = useState([]);

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
                setProducts(data);
            }
        }

        fetchProducts();
    }, [products, token]);

    return (
        <Box sx={{ my: 3 }}>
            <Stack direction="row">
                <Box flex={8} >
                    <ProductSection products={products}></ProductSection>
                </Box>
                <Box flex={4} padding={3} >
                    <TransactionSection></TransactionSection>
                </Box>
            </Stack>
        </Box>
    );
}

export default CashierPage;