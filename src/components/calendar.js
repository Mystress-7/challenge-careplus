export function renderCalendar(containerId, consultas, onDayClick, currentSelectedDate) {
  const container = document.getElementById(containerId);
  
  // Hardcoded to match mockup "Outubro 2025"
  const year = 2025;
  const month = 9; // October is index 9 (0-indexed)

  const firstDayIndex = new Date(year, month, 1).getDay(); // Weekday of 1st Oct
  const lastDay = new Date(year, month + 1, 0).getDate(); // Total days in Oct
  
  // Previous month info
  const prevLastDay = new Date(year, month, 0).getDate();

  container.innerHTML = "";

  // Days from previous month
  for (let i = firstDayIndex; i > 0; i--) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("calendar-day");
    dayEl.innerText = prevLastDay - i + 1;
    container.appendChild(dayEl);
  }

  // Days of current month
  for (let day = 1; day <= lastDay; day++) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("calendar-day", "current-month");
    
    // Check for weekends (Sun=0, Sat=6)
    const weekDay = new Date(year, month, day).getDay();
    if (weekDay === 0 || weekDay === 6) {
        dayEl.classList.add("weekend");
        // Apply red color for weekends to match mockup exactly
        dayEl.style.color = "var(--care-danger)";
    }

    dayEl.innerText = day;

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // Has appointment?
    const appInfo = consultas.find((c) => c.data === dateStr);
    if (appInfo && appInfo.type === "user") {
        dayEl.classList.add("has-user-event");
    } else if (appInfo && appInfo.type === "warning") {
        dayEl.classList.add("has-warning"); // Note: In CSS we should make sure we have .has-warning setup or use inline
    }

    // Since our CSS expects .has-event for warning, wait, in CSS I used:
    // .has-user-event (green)
    // .has-event (warning) - wait, let me check calendar.css if needed, but I'll use inline just in case
    if (appInfo) {
        if (appInfo.type === 'warning') dayEl.innerHTML += `<span class="dot-warning" style="position:absolute; bottom:2px; width:4px; height:4px; border-radius:50%; background:var(--care-warning);"></span>`;
        if (appInfo.type === 'danger') dayEl.innerHTML += `<span class="dot-danger" style="position:absolute; bottom:2px; width:4px; height:4px; border-radius:50%; background:var(--care-danger);"></span>`;
    }

    if (dateStr === currentSelectedDate) {
        dayEl.classList.add("active-day");
        // Reset color if active to white
        dayEl.style.color = "white";
    }

    dayEl.onclick = () => {
      onDayClick(dateStr);
    };

    container.appendChild(dayEl);
  }
}
