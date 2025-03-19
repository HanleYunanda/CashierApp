import { Card, Typography, Divider } from '@mui/material'

function Jumbotron() {
    return (
        <Card sx={{
            margin: '1rem',
            padding: '1rem'
        }}>
            <Typography variant="h3" color="initial" sx={{
                textAlign: 'center',
                paddingX: '1rem'
            }}>
                Welcome to Lele Cafe
            </Typography>
            <Typography variant="h6" color="initial" sx={{
                textAlign: 'center',
                padding: '1rem'
            }}>
                The Best Place to Enjoy Coffee
            </Typography>
            <Divider />
            <Typography variant="body1" color="initial" sx={{
                textAlign: 'center',
                padding: '1rem'
            }}>
                hanley.saputra@binus.ac.id
            </Typography>
        </Card>
    )
}

export default Jumbotron