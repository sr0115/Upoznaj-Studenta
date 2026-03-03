const storedUser = localStorage.getItem("loggedUser");

if (!storedUser) {
  window.location.href = "index.html";
  throw new Error("Nema ulogovanog korisnika.");
}

const user = JSON.parse(storedUser);

const friendsListDiv = document.getElementById("friendsList");

// Uzimamo listu prijatelja iz localStorage-a
const key = "friends_" + user.email;
const storedFriends = localStorage.getItem(key);

if (!storedFriends) {
  friendsListDiv.textContent = "Nemaš još prijatelje.";
} else {
  const friendsArray = JSON.parse(storedFriends);

  if (friendsArray.length === 0) {
    friendsListDiv.textContent = "Nemaš još prijatelje.";
  } else {
    for (let i = 0; i < friendsArray.length; i++) {
      const friendEmail = friendsArray[i];

      // Učitavanje profila prijatelja
      const friendProfileString = localStorage.getItem("profile_" + friendEmail);

      let friendName = friendEmail;
      let friendImage = "";

      if (friendProfileString) {
        const fp = JSON.parse(friendProfileString);
        if (fp.fullName) friendName = fp.fullName;        
      }

      // Kartica prijatelja
      const card = document.createElement("div");
      card.style.border = "1px solid #ccc";
      card.style.padding = "10px";
      card.style.marginBottom = "10px";
      card.style.cursor = "pointer";

      const nameEl = document.createElement("p");
      nameEl.textContent = friendName;
      card.appendChild(nameEl);

      const emailEl = document.createElement("small");
      emailEl.textContent = friendEmail;
      card.appendChild(emailEl);

      card.addEventListener("click", function () {
        window.location.href = "friend.html?user=" + encodeURIComponent(friendEmail);
      });

      friendsListDiv.appendChild(card);
    }
  }
}

// Nazad na profil
function goBack() {
  window.location.href = "profile.html";
}
