console.log("✅ map.js loaded");
const statusEl = document.getElementById("status");
const mapEl = document.getElementById("map");

function setStatus(msg) {
  statusEl.textContent = msg;
  console.log("[status]", msg);
}

setStatus("Map script loaded…");

const width = mapEl.clientWidth || window.innerWidth;
const height = mapEl.clientHeight || (window.innerHeight - 60);

const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const projection = d3.geoNaturalEarth1()
  .scale(width / 6.2)
  .translate([width / 2, height / 2]);

const path = d3.geoPath(projection);
const g = svg.append("g");

async function loadWorld() {
  setStatus("Loading world map…");
  const url = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

  let world;
  try {
    world = await d3.json(url);
  } catch (e) {
    console.error("World map fetch failed:", e);
    setStatus("World map failed to load (check internet/CDN).");
    throw e;
  }

  const countries = topojson.feature(world, world.objects.countries);

  g.append("path")
    .datum(countries)
    .attr("d", path)
    .attr("fill", "#f5f5f5")
    .attr("stroke", "#ccc");
}

async function loadPoints() {
  setStatus("Loading points…");
  let fc;

  try {
    const res = await fetch("/api/points");
    if (!res.ok) throw new Error(`GET /api/points failed: ${res.status}`);
    fc = await res.json();
  } catch (e) {
    console.error("Points fetch failed:", e);
    setStatus("Points failed to load (check /api/points).");
    throw e;
  }

  const features = Array.isArray(fc.features) ? fc.features : [];
  g.selectAll("circle.point")
    .data(features, d => d.properties?.id)
    .join("circle")
    .attr("class", "point")
    .attr("cx", d => projection(d.geometry.coordinates)[0])
    .attr("cy", d => projection(d.geometry.coordinates)[1])
    .attr("r", 4)
    .attr("opacity", 0.85)
    .append("title")
    .text(d => `${d.properties.name} (${d.properties.type})`);

  setStatus(`Loaded ${features.length} members`);
}

(async function init() {
  try {
    await loadWorld();
    await loadPoints();
  } catch (e) {
    // status already set in the failing function
    console.error("Init failed:", e);
  }
})();