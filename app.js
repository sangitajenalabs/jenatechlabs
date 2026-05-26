// =========================================
// ACTIVE NAV LINK ON SCROLL
// =========================================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(section => {

    const sectionTop = section.offsetTop - 120;

    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }

  });

  navLinks.forEach(a => {

    a.classList.remove("active");

    if (a.getAttribute("href") === "#" + current) {
      a.classList.add("active");
    }

  });

});

// =========================================
// NETWORK PARTICLE ANIMATION
// =========================================

const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = 400;

let dots = Array.from({ length: 40 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.5,
  vy: (Math.random() - 0.5) * 0.5
}));

function animate() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach((d, i) => {

    d.x += d.vx;
    d.y += d.vy;

    // bounce edges
    if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
    if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

    // dots
    ctx.beginPath();
    ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#635bff";
    ctx.fill();

    // connection lines
    for (let j = i + 1; j < dots.length; j++) {

      let dx = d.x - dots[j].x;
      let dy = d.y - dots[j].y;

      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(dots[j].x, dots[j].y);

        ctx.strokeStyle =
          `rgba(99,91,255,${1 - dist / 120})`;

        ctx.lineWidth = 0.5;
        ctx.stroke();

      }

    }

  });

  requestAnimationFrame(animate);

}

animate();

// =========================================
// MOBILE MENU
// =========================================

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {

  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");

});

// close menu after click
document.querySelectorAll(".mobile-menu a").forEach(link => {

  link.addEventListener("click", () => {

    mobileMenu.classList.remove("active");
    hamburger.classList.remove("active");

  });

});

// =========================================
// NAVBAR SCROLL EFFECT
// =========================================

window.addEventListener("scroll", () => {

  const nav = document.getElementById("navbar");

  nav.classList.toggle(
    "scrolled",
    window.scrollY > 20
  );

});

// =========================================
// ACTIVE LINK CLICK
// =========================================

function setActive(element) {

  const links = document.querySelectorAll(
    ".nav-links a, .mobile-menu a"
  );

  links.forEach(link =>
    link.classList.remove("active")
  );

  element.classList.add("active");

}

// =========================================
// LEAFLET MAP
// =========================================

const map = L.map("mapPreview", {
  zoomControl: false,
  attributionControl: false
}).setView([20.2961, 85.8245], 15);

// basemap
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 19
  }
).addTo(map);

// car icon
const carIcon = L.icon({
  iconUrl:
    "https://maps.gstatic.com/mapfiles/ms2/micons/cabs.png",
  iconSize: [28, 28]
});

// vehicle state
let center = {
  lat: 20.2961,
  lng: 85.8245
};

let vehicle = {
  lat: center.lat,
  lng: center.lng
};

let angle = 0;
const speedFactor = 0.0006;
const maxOffset = 0.008;

// marker
const marker = L.marker(
  [vehicle.lat, vehicle.lng],
  { icon: carIcon }
).addTo(map);

// route
let path = [[vehicle.lat, vehicle.lng]];

const line = L.polyline(path, {
  color: "#635bff",
  weight: 3
}).addTo(map);

// animation
setInterval(() => {

  let oldLat = vehicle.lat;
  let oldLng = vehicle.lng;

  angle += (Math.random() - 0.5) * 0.25;

  let newLat =
    vehicle.lat + Math.cos(angle) * speedFactor;

  let newLng =
    vehicle.lng + Math.sin(angle) * speedFactor;

  let dLat = newLat - center.lat;
  let dLng = newLng - center.lng;

  if (
    Math.abs(dLat) < maxOffset &&
    Math.abs(dLng) < maxOffset
  ) {

    vehicle.lat = newLat;
    vehicle.lng = newLng;

  } else {

    angle += Math.PI / 2;

  }

  marker.setLatLng([
    vehicle.lat,
    vehicle.lng
  ]);

  path.push([
    vehicle.lat,
    vehicle.lng
  ]);

  if (path.length > 40) {
    path.shift();
  }

  line.setLatLngs(path);

  // smooth follow
  map.setView(
    [vehicle.lat, vehicle.lng],
    map.getZoom(),
    {
      animate: true,
      duration: 1
    }
  );

}, 2000);

// =========================================
// RESPONSIVE CANVAS
// =========================================

window.addEventListener("resize", () => {

  canvas.width = window.innerWidth;
  canvas.height = 400;

});
