// ===============================
// REGISTER – MVP
// ===============================

const registerForm = document.getElementById("registerForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

registerForm.addEventListener("submit", function (event) {
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

  // Izvlačenje godine i indeksa iz dela pre @
  const prefix = email.split("@")[0];
  const indexNumber = prefix.slice(-4);
  const enrollmentYear = prefix.slice(-8, -4);

  if (isNaN(indexNumber) || isNaN(enrollmentYear)) {
    errorMessage.textContent = "Email nije u ispravnom formatu.";
    return;
  }

  // Uzimamo listu korisnika
  const usersKey = "usersList";
  const storedUsers = localStorage.getItem(usersKey);

  let users = [];
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  }

  // Provera da li već postoji email
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      errorMessage.textContent = "Korisnik sa ovim emailom već postoji.";
      return;
    }
  }

  // Pravimo korisnika (MVP)
  const newUser = {
    email: email,
    password: password, // MVP: čuvamo običan tekst (nije bezbedno, ali je demo)
    indexNumber: indexNumber,
    enrollmentYear: enrollmentYear,
    isPremium: false
  };

  // Dodaj u listu i sačuvaj
  users.push(newUser);
  localStorage.setItem(usersKey, JSON.stringify(users));

  alert("Registracija uspešna! Sada se uloguj.");

  // Prebaci na login
  window.location.href = "index.html";
});
