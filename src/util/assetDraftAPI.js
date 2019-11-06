// check local storage and return json of form or new object
export const getAssetDraft = () => {
    // localStorage.removeItem('registerAssetForm');
  const registerAssetForm = localStorage.getItem("registerAssetForm");
  if (registerAssetForm) {
    const parsedForm = JSON.parse(registerAssetForm);
    // check timestamp and delete if stored data is over 30 days old
    const currentDateTimeMs = new Date().getTime(); // get current date in milliseconds
    const storedDateMs = new Date(parsedForm.dateCreated).getTime(); // convert stored createdDate in milliseconds
    const difference = currentDateTimeMs - storedDateMs;
    const dayMs = 86400000; // number of milliseconds in a day
    if (difference / dayMs > 30) {
      localStorage.removeItem("registerAssetForm");
      return null;
    }
    return parsedForm.form;
  } else {
    return null;
  }
};

// overwrite local storage asset draft with supplied form object
export const setAssetDraft = form => {
  // console.log("saving to local storage", form);
  // add current timestamp
  const registerAssetForm = {
    dateCreated: new Date(),
    form: form
  };
  localStorage.setItem("registerAssetForm", JSON.stringify(registerAssetForm));
};

// delete local storage draft
export const deleteAssetDraft = () => {
  localStorage.removeItem("registerAssetForm");
};
