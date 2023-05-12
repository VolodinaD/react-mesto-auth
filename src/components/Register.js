import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import Header from './Header.js';
import FormForAuth from './FormForAuth.js';

function Register(props) {
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
        
        props.onRegister(formValue);
    }

    return (
        <>
            <Header email="">
                <>
                    <Link to="/sign-in" className="header__link">Войти</Link>
                </>
            </Header>
            <FormForAuth name="register" title="Регистрация" buttonText="Зарегистрироваться" text="Уже зарегистрированы? Войти" onSubmit={handleSubmit}>
                <>
                    <input type="email" name="email" id="email-input" placeholder="Email" className="auth-form__input auth-form__input_type_email" onChange={handleChange} />
                    <input type="password" name="password" id="password-input" placeholder="Пароль" className="auth-form__input auth-form__input_type_password" onChange={handleChange} />
                </>
            </FormForAuth>
        </>
    );
}

export default Register;