import { getConsultas } from "../data/appointments.js";
import { renderCalendar } from "../components/calendar.js";

const calendarComp = document.getElementById("calendarComponent");
const sidePanel = document.getElementById("sidePanel");
const btnExpand = document.getElementById("btnExpand");
const btnClose = document.getElementById("btnClose");
const listContainer = document.getElementById("appointmentList");

function init() {
  const consultas = getConsultas();

  renderCalendar("calendarDays", consultas, (dateStr) => {
    showAgenda(dateStr, consultas);
  });

  btnExpand.addEventListener("click", (e) => {
    e.preventDefault();
    toggleComponents();
  });

  btnClose.addEventListener("click", toggleComponents);
}

function toggleComponents() {
  calendarComp.classList.toggle("expanded");

  sidePanel.classList.toggle("active");

  const isExpanded = calendarComp.classList.contains("expanded");
  btnExpand.innerText = isExpanded ? "Recolher" : "Ver mais";
}

function showAgenda(dateStr, consultas) {
  const filtradas = consultas.filter((c) => c.data === dateStr);

  if (!sidePanel.classList.contains("active")) {
    toggleComponents();
  }

  if (filtradas.length === 0) {
    listContainer.innerHTML = `<p class="text-muted">Sem consultas para o dia ${dateStr.split("-")[2]}.</p>`;
    return;
  }

  listContainer.innerHTML = filtradas
    .map(
      (c) => `
        <div class="appointment-item shadow-sm">
            <span class="badge bg-primary mb-2">${c.hora}</span>
            <div class="fw-bold text-dark">${c.paciente}</div>
            <small class="text-muted">Consulta agendada</small>
        </div>
    `,
    )
    .join("");
}

init();
