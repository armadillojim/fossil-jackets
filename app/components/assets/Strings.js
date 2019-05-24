import { Localization } from 'expo';
import { Platform } from 'react-native';

// on iOS, build locale string from locale==language and country
// Android or other platform: use built-in locale already in language-country format
const locale = (Platform.OS === 'ios') ?
  Localization.locale + '-' + Localization.country :
  Localization.locale;

Strings = {
  'en-US': {
    // AuthLoadingScreen
    signingIn: 'Signing in ...',
    // FailsafeScreen
    fetchingKeys: 'Fetching keys from storage ...',
    writeFailed: 'Write Failed',
    writeFailedMessage: 'One or more files could not be written.  You will likely be logged out.  Use Android File Transfer to see what files could be recovered.',
    writeProgress: (n, N) => {
      return (N === 1) ?
        `${n} of ${N} key written` :
        `${n} of ${N} keys written`;
    },
    writeSucceeded: 'Write Succeeded',
    writeSucceededMessage: 'Files successfully written.  You will be logged out.  Use Android File Transfer to recover the files.',
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
    success: 'Success!',
    tid: 'Tag ID / Serial Number',
    // PhotoInput
    addPhoto: 'Add Photo',
    noPhotoPermission: 'No photo permission',
    // SignInScreen
    email: 'Email Address',
    password: 'Password',
    pleaseSignIn: 'Please sign in',
    signIn: 'Sign In',
    tokenVerifyErrorTitle: 'Verification Error',
    tokenVerifyErrorMessage: 'An error occurred when signing in.  Please check your network connection and your password.',
    userID: 'User ID',
    // SignOutScreen
    signingOut: 'Signing out ...',
    // TextInputs
    badTagFormat: 'Bad Tag Format',
    badTagFormatMessage: 'The tag ID contents do not appear to be a serial number.  For example, HH:HH:HH:HH:HH:HH:HH where “H” is a hexadecimal digit.',
    east: 'E',
    elevation: 'Elevation',
    geolocationError: 'Geolocation Error',
    geolocationMessage: 'Something went wrong when attempting to fetch your location',
    north: 'N',
    south: 'S',
    west: 'W',
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
    },
    // ViewScreen
    fetchError: 'Fetch Error',
    fetchErrorMessage: 'Something went wrong when trying to fetch the jacket data from the server',
  },
  'es-MX': {
    // AuthLoadingScreen
    signingIn: 'Iniciando sesión ...',
    // FailsafeScreen
    fetchingKeys: 'Buscando llaves del depósito ...',
    writeFailed: 'Escritura Falló',
    writeFailedMessage: 'Uno o más archivos no pudieron ser escritos.  Es probable que la sesión estará cerrado.  Use Android File Transfer para ver qué archivos se pueden recuperar.',
    writeProgress: (n, N) => {
      return (N === 1) ?
        `${n} de ${N} llave escritó` :
        `${n} de ${N} llaves escritaron`;
    },
    writeSucceeded: 'Escritura Tuvo Éxito',
    writeSucceededMessage: 'Archivos escritos con éxito.  Se cerrará la sesión.  Use Android File Transfer para recuperar los archivos.',
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
    success: '¡Éxito!',
    tid: 'Etiqueta ID / Número de Serie',
    // PhotoInput
    addPhoto: 'Añadir Foto',
    noPhotoPermission: 'Sin permiso de foto',
    // SignInScreen
    email: 'Dirección de Correo Electrónico',
    password: 'Contraseña',
    pleaseSignIn: 'Por favor, regístrese',
    signIn: 'Inicia Sesión',
    tokenVerifyErrorTitle: 'Error de Verificación',
    tokenVerifyErrorMessage: 'Se ha producido un error al iniciar sesión.  Por favor, verifique su conexión de red y su contraseña.',
    userID: 'ID de Usuario',
    // SignOutScreen
    signingOut: 'Cerrando sesión ...',
    // TextInputs
    badTagFormat: 'Formato Incorrecto de Etiqueta',
    badTagFormatMessage: 'El contenido de la etiqueta ID no parecía ser un número de serie.  Por ejemplo, HH:HH:HH:HH:HH:HH:HH donde “H” es un dígito hexadecimal.',
    east: 'E',
    elevation: 'Elevación',
    geolocationError: 'Error de Geolocalización',
    geolocationMessage: 'Algo salió mal al obtener su geolocalización',
    north: 'N',
    south: 'S',
    west: 'O',
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
    },
    // ViewScreen
    fetchError: 'Error de Descarga',
    fetchErrorMessage: 'Algo salió mal al descargar los datos de la sobrecubierta del servidor',
  },
};

const localeStrings = Strings[locale];
import config from '../../config.json';
if (config.domain.startsWith('local')) {
  localeStrings.appName += ' (dev)';
}

export default localeStrings;
