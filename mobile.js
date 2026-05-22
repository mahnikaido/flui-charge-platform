const loginScreen = document.querySelector("#loginScreen");
const appShell = document.querySelector("#appShell");
const loginForm = document.querySelector("#loginForm");
const connectorFilter = document.querySelector("#connectorFilter");
const powerFilter = document.querySelector("#powerFilter");
const amenityFilter = document.querySelector("#amenityFilter");
const textFilter = document.querySelector("#textFilter");
const stationList = document.querySelector("#stationList");
const nearbyList = document.querySelector("#nearbyList");
const stationDetail = document.querySelector("#stationDetail");
const mapPins = document.querySelector("#mapPins");
const mapFrame = document.querySelector("#mapFrame");
const mapOpenLink = document.querySelector("#mapOpenLink");
const resultCount = document.querySelector("#resultCount");
const filterToggle = document.querySelector("#filterToggle");
const filterPanel = document.querySelector("#filterPanel");
const actionToast = document.querySelector("#actionToast");
const openSettings = document.querySelector("#openSettings");
const closeSettings = document.querySelector("#closeSettings");
const saveSettings = document.querySelector("#saveSettings");
const logoutButton = document.querySelector("#logoutButton");
const settingsName = document.querySelector("#settingsName");
const settingsEmail = document.querySelector("#settingsEmail");
const settingsNameField = document.querySelector("#settingsNameField");
const settingsEmailField = document.querySelector("#settingsEmailField");
const settingsCarField = document.querySelector("#settingsCarField");
const mobileThemeToggle = document.querySelector("#mobileThemeToggle");
const lightModeToggle = document.querySelector("#lightModeToggle");

let selectedStationId = fluiStations[0].id;
let toastTimer;

function setMobileTheme(isLight) {
  document.body.classList.toggle("light-theme", isLight);
  localStorage.setItem("fluiMobileTheme", isLight ? "light" : "dark");
  if (mobileThemeToggle) {
    mobileThemeToggle.textContent = isLight ? "☾" : "☀";
    mobileThemeToggle.setAttribute("aria-label", isLight ? "Alternar modo escuro" : "Alternar modo claro");
  }
  if (lightModeToggle) {
    lightModeToggle.checked = isLight;
  }
}

function toggleMobileTheme() {
  setMobileTheme(!document.body.classList.contains("light-theme"));
}

function login(provider = "Email") {
  loginScreen.classList.add("hidden");
  appShell.classList.remove("hidden");
  sessionStorage.setItem("fluiLoginProvider", provider);
  render();
  showToast(`Login com ${provider} realizado. Bem-vindo ao app.`);
}

function filteredStations() {
  const connector = connectorFilter.value;
  const power = Number(powerFilter.value);
  const amenity = amenityFilter.value;
  const term = textFilter.value.trim().toLowerCase();

  return fluiStations.filter((station) => {
    const hasConnector = connector === "all" || station.connectors.includes(connector);
    const hasPower = station.power >= power;
    const hasAmenity = amenity === "all" || station.amenities.includes(amenity);
    const matchesText = !term || [station.name, station.address, station.connectors.join(" "), station.amenities.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(term);
    return hasConnector && hasPower && hasAmenity && matchesText;
  });
}

function setSelectedStation(id) {
  selectedStationId = id;
  render();
}

function stationMeta(station) {
  return `${station.power} kW • ${station.price} • ${station.rating.toFixed(1)}`;
}

function showToast(message) {
  if (!actionToast) return;
  window.clearTimeout(toastTimer);
  actionToast.textContent = message;
  actionToast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    actionToast.classList.remove("is-visible");
  }, 2600);
}

