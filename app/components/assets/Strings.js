import I18nManager from 'I18nManager';
const locale = I18nManager.localeIdentifier;

Strings = {
  en_US: {
    // HomeScreen
    appName: 'Fossil Jackets',
    newJacket: 'New Jacket',
    signOut: 'Sign Out',
    uploadJackets: 'Upload Jackets',
    viewJacket: 'View Jacket',
  },
  es_MX: {
    // HomeScreen
    appName: 'Sobrecubiertas Fósil',
    newJacket: 'Sobrecubierta Nueva',
    signOut: 'Cerrar Sesión',
    uploadJackets: 'Subir Sobrecubiertas',
    viewJacket: 'Ver Sobrecubierta',
  },
};

export default Strings[locale];
