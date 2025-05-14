async function fetchOutlets() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Failed to load data');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

function renderOutlets(data) {
  const results = document.getElementById("results");
  results.innerHTML = "";

  if (data.length === 0) {
    results.innerHTML = '<div class="no-results">No matching results.</div>';
    return;
  }

  data.forEach((o, i) => {
    const card = document.createElement("div");
    card.className = "card";
    const mapId = `map${i}`;

    const imageSlider = o.images.map(img =>
      `<img src="${img}" alt="${o.name} photo">`).join('');

    card.innerHTML = `
      <div class="image-slider">${imageSlider}</div> <br>
      <h2>${o.name}</h2><br>
      <p><strong>City:</strong> ${o.city}</p>
      <p>${o.desc}</p>
      <p><strong>Hours:</strong> ${o.hours}</p><br>
      <a href="https://www.google.com/maps?q=${o.lat},${o.lon}" target="_blank">➜ on Google map</a>
      <div class="map" id="${mapId}"></div>
    `;

    results.appendChild(card);

    requestAnimationFrame(() => {
      const map = L.map(mapId, { zoomControl: false }).setView([o.lat, o.lon], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);
      L.marker([o.lat, o.lon]).addTo(map);
      setTimeout(() => map.invalidateSize(), 200);
    });
  });
}

document.getElementById("search").addEventListener("input", async () => {
  const q = document.getElementById("search").value.toLowerCase();
  const outlets = await fetchOutlets();
  const filtered = outlets.filter(o =>
    o.name.toLowerCase().includes(q) || o.city.toLowerCase().includes(q)
  );
  renderOutlets(filtered);
});

window.onload = async () => {
  const outlets = await fetchOutlets();
  renderOutlets(outlets);
};