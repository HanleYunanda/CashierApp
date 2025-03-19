import { Card, CardHeader, CardContent, TextField, Box, Container, CardActions, Button, Divider, Alert } from "@mui/material";
import { login } from "../../util/auth"
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/authSlice";
import { redirect, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {

    const emailRef = useRef();
    const passwordRef = useRef();
    const dispatch = useDispatch();
    const [isValid, setIsValid] = useState(true);
    const navigate = useNavigate()

    async function handleLogin() {
        setIsValid(() => true);
        const loginData = await login(emailRef.current.value, passwordRef.current.value);

        if(loginData.status) {
            const auth = jwtDecode(loginData.token);
            dispatch(authActions.setAuth({
                token: loginData.token,
                id: auth.id,
                email: auth.email
            }));
            navigate('/');
        } else {
            setIsValid(() => false);
        }
    }

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 10 }} >
            <Card sx={{ width: 500, p: 2 }}>
                <CardHeader
                    title="Login"
                />
                <Divider />
                <CardContent>
                    {
                        !isValid &&
                        (<Box>
                            <Alert severity="error">Invalid Credentials</Alert>
                        </Box>)
                    }
                    
                    <Box>
                        <TextField
                            fullWidth
                            id="email"
                            label="Email"
                            variant="standard"
                            inputRef={emailRef}
                        />
                    </Box>
                    <Box>
                        <TextField
                            fullWidth 
                            id="password"
                            label="Password"
                            type="password"
                            variant="standard"
                            inputRef={passwordRef}
                        />
                    </Box>
                </CardContent>
                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={handleLogin}>Login</Button>
                </CardActions>
            </Card>
        </Container>
    )
}

export default Login;