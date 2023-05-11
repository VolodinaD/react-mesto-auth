export const BASE_URL = 'https://auth.nomoreparties.co';

export const register = (data) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: data.email,
            password: data.password
        })
    })
    .then((response) => {
        return response.json();
    })
    .catch((err) => console.log(err));
}

export const authorize = (data) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: data.email,
            password: data.password
        })
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            return data;
        }
    })
    .catch((err) => console.log(err));
}

export const getToken = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        return data;
    })
    .catch((err) => console.log(err));
}