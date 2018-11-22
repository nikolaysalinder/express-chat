function logout() {
  axios.post('/logout')
    .then((response) => {
      console.log(response);
      window.location.href = '/';
    }).catch(err => console.log(err));
}
function login() {
  axios.post('/login', {
    username: `${document.getElementById('input-username').value}`,
    password: `${document.getElementById('input-password').value}`,
  })
    .then((response) => {
      console.log(response);
      window.location.href = '/chat';
    })
    .catch(err => console.log(err));
}
