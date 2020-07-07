import '@babel/polyfill';
import { displayMap } from './mapbox';
import {
  login,
  forgotPassword,
  resetPassword,
  signup,
  logout,
  addReview,
  updateSettings,
  sendContact,
} from './HTTP';
import { bookTour } from './stripe';
import { spinnerBtn, getCookie } from './utils';
import { hideAlert, showAlert } from './alerts';

// DOM ELEMENTS
const mapBox = document.getElementById('map');

// HEADER
const headerHome = document.querySelector('.header');

// FORMS
const loginForm = document.querySelector('.form--login');
const forgotForm = document.querySelector('.form--forgot');
const resetForm = document.querySelector('.form--reset-password');
const signupForm = document.querySelector('.form--signup');
const reviewForm = document.querySelector('.form--review');
const userDataForm = document.querySelector('.form--user-data');
const contactForm = document.querySelector('.form--contact');
const userPasswordForm = document.querySelector('.form--user-password');

// BTN
const logOutBtn = document.querySelector('.nav__el--logout');
const forgotBtn = document.querySelector('.btn--forgot');
const bookBtn = document.getElementById('book-tour');
const reviewBtn = document.getElementById('btn-review');

const naviToggle = document.getElementById('navi-toggle');
const navItems = document.querySelectorAll('.nav__link');
const story = document.querySelectorAll('.story');
const storyShape = document.querySelectorAll('.story__shape');

const alertMessage = document.querySelector("body").dataset.alert;

if(alertMessage) showAlert('success', alertMessage, 8)

// COOKIES ALARM
if (headerHome) {
  const cookie = getCookie('accept');
  hideAlert();
  const markup = `<div class="alert alert--cookies"><div class = "popup__close">&times;</div>Click to accept cookies!</div>`;

  if (!cookie)
    setTimeout(() => {
      document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
      document
        .querySelector('.alert--cookies')
        .addEventListener('click', () => {
          hideAlert();
          const now = new Date();
          now.setMinutes(now.getMinutes() + 120);
          document.cookie = `accept=true;expires=${now.toUTCString()};`;
        });
    }, 4000);
}

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (navItems) {
  navItems.forEach(
    (item) =>
      (item.onclick = () => {
        naviToggle.checked = false;
      })
  );
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    spinnerBtn('.btn--login', 'login', 'loading...', login(email, password));
  });
  forgotBtn.addEventListener('click', (e) =>
    window.setTimeout(() => {
      location.assign('/forgotten-password');
    }, 1500)
  );
}

if (forgotForm)
  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    spinnerBtn(
      '.btn--forgot',
      'Send Email',
      'loading...',
      forgotPassword(email)
    );
  });

if (resetForm)
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('password-confirm');
    const { token } = document.querySelector('.btn--save-password').dataset;
    spinnerBtn(
      '.btn--save-password',
      'save password',
      'updating...',
      resetPassword(
        {
          password: password.value,
          passwordConfirm: passwordConfirm.value,
        },
        token
      )
    );
  });

if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('password', document.getElementById('password').value);
    form.append(
      'passwordConfirm',
      document.getElementById('new-password').value
    );
    form.append('photo', document.getElementById('photo').files[0]);
    spinnerBtn('.btn--primary', 'sign up', 'loading...', signup(form));
  });

if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const { tourId } = reviewBtn.dataset;

    spinnerBtn(
      '.btn--primary',
      'add review',
      'loading...',
      addReview(title, review, rating, tourId)
    );
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    spinnerBtn(
      '.btn--save-settings',
      'sign up',
      'loading...',
      updateSettings(form, 'data')
    );
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const passwordCurrent = document.getElementById('password-current');
    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('password-confirm');

    spinnerBtn(
      '.btn--save-password',
      'save password',
      'updating...',
      updateSettings(
        {
          passwordCurrent: passwordCurrent.value,
          password: password.value,
          passwordConfirm: passwordConfirm.value,
        },
        'password'
      )
    );
    passwordCurrent.value = '';
    password.value = '';
    passwordConfirm.value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

if (contactForm)
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let email;
    let name;
    if (document.getElementById('email'))
      email = document.getElementById('email').value;
    if (document.getElementById('name'))
      name = document.getElementById('name').value;
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('content').value;
    spinnerBtn(
      '.btn--contact',
      'contact',
      'sending...',
      sendContact(subject, content, name, email)
    );
  });

if (storyShape.length === 0)
  story.forEach((el) => (el.style.display = 'block'));
