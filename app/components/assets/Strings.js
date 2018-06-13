import I18nManager from 'I18nManager';
const locale = I18nManager.localeIdentifier;

Strings = {
  en_US: {
    // AuthLoadingScreen
    signingIn: 'Signing in ...',
    // HomeScreen
    appName: 'Fossil Jackets',
    newJacket: 'New Jacket',
    signOut: 'Sign Out',
    uploadJackets: 'Upload Jackets',
    viewJacket: 'View Jacket',
    // SignInScreen
    pleaseSignIn: 'Please sign in',
    signIn: 'Sign In',
    token: 'Token',
    tokenVerifyErrorTitle: 'Verification Error',
    tokenVerifyErrorMessage: 'An error occurred when signing in.  Please check your network connection and your passwords.',
    userID: 'User ID',
    // SignOutScreen
    signingOut: 'Signing out ...',
    // TextInputs
    geolocationError: 'Geolocation Error',
    geolocationMessage: 'Something went wrong when attempting to fetch your location',
  },
  es_MX: {
    // AuthLoadingScreen
    signingIn: 'Iniciando sesión ...',
    // HomeScreen
    appName: 'Sobrecubiertas Fósil',
    newJacket: 'Sobrecubierta Nueva',
    signOut: 'Cerrar Sesión',
    uploadJackets: 'Subir Sobrecubiertas',
    viewJacket: 'Ver Sobrecubierta',
    // SignInScreen
    pleaseSignIn: 'Por favor, regístrese',
    signIn: 'Inicia Sesión',
    token: 'Ficha',
    tokenVerifyErrorTitle: 'Verification Error',
    tokenVerifyErrorMessage: 'An error occurred when signing in.  Please check your network connection and your passwords.',
    userID: 'ID de Usuario',
    // SignOutScreen
    signingOut: 'Cerrando sesión ...',
    // TextInputs
    geolocationError: 'Error de Geolocalización',
    geolocationMessage: 'Algo salió mal al obtener su geolocalización',
  },
};

export default Strings[locale];