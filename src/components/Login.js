import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';
import Header from './Header.js';
import FormForAuth from './FormForAuth.js';
import * as auth from '../utils/auth.js';

function Login(props) {
    const navigate = useNavigate(); 

    const [formValue, setFormValue] = React.useState({
        email: '',
        password: ''
    });

    function handleChange(e) {
        const {name, value} = e.target;
    
        setFormValue({
            ...formValue,
            [name]: value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        if (!formValue.email || !formValue.password) {
            return;
        } else {
            auth.authorize(formValue)
                .then((data) => {
                    if (data.token) {
                        setFormValue({email: '', password: ''});
                        props.handleLogin();
                        navigate('/', {replace: true});
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    return (
        <>
            <Header email="">
                <>
                    <Link to="/sign-up" className="header__link">Регистрация</Link>
                </>
            </Header>
            <FormForAuth name="register" title="Вход" buttonText="Войти" text="" onSubmit={handleSubmit}>
                <>
                    <input type="email" name="email" id="email-input" placeholder="Email" className="auth-form__input auth-form__input_type_email" onChange={handleChange} />
                    <input type="password" name="password" id="password-input" placeholder="Пароль" className="auth-form__input auth-form__input_type_password" onChange={handleChange} />
                </>
            </FormForAuth>
        </>
    );
}

export default Login;