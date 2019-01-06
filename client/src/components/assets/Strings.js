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
    // Table
    created: 'Created',
    creator: 'Creator',
    expedition: 'Expedition',
    formation: 'Formation',
    jacketId: 'Jacket #',
    latLng: 'Latitude/Longitude',
    locality: 'Locality',
    specimenType: 'Specimen Type',
    tableTitle: 'Jackets',
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
    // Table
    created: 'Creado',
    creator: 'Creador',
    expedition: 'Expedición',
    formation: 'Formación Geológica',
    jacketNumber: 'Sobrecubierta #',
    latLng: 'Latitud / Longitud',
    locality: 'Localidad',
    specimenType: 'Tipo de Muestra',
    tableTitle: 'Sobrecubiertas',
    // Table and Item
    east: 'E',
    north: 'N',
    south: 'S',
    west: 'O',
  },
};

export default Strings[locale];
