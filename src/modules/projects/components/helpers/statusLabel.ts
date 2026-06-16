export const getStatusLabel = (status: string) => {
  switch (status) {
    case "en_curso":
      return "En Curso";
    case "planificacion":
      return "Planificación";
    case "completado":
      return "Completado";
    case "pausado":
      return "Pausado";
    default:
      return "Unknown";
  }
};