function renderPins(stations) {
  mapPins.innerHTML = stations
    .map((station) => `
      <button
        class="map-pin ${station.id === selectedStationId ? "selected" : ""}"
        style="top:${station.position.top}%;left:${station.position.left}%"
        aria-label="${station.name}"
        data-id="${station.id}">
        ${station.available}/${station.chargers}
      </button>
    `)
    .join("");

  mapPins.querySelectorAll("button").forEach((pin) => {
    pin.addEventListener("click", () => setSelectedStation(pin.dataset.id));
  });
}

function renderMap(stations) {
  const station = stations.find((item) => item.id === selectedStationId) || stations[0];
  if (!station) return;

  const { lat, lng } = station.coords;
  const query = `${lat},${lng}`;

  mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  mapOpenLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function stationCard(station, compact = false) {
  return `
    <button class="station-card ${station.id === selectedStationId ? "selected" : ""}" data-id="${station.id}">
      <div class="station-card-top">
        <strong>${station.name}</strong>
        <span class="${station.available === 0 ? "busy-pill" : "free-pill"}">${station.available}/${station.chargers} livres</span>
      </div>
      <small>${station.distance} • Espera: ${station.queue === "Baixa" ? "5 min" : station.queue === "Média" ? "12 min" : "18 min"}</small>
      <div class="station-stats">
        <span>${station.power} kW</span>
        <span>${station.rating.toFixed(1)}</span>
        <span>${station.price}</span>
      </div>
      ${compact ? `<small>${station.confirmations} confirmaram funcionando • ${station.reports} reportaram fila</small>` : `<small>${station.connectors.join(" + ")} • ${station.amenities.join(", ")}</small>`}
    </button>
  `;
}

function renderLists(stations) {
  resultCount.textContent = `${stations.length} resultado${stations.length === 1 ? "" : "s"} encontrado${stations.length === 1 ? "" : "s"}`;

  if (!stations.length) {
    stationList.innerHTML = '<p class="empty-state">Nenhum ponto encontrado com esses filtros.</p>';
    nearbyList.innerHTML = '<p class="empty-state">Nenhum ponto próximo encontrado.</p>';
    stationDetail.innerHTML = "";
    return;
  }

  if (!stations.some((station) => station.id === selectedStationId)) {
    selectedStationId = stations[0].id;
  }

  stationList.innerHTML = stations.map((station) => stationCard(station)).join("");
  nearbyList.innerHTML = fluiStations.slice(0, 3).map((station) => stationCard(station, true)).join("");

  document.querySelectorAll(".station-card").forEach((card) => {
    card.addEventListener("click", () => setSelectedStation(card.dataset.id));
  });
}

function renderDetail(stations) {
  const station = stations.find((item) => item.id === selectedStationId);
  if (!station) return;
  const canReserve = station.available > 0 && station.status === "Ativo";

  stationDetail.innerHTML = `
    <div class="detail-topline">
      <span>${station.status}</span>
      <strong>${station.available}/${station.chargers} livres</strong>
    </div>
    <h2>${station.name}</h2>
    <p>${station.address}</p>
    <div class="detail-grid">
      <div><span>Carregadores</span><strong>${station.chargers}</strong></div>
      <div><span>Potência</span><strong>${station.power} kW</strong></div>
      <div><span>Horário</span><strong>${station.hours}</strong></div>
      <div><span>Preço</span><strong>${station.price}</strong></div>
    </div>
    <h3>Conectores</h3>
    <div class="chip-row">${station.connectors.map((item) => `<span>${item}</span>`).join("")}</div>
    <h3>Comodidades</h3>
    <div class="chip-row">${station.amenities.map((item) => `<span>${item}</span>`).join("")}</div>
    <div class="detail-actions">
      <button class="primary-button" type="button" data-reserve="${station.id}" ${canReserve ? "" : "disabled"}>${canReserve ? "Reservar conector" : "Indisponível agora"}</button>
      <a class="secondary-link" target="_blank" rel="noreferrer" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(station.address)}">Traçar rota</a>
    </div>
  `;

  stationDetail.querySelector("[data-reserve]")?.addEventListener("click", () => {
    showToast(`Reserva simulada em ${station.name}. Chegue em até 15 min.`);
  });
}

function renderProfile() {
  document.querySelector("#profileName").textContent = fluiUser.name;
  document.querySelector("#profileEmail").textContent = fluiUser.email;
  document.querySelector("#profileLevel").textContent = `Nível ${fluiUser.level}`;
  document.querySelector("#profileCar").textContent = fluiUser.car;
  document.querySelector("#progressValue").textContent = `${fluiUser.progress}%`;
  document.querySelector("#progressBar").style.width = `${fluiUser.progress}%`;
  document.querySelector("#profileCharges").textContent = fluiUser.charges;
  document.querySelector("#profileCo2").textContent = fluiUser.co2;
  document.querySelector("#profileEco").textContent = fluiUser.ecoScore;
  document.querySelector("#profileAchievements").textContent = fluiUser.achievements.length;
  const achievementIcons = ["🚀", "🌱", "⭐"];
  document.querySelector("#achievementsList").innerHTML = fluiUser.achievements
    .map((item, index) => `
      <article>
        <span class="achievement-icon" aria-hidden="true">${item.icon || achievementIcons[index] || "⭐"}</span>
        <div><strong>${item.title}</strong><p>${item.description}</p></div>
      </article>
    `)
    .join("");
  if (settingsName) settingsName.textContent = fluiUser.name;
  if (settingsEmail) settingsEmail.textContent = fluiUser.email;
  if (settingsNameField) settingsNameField.value = fluiUser.name;
  if (settingsEmailField) settingsEmailField.value = fluiUser.email;
  if (settingsCarField) settingsCarField.value = fluiUser.car;
}

function switchTab(target) {
  document.querySelectorAll(".app-tab").forEach((tab) => tab.classList.remove("active"));
  document.querySelector(`#${target}Tab`).classList.add("active");
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.tabTarget === target);
  });
  document.querySelector(`#${target}Tab`)?.scrollTo({ top: 0, behavior: "smooth" });
}

