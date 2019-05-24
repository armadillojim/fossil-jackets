// unofficial standard: https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/languages
const locale = navigator.language;

const Strings = {
  'en-US': {
    // Login
    email: 'Email Address',
    password: 'Password',
    pleaseSignIn: 'Please sign in',
    signIn: 'Sign In',
    tokenVerifyErrorMessage: 'An error occurred when signing in.  Please check your network connection and your password.',
    userID: 'User ID',
    // Table
    tableTitle: 'Jackets',
    // Item
    itemTitle: 'Jacket',
    elevation: 'Elevation',
    personnel: 'Personnel',
    notes: 'Notes',
    tid: 'Tag ID / Serial Number',
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
    email: 'Dirección de Correo Electrónico',
    password: 'Contraseña',
    pleaseSignIn: 'Por favor, regístrese',
    signIn: 'Inicia Sesión',
    tokenVerifyErrorMessage: 'Se produjo un error al iniciar sesión.  Por favor, verifique su conexión de red y su contraseña.',
    userID: 'ID de Usuario',
    // Table
    tableTitle: 'Sobrecubiertas',
    // Item
    itemTitle: 'Sobrecubierta',
    elevation: 'Elevación',
    personnel: 'Personal',
    notes: 'Apuntes',
    tid: 'Etiqueta ID / Número de Serie',
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
