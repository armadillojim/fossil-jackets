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
    // NewScreen
    dateTime: 'Date / Time',
    expedition: 'Expedition',
    formation: 'Formation',
    jacketNumber: 'Jacket #',
    latLng: 'Latitude / Longitude',
    locality: 'Locality',
    missingJacketNumberTitle: 'Jacket # Required',
    missingJacketNumberMessage: 'In order to save the jacket data, a field number must be assigned.',
    notes: 'Notes',
    personnel: 'Personnel',
    primaryPhoto: 'Primary Photo',
    saveJacket: 'Save Jacket',
    secondaryPhotos: 'Secondary Photos',
    specimenType: 'Specimen Type',
    tid: 'Tag ID',
    // PhotoInput
    addPhoto: 'Add Photo',
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
    // UploadScreen
    fetchingJackets: 'Fetching jackets from storage ...',
    networkError: 'All uploads failed.  Check your network connection, and try again.',
    noJackets: 'No jackets to upload.',
    noJacketsTitle: 'No Jackets',
    OK: 'OK',
    unknownError: 'Some uploads failed.  Try again later.',
    uploadError: 'Upload Error',
    uploadProgress: (n, N, isJacket) => {
      const noun = isJacket ? 'jacket' : 'photo';
      return (N === 1) ?
        `${n} of ${N} ${noun} uploaded` :
        `${n} of ${N} ${noun}s uploaded`;
    }
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
    // NewScreen
    dateTime: 'Fecha / Hora',
    expedition: 'Expedición',
    formation: 'Formación Geológica',
    jacketNumber: 'Sobrecubierta #',
    latLng: 'Latitud / Longitud',
    locality: 'Localidad',
    missingJacketNumberTitle: 'Sobrecubierta # Obligatorio',
    missingJacketNumberMessage: 'Para guardar los datos de la sobrecubierta, es necesario asignar un número de campo.',
    notes: 'Notas',
    personnel: 'Personal',
    primaryPhoto: 'Foto Principal',
    saveJacket: 'Guardar Sobrecubierta',
    secondaryPhotos: 'Fotos Secundarias',
    specimenType: 'Tipo de Muestra',
    tid: 'Etiqueta ID',
    // PhotoInput
    addPhoto: 'Añadir Foto',
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
    // UploadScreen
    fetchingJackets: 'Buscando sobrecubiertas del depósito ...',
    networkError: 'Todas las subidas fallaron.  Verifique su conexión de red, y vuelva a intentarlo.',
    noJackets: 'No hay sobrecubiertas para subir.',
    noJacketsTitle: 'Ningunas Sobrecubiertas',
    OK: 'De acuerdo',
    unknownError: 'Algunas subidas fallaron.  Inténtalo más tarde.',
    uploadError: 'Error al Subir',
    uploadProgress: (n, N, isJacket) => {
      const noun = isJacket ? 'sobrecubierta' : 'foto';
      return (N === 1) ?
        `${n} de ${N} ${noun} subida` :
        `${n} de ${N} ${noun}s subidas`;
    }
  },
};

export default Strings[locale];
