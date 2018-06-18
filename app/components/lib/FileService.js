const getDataUriFromFileUri = (uri) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(uri);
    const fileBlob = await response.blob();
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(fileBlob);
  });
};

export { getDataUriFromFileUri };
