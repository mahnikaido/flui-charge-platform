const collaboratorLogin = document.querySelector("#collaboratorLogin");
const collaboratorFeedback = document.querySelector("#collaboratorFeedback");
const themeToggle = document.querySelector("#themeToggle");

if (collaboratorLogin) {
  collaboratorLogin.addEventListener("submit", (event) => {
    event.preventDefault();
    collaboratorFeedback.innerHTML = 'Login simulado com sucesso. Bem-vindo à operação <img class="inline-logo feedback-logo" src="assets/flui-logo-purple.svg" alt="Flui" />.';
    collaboratorLogin.reset();
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    themeToggle.textContent = document.body.classList.contains("light-theme") ? "Tema escuro" : "Tema claro";
  });
}