function openSettingsTab() {
  switchTab("settings");
}

function saveProfileSettings() {
  fluiUser.name = settingsNameField.value.trim() || fluiUser.name;
  fluiUser.email = settingsEmailField.value.trim() || fluiUser.email;
  fluiUser.car = settingsCarField.value;
  renderProfile();
  switchTab("profile");
  showToast("Ajustes do perfil salvos.");
}

function render() {
  const stations = filteredStations();
  renderMap(stations);
  renderPins(stations);
  renderLists(stations);
  renderDetail(stations);
  renderProfile();
}

document.querySelectorAll("[data-login]").forEach((button) => {
  button.addEventListener("click", () => login(button.dataset.loginProvider || "Email"));
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  login("Email");
});

[connectorFilter, powerFilter, amenityFilter, textFilter].forEach((filter) => {
  filter.addEventListener("input", render);
  filter.addEventListener("change", render);
});

document.querySelectorAll("[data-tab-target]").forEach((button) => {
  button.addEventListener("click", () => switchTab(button.dataset.tabTarget));
});

openSettings?.addEventListener("click", openSettingsTab);
closeSettings?.addEventListener("click", () => switchTab("profile"));
saveSettings?.addEventListener("click", saveProfileSettings);
logoutButton?.addEventListener("click", () => {
  appShell.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  showToast("Sessão encerrada.");
});
mobileThemeToggle?.addEventListener("click", toggleMobileTheme);
lightModeToggle?.addEventListener("change", () => setMobileTheme(lightModeToggle.checked));

setMobileTheme(localStorage.getItem("fluiMobileTheme") === "light");

if (filterToggle && filterPanel) {
  filterToggle.addEventListener("click", () => {
    const isOpen = filterPanel.classList.toggle("is-open");
    filterToggle.setAttribute("aria-expanded", String(isOpen));
    filterToggle.textContent = isOpen ? "Ocultar filtros" : "Filtros";
  });
}
