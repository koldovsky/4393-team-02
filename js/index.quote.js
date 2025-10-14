document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".quote__form-body");
  const button = form.querySelector(".quote__form-button");
form.addEventListener("submit", (event) => {
    event.preventDefault();
const name = form.querySelector("#name").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const email = form.querySelector("#email").value.trim();
    const oldMessage = form.querySelector(".quote__message");
    if (oldMessage) oldMessage.remove();
if (!name  !phone  !email) {
      showMessage("Будь ласка, заповніть усі поля.", "error");
      return;
    }
button.disabled = true;
    button.textContent = "Sending...";

    setTimeout(() => {
      button.disabled = false;
      button.textContent = "Request a quote";
      form.reset();
      showMessage("Форму успішно відправлено! 😊", "success");
    }, 1500);
  });
function showMessage(text, type) {
    const message = document.createElement("div");
    message.className = quote__message quote__message--${type};
    message.textContent = text;
 form.appendChild(message);
setTimeout(() => {
      message.classList.add("fade-out");
      setTimeout(() => message.remove(), 500);
    }, 3000);
  }
});