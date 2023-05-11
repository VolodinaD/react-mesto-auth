import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import Header from './Header.js';
import FormForAuth from './FormForAuth.js';
import * as auth from '../utils/auth.js';
import InfoTooltip from './InfoTooltip.js';
import successfulInfoImage from '../images/successful-info-image.svg';
import unsuccessfulInfoImage from '../images/unsuccessful-info-image.svg';

function Register() {
    const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = React.useState(false);
    const [isInfoTooltipPopupImage, setInfoTooltipPopupImage] = React.useState({});
    const [isInfoTooltipPopupText, setInfoTooltipPopupText] = React.useState('');
    
    const [formValue, setFormValue] = React.useState({
        email: '',
        password: ''
    });

    function closeInfoTooltipPopup() {
        setInfoTooltipPopupOpen(false);
        setInfoTooltipPopupImage({});
        setInfoTooltipPopupText('');
    }

    function handleChange(e) {
        const {name, value} = e.target;
    
        setFormValue({
            ...formValue,
            [name]: value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        auth.register(formValue)
            .then((res) => {
                if (res.data) {
                    setInfoTooltipPopupImage(successfulInfoImage);
                    setInfoTooltipPopupText('Вы успешно зарегистрировались!');
                } else {
                    setInfoTooltipPopupImage(unsuccessfulInfoImage);
                    setInfoTooltipPopupText('Что-то пошло не так! Попробуйте ещё раз.');
                }                
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setInfoTooltipPopupOpen(true);
            });
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
            <InfoTooltip image={isInfoTooltipPopupImage} alt={isInfoTooltipPopupText} title={isInfoTooltipPopupText} isOpen={isInfoTooltipPopupOpen} onClose={closeInfoTooltipPopup} />
        </>
    );
}

export default Register;