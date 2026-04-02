const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getRaces(season) {
  const response = await fetch(
    `${BASE_URL}/api/races?season=${season}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch races");
  }

  return response.json();
}
