import I18nManager from 'I18nManager';
const locale = I18nManager.localeIdentifier;

Strings = {
  en_US: {
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
    badFormat: 'Bad Format',
    badFormatMessage: 'The clipboard contents did not appear to be a serial number.  Copy the tag serial number, and try again.',
    east: 'E',
    emptyClipboard: 'Empty Clipboard',
    emptyClipboardMessage: 'The clipboard is empty.  Copy the tag serial number, and try again.',
    geolocationError: 'Geolocation Error',
    geolocationMessage: 'Something went wrong when attempting to fetch your location',
    north: 'N',
    returnToNFC: 'Return To NFC Tools',
    south: 'S',
    tagInstructions: 'Return to the NFC Tools app.  Go to the “Write” tab, “Add a record” of “Text”, and paste the clipboard contents there.  Then “Write” the tag.  Finally, go to the “Other” tab and choose to “Lock tag” to prevent further (re)writing.',
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
    badPayload: 'Bad Payload Format',
    badPayloadMessage: 'The data did not appear to be the data payload from a tag: 92 characters of Base64.',
    fetchError: 'Fetch Error',
    fetchErrorMessage: 'Something went wrong when trying to fetch the jacket data from the server',
    tagPayload: 'Tag Data Payload',
  },
  es_MX: {
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
    badFormat: 'Formato Incorrecto',
    badFormatMessage: 'El contenido del portapapeles no parecía ser un número de serie.  Copie el número de serie de la etiqueta, y vuelva a intentarlo.',
    east: 'E',
    emptyClipboard: 'Portapapeles Vacío',
    emptyClipboardMessage: 'El portapapeles está vacío.  Copie el número de serie de la etiqueta, y vuelva a intentarlo.',
    geolocationError: 'Error de Geolocalización',
    geolocationMessage: 'Algo salió mal al obtener su geolocalización',
    north: 'N',
    returnToNFC: 'Regrese a NFC Tools',
    south: 'S',
    tagInstructions: 'Regrese a la aplicación NFC Tools.  Vaya a la pestaña “Write”, “Add a record” de “Text”, y pegue allí el contenido del portapapeles.  Luego, “Write” la etiqueta.  Finalmente, vaya a la pestaña “Other” y elija “Lock tag” para evitar más (re)escritura.',
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
    badPayload: 'Formato de Carga Incorrecto',
    badPayloadMessage: 'Los datos no parecían ser la carga de datos de una etiqueta: 92 caracteres de Base64.',
    fetchError: 'Error de Descarga',
    fetchErrorMessage: 'Algo salió mal al descargar los datos de la sobrecubierta del servidor',
    tagPayload: 'Carga de Datos de Etiqueta',
  },
};

const localeStrings = Strings[locale];
import config from '../../config.json';
if (config.domain.startsWith('local')) {
  localeStrings.appName += ' (dev)';
}

export default localeStrings;
