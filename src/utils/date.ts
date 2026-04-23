export const formatDateDMY = (date: string | Date) => {
  if (!date) return "";
  const dObj = typeof date === "string" ? new Date(date) : date;
  const day = String(dObj.getDate()).padStart(2, "0");
  const month = String(dObj.getMonth() + 1).padStart(2, "0");
  const year = dObj.getFullYear();
  return `${day}/${month}/${year}`;
};

export function formatDate(date: Date | string) {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(d);
}

