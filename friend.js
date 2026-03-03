// ===============================
// FRIEND VIEW – MVP
// ===============================

// Čitamo parametar iz URL-a: friend.html?user=email
const params = new URLSearchParams(window.location.search);
const friendEmail = params.get("user");

// Ako nema email parametra, vrati na profil/login
if (!friendEmail) {
  window.location.href = "profile.html";
  throw new Error("Nema parametra user u URL-u.");
}

// Prikaži email na stranici
document.getElementById("friendEmail").textContent = friendEmail;

// Provera da li je korisnik ulogovan
const storedUser = localStorage.getItem("loggedUser");
if (!storedUser) {
  window.location.href = "index.html";
  throw new Error("Nema ulogovanog korisnika.");
}

const user = JSON.parse(storedUser);

// Ako korisnik slučajno otvori svoj QR, ne treba da dodaje sebe
if (friendEmail === user.email) {
  document.getElementById("addFriendBtn").disabled = true;
  document.getElementById("addFriendBtn").textContent = "Ovo si ti";
}

// ===============================
// UČITAJ PODATKE PRIJATELJA (ako postoje)
// ===============================

// MVP: prijateljev profil čuvamo na uređaju pod ključem profile_email
const friendProfileString = localStorage.getItem("profile_" + friendEmail);

if (friendProfileString) {
  const friendProfile = JSON.parse(friendProfileString);

  if (friendProfile.fullName) {
    document.getElementById("friendName").textContent = friendProfile.fullName;
  }

  if (friendProfile.description) {
    document.getElementById("friendDesc").textContent = friendProfile.description;
  }
}

// ===============================
// ADD FRIEND LOGIKA
// ===============================

const addFriendBtn = document.getElementById("addFriendBtn");
// Ako je već u prijateljima → sakrij dugme
const key = "friends_" + user.email;
const current = localStorage.getItem(key);
let friendsArray = current ? JSON.parse(current) : [];

if (friendsArray.includes(friendEmail)) {
  addFriendBtn.style.display = "none";
}

addFriendBtn.addEventListener("click", function () {
  // Lista prijatelja se čuva pod ključem friends_<ulogovani email>
  const key = "friends_" + user.email;

  // Uzimamo postojeću listu (ako postoji)
  const current = localStorage.getItem(key);

  let friendsArray = [];
  if (current) {
    friendsArray = JSON.parse(current);
  }

  // Ako već postoji u listi, ne dodaj ponovo
if (friendsArray.includes(friendEmail)) {
  addFriendBtn.style.display = "none";
  return;
}

  // Dodaj u listu
  friendsArray.push(friendEmail);

  // Sačuvaj nazad
  localStorage.setItem(key, JSON.stringify(friendsArray));
  addFriendBtn.style.display = "none";

  alert("Dodato u prijatelje!");
});

// ===============================
// SV PRIJATELJA – OTVARANJE PDF-a
// ===============================

const openFriendCvBtn = document.getElementById("openFriendCvBtn");

// CV se čuva pod ključem cv_<email>
const friendCvUrl = localStorage.getItem("cv_" + friendEmail);

// Ako postoji, omogućimo dugme
if (friendCvUrl) {
  openFriendCvBtn.disabled = false;
}

openFriendCvBtn.addEventListener("click", function () {
  const saved = localStorage.getItem("cv_" + friendEmail);

  if (saved) {
    window.open(saved, "_blank");
  } else {
    alert("Prijatelj nema sačuvan SV.");
  }
});

// ===============================
// NAZAD
// ===============================

function goBack() {
  window.location.href = "profile.html";
}
