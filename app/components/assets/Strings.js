import I18nManager from 'I18nManager';
const locale = I18nManager.localeIdentifier;

Strings = {
  en_US: {
    appName: 'Fossil Jackets',
    newJacket: 'New Jacket',
    uploadJackets: 'Upload Jackets',
    viewJacket: 'View Jacket',
    signOut: 'Sign Out',
  },
  es_MX: {
    appName: 'Sobrecubiertas Fósil',
    newJacket: 'Sobrecubierta Nueva',
    uploadJackets: 'Subir Sobrecubiertas',
    viewJacket: 'Ver Sobrecubierta',
    signOut: 'Cerrar Sesión',
  },
};

export default Strings[locale];
