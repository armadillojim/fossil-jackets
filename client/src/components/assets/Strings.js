// unofficial standard: https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages
const locale = navigator.language;

const Strings = {
  'en-US': {
    // Login
    pleaseSignIn: 'Please sign in',
    signIn: 'Sign In',
    token: 'Token',
    tokenVerifyErrorMessage: 'An error occurred when signing in.  Please check your network connection and your passwords.',
    userID: 'User ID',
    // Table and Item
    east: 'E',
    north: 'N',
    south: 'S',
    west: 'W',
  },
  'es-MX': {
    // Login
    pleaseSignIn: 'Por favor, regístrese',
    signIn: 'Inicia Sesión',
    token: 'Ficha',
    tokenVerifyErrorMessage: 'Se produjo un error al iniciar sesión.  Verifique su conexión de red y sus contraseñas.',
    userID: 'ID de Usuario',
    // Table and Item
    east: 'E',
    north: 'N',
    south: 'S',
    west: 'O',
  },
};

export default Strings[locale];
