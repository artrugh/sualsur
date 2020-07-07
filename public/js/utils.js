export const spinnerBtn = async (classBtn, originalMess, newMess, callback) => {
  const btn = document.querySelector(classBtn);
  btn.textContent = newMess;
  setTimeout(() => (btn.textContent = originalMess), 2000);
  await callback();
  btn.textContent = originalMess;
};

export const getCookie = (key) => {
  const regexp = new RegExp(`.*${key}=([^;]*)`);
  const result = regexp.exec(document.cookie);
  if (result) {
    return result[1];
  }
};
