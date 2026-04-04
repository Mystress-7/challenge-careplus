const STORAGE_KEY = "careplus_consultas";

export const getConsultas = () => {
  const dados = localStorage.getItem(STORAGE_KEY);

  return dados
    ? JSON.parse(dados)
    : [
        { data: "2025-10-13", hora: "09:00", type: "user" },
        { data: "2025-10-15", hora: "10:00", type: "warning" },
        { data: "2025-10-31", hora: "16:00", type: "danger" }
      ];
};

export const salvarConsulta = (data, hora, doctorName = "Dr(a). Padrão", specialty = "Clínica Médica") => {
  const atual = getConsultas();
  
  // Check if already exists to prevent duplicate (basic validation)
  const exists = atual.find(c => c.data === data && c.hora === hora);
  if (!exists) {
    atual.push({ data, hora, type: "user", doctor: doctorName, specialty }); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(atual));
    return true;
  }
  return false;
};
