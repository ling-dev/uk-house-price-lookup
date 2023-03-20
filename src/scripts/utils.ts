const alertContainer = document.querySelector(
  "#alerts__container"
) as HTMLDivElement;

export const printSuccess = () => {
  alertContainer.innerHTML = `<div class="alert alert-success" role="alert">
  Connected to the API successfully.
</div>`;
};

export const printError = () => {
  alertContainer.innerHTML = `<div class="alert alert-danger" role="alert">
Sorry! Failed to connect to the API. Please try again later.
</div>`;
  alertContainer.scrollIntoView({ behavior: "smooth" });
};

export const printReminder = () => {
  alertContainer.innerHTML = `<div class="alert alert-warning" role="alert">
  Please choose an option from each of the lists below.
</div>`;
  alertContainer.scrollIntoView({ behavior: "smooth" });
};

export const clearAlerts = () => {
  alertContainer.innerHTML = "";
};

// export const debounce = (func, delay = 1000) => {
//   let timeoutId;
//   return (...args) => {
//     if (timeoutId) {
//       clearTimeout(timeoutId);
//     }
//     timeoutId = setTimeout(() => {
//       func.apply(null, args);
//     }, delay);
//   };
// };
