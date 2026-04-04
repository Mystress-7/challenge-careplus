export function renderCalendar(containerId, consultas, onDayClick) {
  const container = document.getElementById(containerId);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  container.innerHTML = "";

  for (let i = 0; i < firstDayIndex; i++) {
    container.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= lastDay; day++) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("day");
    dayEl.innerText = day;

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (consultas.some((c) => c.data === dateStr)) {
      dayEl.classList.add("has-appointment");
    }

    dayEl.onclick = () => {
      document
        .querySelectorAll(".day")
        .forEach((d) => d.classList.remove("active"));
      dayEl.classList.add("active");
      onDayClick(dateStr);
    };

    container.appendChild(dayEl);
  }
}
