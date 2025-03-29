import { Box, Stack, Divider } from '@mui/material';
import { ProductSection } from './ProductSection';
import { TransactionSection } from './TransactionSection';
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
                },
            });

            if(response.ok) {
                let data = await response.json();
                data = data.filter(item => item.active === true);
                setProducts(data);
            }
        }

        fetchProducts();
    }, [token]);

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