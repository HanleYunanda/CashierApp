import { Box, Container } from '@mui/material';
import Jumbotron from '../component/Jumbotron';

function WelcomePage() {
    return (
        <Container sx={{ mt: 5 }}>
            <Jumbotron />
        </Container>
    );
}

export default WelcomePage;