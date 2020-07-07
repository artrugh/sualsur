import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const forgotPassword = async (email) => {
  try {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotten-password',
      data: {
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Email sent successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (data, token) => {
  try {
    const url = '/api/v1/users/reset-password/' + token;
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const signup = async (data) => {
  try {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err.message);
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    if ((res.data = 'success')) location.assign('/');
    // location.reload(true);
  } catch (err) {
    console.log(err.message);
    showAlert('error', 'Error logging out! Try again.');
  }
};

export const addReview = async (title, review, rating, tour) => {
  try {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const res = await axios({
      method: 'POST',
      url: `/api/v1/reviews`,
      data: {
        title,
        review,
        rating,
        tour,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review added successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'The review could not be added');
    window.setTimeout(() => {
      location.assign('/me');
    }, 1500);
  }
};

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/update-password'
        : '/api/v1/users/update-me';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const sendContact = async (subject, content, name, email) => {
  try {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/contact',
      data: {
        name,
        email,
        subject,
        content,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Email sent successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err);
    showAlert(
      'error',
      'There were an error sending the email. Try again later'
    );
  }
};
