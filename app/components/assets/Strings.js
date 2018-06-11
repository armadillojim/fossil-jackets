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
  },
};

export default Strings[locale];
