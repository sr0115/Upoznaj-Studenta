// ===============================
// JOBS – MVP
// ===============================

// Provera da li je korisnik ulogovan
const storedUser = localStorage.getItem("loggedUser");
if (!storedUser) {
  window.location.href = "index.html";
  throw new Error("Nema ulogovanog korisnika.");
}

const user = JSON.parse(storedUser);

// ===============================
// UČITAVANJE POSLOVA (MVP – localStorage)
// ===============================

// Key gde čuvamo sve poslove
const jobsKey = "jobs_all";

// Ako nema ništa, napravićemo par demo poslova
if (!localStorage.getItem(jobsKey)) {
  const demoJobs = [
    {
      id: 1,
      title: "Konobar (vikendom)",
      shortDesc: "Rad u kafiću na Voždovcu",
      longDesc: "Tražimo studenta za rad subota/nedelja. Fleksibilno vreme.",
      contactEmail: "posao1@example.com"
    },
    {
      id: 2,
      title: "Junior dizajn (Canva)",
      shortDesc: "Pravljenje postova za Instagram",
      longDesc: "Potrebno pravljenje 10 postova nedeljno, rad od kuće.",
      contactEmail: "posao2@example.com"
    }
  ];

  localStorage.setItem(jobsKey, JSON.stringify(demoJobs));
}

// Uzimamo poslove iz storage-a
let jobs = JSON.parse(localStorage.getItem(jobsKey));

// ===============================
// PRIKAZ LISTE POSLOVA
// ===============================

const jobsListDiv = document.getElementById("jobsList");

function renderJobsList() {
  // očistimo prikaz
  jobsListDiv.innerHTML = "";

  // ako nema poslova
  if (jobs.length === 0) {
    jobsListDiv.textContent = "Nema objavljenih poslova.";
    return;
  }

  // pravimo kartice
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];

    const card = document.createElement("div");
    card.style.border = "1px solid #ccc";
    card.style.padding = "10px";
    card.style.marginBottom = "10px";
    card.style.cursor = "pointer";

    const titleEl = document.createElement("p");
    titleEl.innerHTML = "<strong>" + job.title + "</strong>";
    card.appendChild(titleEl);

    const shortEl = document.createElement("p");
    shortEl.textContent = job.shortDesc;
    card.appendChild(shortEl);

    // klik na karticu -> detalji
    card.addEventListener("click", function () {
      openDetails(job.id);
    });

    jobsListDiv.appendChild(card);
  }
}

renderJobsList();

// ===============================
// DETALJI POSLA + POŠALJI CV
// ===============================

const detailsDiv = document.getElementById("jobDetails");
const detailTitle = document.getElementById("detailTitle");
const detailShort = document.getElementById("detailShort");
const detailLong = document.getElementById("detailLong");
const detailEmail = document.getElementById("detailEmail");

const sendCvBtn = document.getElementById("sendCvBtn");
const closeDetailsBtn = document.getElementById("closeDetailsBtn");

let currentJob = null;

function openDetails(jobId) {
  // nađemo posao po id
  for (let i = 0; i < jobs.length; i++) {
    if (jobs[i].id === jobId) {
      currentJob = jobs[i];
      break;
    }
  }

  if (!currentJob) return;

  // popunimo detalje
  detailTitle.textContent = currentJob.title;
  detailShort.textContent = currentJob.shortDesc;
  detailLong.textContent = currentJob.longDesc;
  detailEmail.textContent = currentJob.contactEmail;

  // prikažemo detalje
  detailsDiv.style.display = "block";
}

// Zatvori detalje
closeDetailsBtn.addEventListener("click", function () {
  detailsDiv.style.display = "none";
  currentJob = null;
});

// Pošalji CV (MVP)
sendCvBtn.addEventListener("click", function () {
  if (!currentJob) return;

  // Uzimamo URL CV-ja ulogovanog korisnika (ako postoji)
  const cvUrl = localStorage.getItem("cv_" + user.email);

  // MVP: ne šaljemo stvarno fajl, nego otvaramo mail klijent
  // U mail ubacimo tekst gde piše da korisnik ima CV (i njegov email)
  const subject = "Prijava za posao: " + currentJob.title;

  let body = "Zdravo,%0D%0A%0D%0A";
  body += "Prijavljujem se za posao: " + currentJob.title + "%0D%0A";
  body += "Moj email: " + user.email + "%0D%0A";

  if (cvUrl) {
    body += "Imam sačuvan SV u aplikaciji (MVP demo).%0D%0A";
  } else {
    body += "Nemam uploadovan SV u aplikaciji.%0D%0A";
  }

  body += "%0D%0A";
  body += "Pozdrav!";

  // Otvaramo mailto link
  window.location.href =
    "mailto:" + currentJob.contactEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + body;
});

// ===============================
// PREMIUM: NUDIM POSAO
// ===============================

const notPremiumMsg = document.getElementById("notPremiumMsg");
const offerJobSection = document.getElementById("offerJobSection");

// Prikaz sekcije u zavisnosti od premium statusa
if (user.isPremium === true) {
  offerJobSection.style.display = "block";
} else {
  notPremiumMsg.style.display = "block";
}

// Objavljivanje posla
const publishBtn = document.getElementById("publishJobBtn");

publishBtn.addEventListener("click", function () {
  // Ako nije premium, ne radi ništa (sigurnost)
  if (user.isPremium !== true) return;

  const title = document.getElementById("jobTitle").value.trim();
  const shortDesc = document.getElementById("jobShort").value.trim();
  const longDesc = document.getElementById("jobLong").value.trim();
  const contactEmail = document.getElementById("jobEmail").value.trim();

  if (title === "" || shortDesc === "" || longDesc === "" || contactEmail === "") {
    alert("Popuni sva polja za posao.");
    return;
  }

  // Napravimo novi ID (najveći + 1)
  let newId = 1;
  if (jobs.length > 0) {
    newId = jobs[jobs.length - 1].id + 1;
  }

  const newJob = {
    id: newId,
    title: title,
    shortDesc: shortDesc,
    longDesc: longDesc,
    contactEmail: contactEmail
  };

  // Dodamo u listu i sačuvamo
  jobs.push(newJob);
  localStorage.setItem(jobsKey, JSON.stringify(jobs));

  // Očistimo polja
  document.getElementById("jobTitle").value = "";
  document.getElementById("jobShort").value = "";
  document.getElementById("jobLong").value = "";
  document.getElementById("jobEmail").value = "";

  alert("Posao je objavljen!");

  // Osvežimo listu
  renderJobsList();
});

// ===============================
// NAZAD
// ===============================

function goBack() {
  window.location.href = "profile.html";
}
