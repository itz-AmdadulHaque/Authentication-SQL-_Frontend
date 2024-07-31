export function formatDate(isoString) {
  const date = new Date(isoString);
  const options = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const dt = date.toLocaleString("en-US", options);

  return `${dt.split(',')[2]}, ${dt.split(',')[0]} ${dt.split(',')[1]}`
}
