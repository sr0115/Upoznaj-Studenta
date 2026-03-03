// ===============================
// PREMIUM STRANICA – MVP
// ===============================

const storedUser = localStorage.getItem("loggedUser");

if (!storedUser) {
  window.location.href = "index.html";
  throw new Error("Nema ulogovanog korisnika.");
}

const user = JSON.parse(storedUser);

const statusText = document.getElementById("statusText");
const buyBtn = document.getElementById("buyPremiumBtn");
const backBtn = document.getElementById("backBtn");

// Prikaz statusa
if (user.isPremium === true) {
  statusText.textContent = "Status: Premium ✔";
  buyBtn.disabled = true;
  buyBtn.textContent = "Premium je već aktivan";
} else {
  statusText.textContent = "Status: Nisi Premium";
}

// Aktivacija premium (MVP)
buyBtn.addEventListener("click", function () {
  if (user.isPremium === true) return;

  user.isPremium = true;

  // Update loggedUser
  localStorage.setItem("loggedUser", JSON.stringify(user));

  // Update i u usersList (da ostane premium i posle sledećeg logina)
  const usersKey = "usersList";
  const storedUsers = localStorage.getItem(usersKey);

  if (storedUsers) {
    const users = JSON.parse(storedUsers);

    for (let i = 0; i < users.length; i++) {
      if (users[i].email === user.email) {
        users[i].isPremium = true;
        break;
      }
    }

    localStorage.setItem(usersKey, JSON.stringify(users));
  }

  alert("Premium aktiviran (MVP)!");
  window.location.reload();
});

// Nazad na profil
backBtn.addEventListener("click", function () {
  window.location.href = "profile.html";
});
