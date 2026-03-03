// ===============================
// LOGIN – MVP (sa usersList proverom)
// ===============================

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  errorMessage.textContent = "";

  // Provera praznih polja
  if (email === "" || password === "") {
    errorMessage.textContent = "Sva polja su obavezna.";
    return;
  }

  // Provera domena
  const allowedDomain = "@student.fon.bg.ac.rs";
  if (!email.endsWith(allowedDomain)) {
    errorMessage.textContent = "Email mora biti u formatu @student.fon.bg.ac.rs";
    return;
  }

  // Izvlačenje godine i indeksa (osnovna validacija formata)
  const prefix = email.split("@")[0];
  const indexNumber = prefix.slice(-4);
  const enrollmentYear = prefix.slice(-8, -4);

  if (isNaN(indexNumber) || isNaN(enrollmentYear)) {
    errorMessage.textContent = "Email nije u ispravnom formatu.";
    return;
  }

  // ===============================
  // Provera da li korisnik postoji (usersList)
  // ===============================

  const usersKey = "usersList";
  const storedUsers = localStorage.getItem(usersKey);

  // Ako nema nijednog registrovanog korisnika
  if (!storedUsers) {
    errorMessage.textContent = "Nema registrovanih korisnika. Registruj se prvo.";
    return;
  }

  const users = JSON.parse(storedUsers);

  // Tražimo korisnika po email + password
  let foundUser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      foundUser = users[i];
      break;
    }
  }

  // Ako nije nađen
  if (foundUser === null) {
    errorMessage.textContent = "Pogrešan email ili šifra.";
    return;
  }

  // Uloguj korisnika
  localStorage.setItem("loggedUser", JSON.stringify(foundUser));

  // Prebaci na profil
  window.location.href = "profile.html";
});
