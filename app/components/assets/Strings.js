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
    register: 'Register',
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
    register: 'Registrame',
    // SignOutScreen
    signingOut: 'Cerrando sesión ...',
    // TextInputs
    geolocationError: 'Error de Geolocalización',
    geolocationMessage: 'Algo salió mal al obtener su geolocalización',
  },
};

export default Strings[locale];
