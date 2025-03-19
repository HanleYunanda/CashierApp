import { Box,  Grid2, Card, CardContent } from '@mui/material';
import SearchBar from '../../component/SearchBar';
import ProductCard from '../../component/ProductCard';

export function ProductSection({ products }) {

    return (
        <>
            <Box padding={3} sx={{ py: 3 }}>
                <Card>
                    <SearchBar />
                </Card>
            </Box>
            <Box sx={{ px: 3 }}>
                <Card sx={{ p: 3 }}>
                    <Grid2 container direction="row" justifyContent={'center'} spacing={3}>
                        { products.map((product, index) => (
                            <ProductCard key={index} product={product}></ProductCard>
                        ))}
                    </Grid2>
                </Card>
            </Box>
        </>
    )
}