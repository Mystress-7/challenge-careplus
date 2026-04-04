const STORAGE_KEY = "minhasConsultas";

export const getConsultas = () => {
  const dados = localStorage.getItem(STORAGE_KEY);

  return dados
    ? JSON.parse(dados)
    : [
        { data: "2026-04-10", hora: "10:00", paciente: "Maria Silva" },
        { data: "2026-04-15", hora: "14:00", paciente: "João Pereira" },
      ];
};

export const salvarConsulta = (novaConsulta) => {
  const atual = getConsultas();
  atual.push(novaConsulta);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(atual));
};
