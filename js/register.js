const registerForm = document.getElementById("registerForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");
// Provera forme 
registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  errorMessage.textContent = "";

  if (email === "" || password === "") {
    errorMessage.textContent = "Sva polja su obavezna.";
    return;
  }

  const allowedDomain = "@student.fon.bg.ac.rs";
  if (!email.endsWith(allowedDomain)) {
    errorMessage.textContent = "Email mora biti u formatu @student.fon.bg.ac.rs";
    return;
  }

  const prefix = email.split("@")[0];
  const indexNumber = prefix.slice(-4);
  const enrollmentYear = prefix.slice(-8, -4);

  if (isNaN(indexNumber) || isNaN(enrollmentYear)) {
    errorMessage.textContent = "Email nije u ispravnom formatu.";
    return;
  }

  const usersKey = "usersList";
  const storedUsers = localStorage.getItem(usersKey);

  let users = [];
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  }

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      errorMessage.textContent = "Korisnik sa ovim emailom već postoji.";
      return;
    }
  }

  // Pravimo korisnika
  const newUser = {
    email: email,
    password: password,
    indexNumber: indexNumber,
    enrollmentYear: enrollmentYear,
    isPremium: false
  };

  users.push(newUser);
  localStorage.setItem(usersKey, JSON.stringify(users));

  alert("Registracija uspešna! Sada se uloguj.");

  window.location.href = "index.html";
});
