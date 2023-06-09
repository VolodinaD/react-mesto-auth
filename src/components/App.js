import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import '../index.css';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/api.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import Login from './Login.js';
import Register from './Register.js';
import ProtectedRoute from './ProtectedRoute.js';
import * as auth from '../utils/auth.js';
import InfoTooltip from './InfoTooltip.js';
import successfulInfoImage from '../images/successful-info-image.svg';
import unsuccessfulInfoImage from '../images/unsuccessful-info-image.svg';

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setСurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = React.useState(false);
  const [isInfoTooltipPopupImage, setInfoTooltipPopupImage] = React.useState('');
  const [isInfoTooltipPopupText, setInfoTooltipPopupText] = React.useState('');
 
  const navigate = useNavigate();

  React.useEffect(() => {
    tokenCheck();
  }, []);
  
  React.useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([currentUser, cardArray]) => {
        setСurrentUser(currentUser);
        setCards(cardArray);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [loggedIn]);

  function tokenCheck() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');

      if (token) {
        auth.getToken(token)
          .then((res) => {
            if (res) {
              setLoggedIn(true);
              setEmail(res.data.email);
              navigate('/', {replace: true});
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  } 

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard({});
    setInfoTooltipPopupOpen(false);
    setInfoTooltipPopupImage('');
    setInfoTooltipPopupText('');
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    (!isLiked ? api.putLike(card._id) : api.deleteLike(card._id))
      .then((newCard) => {
        setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((item) => {
          if (item._id != card._id) {
            return item;
          }
        }))
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(data) {
    api.patchUserAvatar(data)
      .then(() => {
        setСurrentUser({name: currentUser.name, about: currentUser.about, avatar: data.avatar});
        
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(data) {
    api.patchUserInfo(data)
      .then(() => {
        setСurrentUser({name: data.name, about: data.about, avatar: currentUser.avatar});

        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(data) {
    api.postNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]); 

        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleRegister(formValue) {
    auth.register(formValue)
      .then((res) => {
        if (res.data) {
          navigate('/sign-in', {replace: true});
          setInfoTooltipPopupOpen(true);
          setInfoTooltipPopupImage(successfulInfoImage);
          setInfoTooltipPopupText('Вы успешно зарегистрировались!');
        }
      })
      .catch((err) => {
        console.log(err);
        setInfoTooltipPopupOpen(true);
        setInfoTooltipPopupImage(unsuccessfulInfoImage);
        setInfoTooltipPopupText('Что-то пошло не так! Попробуйте ещё раз.');
      });
  } 

  function handleLogin(formValue) {
    auth.authorize(formValue)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          setLoggedIn(true);
          setEmail(formValue.email);
          navigate('/', {replace: true});
        }
      })
      .catch((err) => {
        console.log(err);
        setInfoTooltipPopupOpen(true);
        setInfoTooltipPopupImage(unsuccessfulInfoImage);
        setInfoTooltipPopupText('Что-то пошло не так! Попробуйте ещё раз.');
      });
  } 

  function signOut() {
    localStorage.removeItem('token');
    navigate('/sign-in', {replace: true});
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<ProtectedRoute loggedIn={loggedIn} element={
          <CurrentUserContext.Provider value={currentUser}>
            <Header email={email}>
              <>
                <button onClick={signOut} className="header__link">Выйти</button>
              </>
            </Header>
            <Main onEditAvatar={handleEditAvatarClick} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onCardClick={handleCardClick} onCardLike={handleCardLike} onCardDelete={handleCardDelete} cards={cards} />
            <Footer />
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} /> 
            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} /> 
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} /> 
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          </CurrentUserContext.Provider>
        } />} />
        <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
        <Route path="/sign-up" element={<Register onRegister={handleRegister} />} />
      </Routes>
      <InfoTooltip image={isInfoTooltipPopupImage} alt={isInfoTooltipPopupText} title={isInfoTooltipPopupText} isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups} />
    </> 
  );
}

export default App;