// ===============================
// FRIENDS LIST – MVP
// ===============================

// Provera da li je korisnik ulogovan
const storedUser = localStorage.getItem("loggedUser");

if (!storedUser) {
  window.location.href = "index.html";
  throw new Error("Nema ulogovanog korisnika.");
}

const user = JSON.parse(storedUser);

// Gde crtamo listu
const friendsListDiv = document.getElementById("friendsList");

// Uzimamo listu prijatelja iz localStorage-a
const key = "friends_" + user.email;
const storedFriends = localStorage.getItem(key);

// Ako nema prijatelja
if (!storedFriends) {
  friendsListDiv.textContent = "Nemaš još prijatelje.";
} else {
  const friendsArray = JSON.parse(storedFriends);

  // Ako je lista prazna
  if (friendsArray.length === 0) {
    friendsListDiv.textContent = "Nemaš još prijatelje.";
  } else {
    // Pravljenje liste
    for (let i = 0; i < friendsArray.length; i++) {
      const friendEmail = friendsArray[i];

      // Učitamo profil prijatelja (ako postoji na ovom uređaju)
      const friendProfileString = localStorage.getItem("profile_" + friendEmail);

      let friendName = friendEmail; // ako nema imena, bar prikaži email
      let friendImage = ""; // za sada prazno

      if (friendProfileString) {
        const fp = JSON.parse(friendProfileString);
        if (fp.fullName) friendName = fp.fullName;
        // sliku nismo čuvali kao podatak (za MVP je okej da nema)
      }

      // Napravimo "karticu" prijatelja
      const card = document.createElement("div");
      card.style.border = "1px solid #ccc";
      card.style.padding = "10px";
      card.style.marginBottom = "10px";
      card.style.cursor = "pointer";

      // Ime prijatelja
      const nameEl = document.createElement("p");
      nameEl.textContent = friendName;
      card.appendChild(nameEl);

      // Email manjim slovima (da se zna ko je)
      const emailEl = document.createElement("small");
      emailEl.textContent = friendEmail;
      card.appendChild(emailEl);

      // Klik na karticu -> otvara friend.html?user=email
      card.addEventListener("click", function () {
        window.location.href = "friend.html?user=" + encodeURIComponent(friendEmail);
      });

      // Dodaj karticu u listu
      friendsListDiv.appendChild(card);
    }
  }
}

// Nazad na profil
function goBack() {
  window.location.href = "profile.html";
}
