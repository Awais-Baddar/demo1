// Global state
let allProperties = [];
let filteredProperties = [];
let currentView = "buy"; // 'buy' or 'rent'

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadProperties();
});

// Generate dummy properties with working Unsplash URLs
function loadProperties() {
  const cities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi"];
  const types = ["Residential", "Commercial", "Agricultural"];
  const descriptions = [
    "Modern apartment with excellent amenities",
    "Spacious house with garden",
    "Premium commercial property",
    "Luxury villa with pool",
    "Affordable starter home",
  ];

  const imageUrls = [
    "https://images.unsplash.com/photo-1564013799-ab7b9c51bbf8?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1570129477492-45c003alskd?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1564014286-fcc160100858?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1460072523909-0accb5fa57d8?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1500382017468-f049863256ce?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1512623222099-be4a5bc8557f?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1523217582562-430f63602022?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1530587191325-3bbc2b36bae8?w=500&h=400&fit=crop",
    "https://images.unsplash.com/photo-1432405972618-2d226680e773?w=500&h=400&fit=crop",
  ];

  // Generate 12 properties
  allProperties = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `${types[i % 3]} Property ${i + 1}`,
    city: cities[i % 4],
    type: types[i % 3],
    beds: Math.floor(Math.random() * 5) + 1,
    baths: Math.floor(Math.random() * 4) + 1,
    sqft: Math.floor(Math.random() * 5000) + 1000,
    price: Math.floor(Math.random() * 50000000) + 5000000,
    rentPrice: Math.floor(Math.random() * 100000) + 20000,
    description: descriptions[i % descriptions.length],
    image: imageUrls[i],
    featured: i < 3,
  }));

  displayProperties();
}

// Display properties
function displayProperties() {
  const container = document.getElementById("propertiesContainer");
  const propertiesToShow =
    filteredProperties.length > 0 ? filteredProperties : allProperties;

  if (propertiesToShow.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><h3>No properties found. Try adjusting your filters.</h3></div>';
    return;
  }

  container.innerHTML = propertiesToShow
    .map(
      (prop) => `
                <div class="property-card">
                    <div style="position: relative;">
                        <img src="${prop.image}" alt="${prop.title}" class="property-image" loading="lazy">
                        <div class="property-type-badge">${currentView === "buy" ? "🏷️ For Sale" : "🔑 For Rent"}</div>
                    </div>
                    <div class="property-info">
                        <div class="property-location">📍 ${prop.city}</div>
                        <h3 class="property-title">${prop.title}</h3>
                        <p class="property-description">${prop.description}</p>
                        <div class="property-features">
                            <div class="feature"><span class="feature-icon">🛏️</span> ${prop.beds} Beds</div>
                            <div class="feature"><span class="feature-icon">🚿</span> ${prop.baths} Baths</div>
                            <div class="feature"><span class="feature-icon">📐</span> ${prop.sqft.toLocaleString()} sqft</div>
                        </div>
                        <div class="property-price">
                            ${
                              currentView === "buy"
                                ? `PKR ${(prop.price / 1000000).toFixed(1)}M`
                                : `PKR ${prop.rentPrice.toLocaleString()}/mo`
                            }
                            <div class="property-price-label">${currentView === "buy" ? "Buy Now" : "Monthly Rent"}</div>
                        </div>
                        <button class="property-action-btn" onclick="viewDetails(${prop.id})">
                            ${currentView === "buy" ? "💰 View Details" : "📅 Book Viewing"}
                        </button>
                    </div>
                </div>
            `,
    )
    .join("");
}

// Filter properties
function filterProperties() {
  const propertyType = document.getElementById("propertyType").value;
  const city = document.getElementById("city").value;
  const priceRange = document.getElementById("priceRange").value;

  filteredProperties = allProperties.filter((prop) => {
    let match = true;

    if (propertyType && prop.type !== propertyType) match = false;
    if (city && prop.city !== city) match = false;

    if (priceRange && currentView === "buy") {
      const [min, max] =
        priceRange === "0-5M"
          ? [0, 5000000]
          : priceRange === "5M-10M"
            ? [5000000, 10000000]
            : priceRange === "10M-50M"
              ? [10000000, 50000000]
              : [50000000, 9999999999];
      if (prop.price < min || prop.price > max) match = false;
    }

    return match;
  });

  displayProperties();
}

// Toggle between buy and rent
function toggleView() {
  currentView = currentView === "buy" ? "rent" : "buy";
  filteredProperties = [];
  displayProperties();
  document.querySelector(".btn-toggle").textContent =
    currentView === "buy" ? "Switch to Rent" : "Switch to Buy";
}

// View property details
function viewDetails(propertyId) {
  const property = allProperties.find((p) => p.id === propertyId);
  if (!property) return;

  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
                <img src="${property.image}" alt="${property.title}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;">
                <div class="modal-details">
                    <h3>${property.title}</h3>
                    <p><strong>Location:</strong> ${property.city}</p>
                    <p><strong>Type:</strong> ${property.type}</p>
                    <p><strong>Bedrooms:</strong> ${property.beds}</p>
                    <p><strong>Bathrooms:</strong> ${property.baths}</p>
                    <p><strong>Square Feet:</strong> ${property.sqft.toLocaleString()} sqft</p>
                    <p><strong>Price:</strong> ${
                      currentView === "buy"
                        ? `PKR ${(property.price / 1000000).toFixed(1)}M`
                        : `PKR ${property.rentPrice.toLocaleString()}/month`
                    }</p>
                    <p><strong>Description:</strong> ${property.description}</p>
                </div>
            `;
  document.getElementById("propertyModal").style.display = "block";
}

// Close modal
function closeModal() {
  document.getElementById("propertyModal").style.display = "none";
}

// Submit inquiry form
function submitInquiry(event) {
  event.preventDefault();
  const name = event.target[0].value;
  const email = event.target[1].value;
  const phone = event.target[2].value;

  showSuccessMessage(
    `✅ Thank you ${name}! Your inquiry has been sent to m.awaisbaddar@gmail.com`,
  );
  closeModal();
  event.target.reset();
}

// Show success message
function showSuccessMessage(text) {
  const message = document.createElement("div");
  message.className = "success-message";
  message.textContent = text;
  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 4000);
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("propertyModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});
