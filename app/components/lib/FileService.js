const getDataUriFromFileUri = (uri) => {
  return new Promise(async (resolve, reject) => {
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const fileBlob = await new Promise((blobResolve, blobReject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        blobResolve(xhr.response);
      };
      xhr.onerror = function() {
        blobReject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(fileBlob);
  });
};

export { getDataUriFromFileUri };
