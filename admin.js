const adminTable = document.querySelector("#adminTable");
const stationForm = document.querySelector("#stationForm");
const adminSearch = document.querySelector("#adminSearch");
const reviewsList = document.querySelector("#reviewsList");
const formTitle = document.querySelector("#formTitle");

let adminStations = fluiStations.map((station) => ({ ...station, reviews: [...station.reviews] }));

function getField(id) {
  return document.querySelector(id);
}

function renderMetrics() {
  const connectorCount = adminStations.reduce((sum, station) => sum + station.connectors.length, 0);
  const averageRating = adminStations.reduce((sum, station) => sum + station.rating, 0) / adminStations.length;
  getField("#metricStations").textContent = adminStations.length;
  getField("#metricConnectors").textContent = connectorCount;
  getField("#metricRating").textContent = averageRating.toFixed(1);
}

function renderTable() {
  const term = adminSearch.value.trim().toLowerCase();
  const rows = adminStations.filter((station) =>
    [station.name, station.address, station.status].join(" ").toLowerCase().includes(term)
  );

  adminTable.innerHTML = rows
    .map((station) => `
      <tr>
        <td><strong>${station.name}</strong><span>${station.address}</span></td>
        <td>${station.connectors.join(", ")}</td>
        <td>${station.power} kW</td>
        <td><span class="status-pill ${station.status.toLowerCase().replaceAll(" ", "-")}">${station.status}</span></td>
        <td><button class="table-action" data-id="${station.id}" type="button">Editar</button></td>
      </tr>
    `)
    .join("");

  adminTable.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => editStation(button.dataset.id));
  });
}

function renderReviews() {
  reviewsList.innerHTML = adminStations
    .map((station) => `
      <article>
        <div>
          <strong>${station.name}</strong>
          <span>${station.rating.toFixed(1)} média</span>
        </div>
        ${station.reviews.map((review) => `
          <p><b>${review.driver} (${review.rate}/5)</b> ${review.text}</p>
        `).join("")}
      </article>
    `)
    .join("");
}

function resetForm() {
  stationForm.reset();
  getField("#stationId").value = "";
  formTitle.textContent = "Cadastrar ponto";
}

function editStation(id) {
  const station = adminStations.find((item) => item.id === id);
  if (!station) return;

  getField("#stationId").value = station.id;
  getField("#nameField").value = station.name;
  getField("#addressField").value = station.address;
  getField("#connectorsField").value = station.connectors.join(", ");
  getField("#powerField").value = station.power;
  getField("#hoursField").value = station.hours;
  getField("#amenitiesField").value = station.amenities.join(", ");
  getField("#statusField").value = station.status;
  formTitle.textContent = "Editar ponto";
}

function upsertStation(event) {
  event.preventDefault();
  const existingId = getField("#stationId").value;
  const payload = {
    id: existingId || `ponto-${Date.now()}`,
    name: getField("#nameField").value,
    address: getField("#addressField").value,
    connectors: getField("#connectorsField").value.split(",").map((item) => item.trim()).filter(Boolean),
    power: Number(getField("#powerField").value),
    chargers: 4,
    hours: getField("#hoursField").value,
    amenities: getField("#amenitiesField").value.split(",").map((item) => item.trim()).filter(Boolean),
    status: getField("#statusField").value,
    rating: existingId ? adminStations.find((station) => station.id === existingId).rating : 4.5,
    queue: "Baixa",
    position: { top: 50, left: 50 },
    reviews: existingId ? adminStations.find((station) => station.id === existingId).reviews : [
      { driver: "Novo motorista", rate: 5, text: "Ponto recém-cadastrado aguardando mais avaliações." }
    ]
  };

  if (existingId) {
    adminStations = adminStations.map((station) => station.id === existingId ? payload : station);
  } else {
    adminStations = [payload, ...adminStations];
  }

  resetForm();
  render();
}

function render() {
  renderMetrics();
  renderTable();
  renderReviews();
}

document.querySelector("#newStationButton").addEventListener("click", resetForm);
stationForm.addEventListener("submit", upsertStation);
adminSearch.addEventListener("input", renderTable);

render();
