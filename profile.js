// ===============================
// PROFIL – MVP (prosto)
// ===============================

// Uzimamo korisnika iz localStorage
const storedUser = localStorage.getItem("loggedUser");

// Ako nema ulogovanog korisnika -> vrati na login i prekini
if (storedUser === null) {
  window.location.href = "index.html";
  throw new Error("Nema ulogovanog korisnika.");
}

// Pretvaramo string u objekat
const user = JSON.parse(storedUser);
// ===============================
// LOGOUT DUGME
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    // Brišemo trenutno ulogovanog korisnika
    localStorage.removeItem("loggedUser");

    // Vraćamo na login
    window.location.href = "index.html";
  });
}



// ===============================
// PREMIUM DUGME U HEDERU
// (samo vodi na premium.html)
// ===============================

const premiumBtn = document.getElementById("premiumBtn");

if (premiumBtn) {
  if (user.isPremium === true) {
    premiumBtn.textContent = "Premium ✔";
  } else {
    premiumBtn.textContent = "Pređi na Premium";
  }

  premiumBtn.addEventListener("click", function () {
    window.location.href = "premium.html";
  });
}

// ===============================
// PRIKAZ BROJA INDEKSA I GODINE
// ===============================

document.getElementById("indexNumber").textContent = user.indexNumber;
document.getElementById("enrollmentYear").textContent = user.enrollmentYear;

// ===============================
// IME + OPIS (zaključavanje posle Save)
// ===============================

const fullNameInput = document.getElementById("fullNameInput");
const fullNameText = document.getElementById("fullNameText");
const descriptionBox = document.getElementById("description");
const saveButton = document.getElementById("saveProfile");

// Premium dugme za edit (ako postoji u HTML-u)
const editButton = document.getElementById("editProfileBtn");

// Ako je premium, prikaži edit dugme
if (editButton && user.isPremium === true) {
  editButton.style.display = "inline";
}

// Ako je profil već sačuvan ranije, prikaži fiksno i zaključa
if (user.fullName && user.description) {
  fullNameText.textContent = user.fullName;
  fullNameText.style.display = "inline";
  fullNameInput.style.display = "none";

  descriptionBox.value = user.description;
  descriptionBox.disabled = true;

  saveButton.disabled = true;
}

// Klik na "Sačuvaj profil"
saveButton.addEventListener("click", function () {
  const nameValue = fullNameInput.value.trim();
  const descValue = descriptionBox.value.trim();

  if (nameValue === "" || descValue === "") {
    alert("Unesi ime i opis pre čuvanja.");
    return;
  }

  user.fullName = nameValue;
  user.description = descValue;

  // Čuvamo ulogovanog korisnika
  localStorage.setItem("loggedUser", JSON.stringify(user));

  // Čuvamo i profil podatke pod email ključem (za friend view kasnije)
  localStorage.setItem(
    "profile_" + user.email,
    JSON.stringify({ fullName: user.fullName, description: user.description })
  );

  // Zaključavanje prikaza
  fullNameText.textContent = nameValue;
  fullNameText.style.display = "inline";
  fullNameInput.style.display = "none";

  descriptionBox.disabled = true;
  saveButton.disabled = true;

  alert("Profil je sačuvan.");
});

// Klik na "Edituj profil" (premium)
if (editButton) {
  editButton.addEventListener("click", function () {
    if (user.isPremium !== true) return;

    fullNameInput.style.display = "inline";
    fullNameText.style.display = "none";

    if (user.fullName) {
      fullNameInput.value = user.fullName;
    }

    descriptionBox.disabled = false;
    saveButton.disabled = false;
  });
}

// ===============================
// UPLOAD I PRIKAZ PROFILNE SLIKE
// ===============================

const imageInput = document.getElementById("profileImage");
const imagePreview = document.getElementById("imagePreview");

imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];

  if (file) {
    const imageURL = URL.createObjectURL(file);
    imagePreview.src = imageURL;
    imagePreview.style.display = "block";
  }
});

// ===============================
// GENERISANJE QR KODA (unikatan po nalogu)
// QR vodi na friend.html?user=<email>
// ===============================

const qrSmall = document.getElementById("qrSmall");
const qrBig = document.getElementById("qrBig");
const qrModal = document.getElementById("qrModal");

// Samo ako QR elementi postoje u HTML-u
if (qrSmall && qrBig && qrModal) {
  const friendLink =
    window.location.origin +
    window.location.pathname.replace("profile.html", "friend.html") +
    "?user=" +
    encodeURIComponent(user.email);

  const qrUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
    encodeURIComponent(friendLink);

  qrSmall.src = qrUrl;
  qrBig.src = qrUrl;

  qrSmall.addEventListener("click", function () {
    qrModal.style.display = "block";
  });

  qrModal.addEventListener("click", function () {
    qrModal.style.display = "none";
  });
}

// ===============================
// SV (CV) upload + otvaranje PDF
// ===============================

const cvInput = document.getElementById("cvFile");
const openCvButton = document.getElementById("openCvButton");

// Ako elementi postoje
if (cvInput && openCvButton) {
  // Ako već postoji CV ranije, omogući dugme
  const oldCv = localStorage.getItem("cv_" + user.email);
  if (oldCv) {
    openCvButton.disabled = false;
  }

  cvInput.addEventListener("change", function () {
    const file = cvInput.files[0];

    if (file) {
      const cvUrl = URL.createObjectURL(file);

      // Čuvamo url pod email ključem
      localStorage.setItem("cv_" + user.email, cvUrl);

      openCvButton.disabled = false;
      alert("SV je sačuvan.");
    }
  });

  openCvButton.addEventListener("click", function () {
    const saved = localStorage.getItem("cv_" + user.email);

    if (saved) {
      window.open(saved, "_blank");
    } else {
      alert("Nema sačuvanog SV fajla.");
    }
  });
}

// ===============================
// NAVIGACIJA
// ===============================

function goToFriends() {
  window.location.href = "friends.html";
}

function goToJobs() {
  window.location.href = "jobs.html";
}
