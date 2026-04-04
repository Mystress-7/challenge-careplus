import { getConsultas, salvarConsulta } from "../data/appointments.js";
import { renderCalendar } from "../components/calendar.js";

const calendarCompId = "calendarGrid";
let selectedDate = "2025-10-31"; // Default initial date

const timeSlotsArray = [
    { time: "8:00", available: false },
    { time: "9:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "13:00", available: false },
    { time: "14:00", available: false },
    { time: "15:00", available: false },
    { time: "16:00", available: true }
];

const doctors = [
    { id: 1, name: "Dr. Elias Tirello", spec: "Ortopedista", icon: "bi-person-badge" },
    { id: 2, name: "Dra. Maria Souza", spec: "Dermatologista", icon: "bi-person-video2" },
    { id: 3, name: "Dr. Carlos Mendes", spec: "Cardiologista", icon: "bi-heart-pulse" },
    { id: 4, name: "Dra. Ana Paula", spec: "Pediatra", icon: "bi-emoji-smile" }
];

let displayedDoctors = [...doctors];
let selectedDoctor = doctors[0];

function init() {
    setupSearch();
    renderDoctors();
    renderView();
}

function setupSearch() {
    const searchBtn = document.getElementById("searchBtn");
    const specSelect = document.getElementById("searchSpecialty");
    
    if (searchBtn && specSelect) {
        searchBtn.onclick = () => {
            const spec = specSelect.value;
            if (spec === "Todas") {
                displayedDoctors = [...doctors];
            } else {
                displayedDoctors = doctors.filter(d => d.spec === spec);
            }
            
            if (displayedDoctors.length > 0) {
                // If the selected doctor is not in the filtered list, select the first one available
                if (!selectedDoctor || !displayedDoctors.find(d => d.id === selectedDoctor.id)) {
                    selectedDoctor = displayedDoctors[0];
                }
            } else {
                selectedDoctor = null;
            }
            
            renderDoctors();
            renderView();
            
            // Scroll down to show results
            document.getElementById("doctorsContainer")?.scrollIntoView({ behavior: 'smooth' });
        };
    }
}

function renderDoctors() {
    const dContainer = document.getElementById("doctorsContainer");
    if (!dContainer) return;
    
    dContainer.innerHTML = '<h4 class="month-column-title mb-3">Nossos Médicos & Especialistas</h4>';
    
    if (displayedDoctors.length === 0) {
        dContainer.innerHTML += '<p class="text-muted w-100 text-center">Nenhum médico encontrado com esse filtro.</p>';
        return;
    }

    displayedDoctors.forEach(doc => {
        const col = document.createElement("div");
        col.className = "col-md-3 mb-3";
        
        const isSelected = selectedDoctor && doc.id === selectedDoctor.id;
        
        col.innerHTML = `
            <div class="care-card shadow-sm p-3 text-center" style="cursor: pointer; border: ${isSelected ? '2px solid var(--care-primary)' : '1px solid transparent'}">
                <i class="bi ${doc.icon}" style="font-size: 2rem; color: ${isSelected ? 'var(--care-primary)' : 'var(--text-muted)'};"></i>
                <h6 class="mt-2 text-dark font-weight-bold">${doc.name}</h6>
                <small class="text-muted">${doc.spec}</small>
            </div>
        `;
        
        col.onclick = () => {
            selectedDoctor = doc;
            renderDoctors();
            renderView(); // re-render hours / calendar just in case
            window.scrollTo({top: 0, behavior: 'smooth'}); // Scroll up to see calendar when a doctor is chosen
        };
        
        dContainer.appendChild(col);
    });
}

function renderView() {
    const consultas = getConsultas();
    renderCalendar(calendarCompId, consultas, handleDayClick, selectedDate);
    renderTimeSlots();
    renderRightConsultasList();
}

function handleDayClick(dateStr) {
    selectedDate = dateStr;
    renderView();
}

function renderTimeSlots() {
    const timeSlotsContainer = document.querySelector(".time-slots");
    const documentTitle = document.querySelector(".time-slots")?.previousElementSibling;
    
    if (!selectedDoctor) {
        if (documentTitle) documentTitle.innerText = "Selecione um médico";
        if (timeSlotsContainer) timeSlotsContainer.innerHTML = "<p class='text-muted p-2'>Nenhum médico selecionado.</p>";
        return;
    }

    const [year, month, day] = selectedDate.split("-");
    if (documentTitle) {
        documentTitle.innerText = `Horários Dia ${day}/${month} (${selectedDoctor.name})`;
    }

    if (!timeSlotsContainer) return;
    
    timeSlotsContainer.innerHTML = "";

    const consultas = getConsultas();
    // Filter consults for the specific day AND specific doctor to check availability
    const dayConsultas = consultas.filter(c => c.data === selectedDate && c.doctor === selectedDoctor.name);

    timeSlotsArray.forEach(slot => {
        const btn = document.createElement("button");
        const alreadyBooked = dayConsultas.find(c => c.hora === slot.time);
        
        const isAvailableForUser = slot.available && !alreadyBooked;
        
        btn.innerText = slot.time;
        btn.classList.add("time-slot");
        
        if (isAvailableForUser) {
            btn.classList.add("available");
            btn.onclick = () => handleSchedule(slot.time);
        } else {
            btn.disabled = true;
            if (alreadyBooked && alreadyBooked.type === "user") {
                 btn.classList.add("available");
                 btn.style.backgroundColor = "var(--care-success)";
                 btn.style.color = "white";
                 btn.innerText += " (Seu)";
            }
        }
        
        timeSlotsContainer.appendChild(btn);
    });
}

function renderRightConsultasList() {
    const listContainer = document.getElementById("appointmentListContainer");
    if (!listContainer) return;
    
    listContainer.innerHTML = "";
    const consultas = getConsultas();
    
    // Mostramos todas as consultas do localStorage ordenadas ou filtradas?
    // Vamos mostrar todas as agendadas pelo user.
    const userConsultas = consultas.filter(c => c.type === "user");
    
    if (userConsultas.length === 0) {
        listContainer.innerHTML = "<p class='text-muted p-3'>Nenhuma consulta agendada por você ainda.</p>";
        return;
    }
    
    userConsultas.forEach(app => {
        const dateParts = app.data.split("-");
        const formatData = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        
        const cardHtml = `
             <div class="appointment-list-item">
                <div class="appointment-icon">
                    <!-- Icon placeholder baseado na clínica -->
                    <i class="bi bi-calendar-check" style="color: var(--care-success);"></i>
                </div>
                <div class="appointment-details">
                    <p class="appointment-title">${app.specialty || 'Especialidade'}</p>
                    <p class="appointment-sub">${app.doctor} • Care Plus - Vila Olímpica</p>
                </div>
                <div class="appointment-date text-end">
                    <span class="date-main">${formatData}</span>
                    <span class="status-overbook d-block mt-1 text-success" style="color: var(--care-success) !important;">${app.hora}</span>
                </div>
            </div>
        `;
        listContainer.innerHTML += cardHtml;
    });
}

function handleSchedule(time) {
    if (!selectedDoctor) return;
    
    const confirmMessage = `Deseja confirmar sua consulta com ${selectedDoctor.name} (${selectedDoctor.spec}) para o dia ${selectedDate.split('-').reverse().join('/')} às ${time}?`;
    
    if (confirm(confirmMessage)) {
        const success = salvarConsulta(selectedDate, time, selectedDoctor.name, selectedDoctor.spec);
        if (success) {
            alert('Sua consulta foi agendada com sucesso!');
            renderView(); // Re-render to show the new dot, block time slot, update list
        } else {
            alert('Houve um erro ou este horário já estava reservado para este médico.');
        }
    }
}

// Start application
init();
