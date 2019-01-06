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
    tableTitle: 'Jackets',
    // Item
    itemTitle: 'Jacket',
    personnel: 'Personnel',
    notes: 'Notes',
    // Table and Item
    created: 'Created',
    creator: 'Creator',
    expedition: 'Expedition',
    formation: 'Formation',
    jacketId: 'Jacket #',
    latLng: 'Latitude/Longitude',
    locality: 'Locality',
    specimenType: 'Specimen Type',
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
    tableTitle: 'Sobrecubiertas',
    // Item
    itemTitle: 'Sobrecubierta',
    personnel: 'Personal',
    notes: 'Apuntes',
    // Table and Item
    created: 'Creado',
    creator: 'Creador',
    expedition: 'Expedición',
    formation: 'Formación Geológica',
    jacketNumber: 'Sobrecubierta #',
    latLng: 'Latitud / Longitud',
    locality: 'Localidad',
    specimenType: 'Tipo de Muestra',
    east: 'E',
    north: 'N',
    south: 'S',
    west: 'O',
  },
};

export default Strings[locale];
