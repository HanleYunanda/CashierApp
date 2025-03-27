import {
    Container,
    Card,
    CardHeader,
    CardContent,
    TextField,
    Switch,
    InputLabel,
    Box,
    CardActions,
    Button,
    Alert,
} from '@mui/material';
import {  useState } from 'react';
import { useSelector } from 'react-redux';


function CreatePage() {

    const token = useSelector((state) => state.auth.token);
    const [product, setProduct] = useState({});
    const [saveMsg, setSaveMsg] = useState('');
    const [errors, setErrors] = useState({});

    const handleSave = () => {
        const fetchData = async() => {
            const response = await fetch('http://localhost:3500/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    name: product.name,
                    price: product.price,
                    active: product.active,
                })
            });

            const data = await response.json();
            if(response.status == 200) {
                setSaveMsg(<Alert severity="success" sx={{ mb: 5 }}>{data.message}</Alert>)
            
            }
            else if(response.status == 400 && data.errors) {
                setSaveMsg(<Alert severity="error" sx={{ mb: 5 }}>{data.message}</Alert>)
                setErrors(data.errors);
            }
            else {
                setSaveMsg(<Alert severity="error" sx={{ mb: 5 }}>{data.message}</Alert>)
            }
        }

        try {
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container sx={{
            my: 3,
        }}>
            <Card
                sx={{
                    p: 3
                }}
            >
                <CardHeader
                    title="Create Product"
                    sx={{
                        textAlign: 'center'
                    }}
                />
                <CardContent>
                    {saveMsg}
                    <TextField
                        id="productName"
                        label="Product Name"
                        variant="standard"
                        fullWidth
                        sx={{ mb:2 }}
                        value={product ? product.name : ''}
                        onChange={(e) => {
                            setProduct({...product, name: e.target.value})
                        }}
                        error={errors.name ? true : false}
                        helperText={errors.name ? errors.name : ''}
                    />
                    <TextField
                        id="price"
                        type="number"
                        label="Price"
                        variant="standard"
                        fullWidth
                        sx={{ mb:2 }}
                        value={product ? product.price : ''}
                        onChange={(e) => {
                            setProduct({...product, price: e.target.value})
                        }}
                        error={errors.price ? true : false}
                        helperText={errors.price ? errors.price : ''}
                    />
                    <Box sx={{ mb:2 }}>
                        <InputLabel htmlFor="labelActive">Status</InputLabel>
                        <Switch
                            checked={product ? product.active : false}
                            onChange={(e) => {
                                setProduct({...product, active: e.target.checked});
                            }}
                        />
                    </Box>
                </CardContent>
                <CardActions>
                    <Button onClick={handleSave}>Save</Button>
                </CardActions>
            </Card>
        </Container>
    )
}

export default CreatePage;