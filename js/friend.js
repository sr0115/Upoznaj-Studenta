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

// UČITAJ PRIJATELJA
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


// Dodavanje prijatelja
const addFriendBtn = document.getElementById("addFriendBtn");
const key = "friends_" + user.email;
const current = localStorage.getItem(key);
let friendsArray = current ? JSON.parse(current) : [];

if (friendsArray.includes(friendEmail)) {
  addFriendBtn.style.display = "none";
}

addFriendBtn.addEventListener("click", function () {
  const key = "friends_" + user.email;

  const current = localStorage.getItem(key);

  let friendsArray = [];
  if (current) {
    friendsArray = JSON.parse(current);
  }

if (friendsArray.includes(friendEmail)) {
  addFriendBtn.style.display = "none";
  return;
}

  friendsArray.push(friendEmail);

  localStorage.setItem(key, JSON.stringify(friendsArray));
  addFriendBtn.style.display = "none";

  alert("Dodato u prijatelje!");
});



const openFriendCvBtn = document.getElementById("openFriendCvBtn");

const friendCvUrl = localStorage.getItem("cv_" + friendEmail);

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


function goBack() {
  window.location.href = "profile.html";
}
