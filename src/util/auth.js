import { useSelector } from "react-redux";

async function login(email, password) {
    const response = await fetch('http://localhost:3500/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if(!response.ok) {
        const data = await response.json();
        return {
            status: false,
            error: data.message
        }
    }

    const data = await response.json();
    return {
        status: true,
        token: data.token
    }
}

function verifyAuth() {
    useSelector()
}

export {
    login
};