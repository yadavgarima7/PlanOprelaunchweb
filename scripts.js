document.addEventListener("DOMContentLoaded", function () {

    const CSV_FILE_PATH = "data/providers2.csv"; // Path to your local CSV file

// ✅ Default category-based images
const defaultImages = {
    "Swimming": ["assets/swimdefault1.jpg", 
        "assets/swimdefault2.jpg", 
        "assets/swimdefault3.jpg", 
        "assets/swimdefault4.png",
        "assets/swimdefault5.png",
        "assets/swimdefault6.jpg",
        "assets/swimdefault7.jpg",
        "assets/swimdefault8.jpg",
        "assets/swimdefault9.jpg",],

    "Gymnastics": ["assets/gymnastics1.jpg",
        "assets/gymnastics2.jpg",
        "assets/gymnastics3.jpg",
        "assets/gymnastics4.jpeg",
        "assets/gymnastics5.png",
        "assets/gymnastics7.jpg"],

    "default": "assets/default.jpg"
};


// ✅ Function to Fetch Providers from Google Sheets
async function fetchProviders() {
    try {
        const response = await fetch(CSV_FILE_PATH);
        const text = await response.text();
        const rows = text.split("\n").map(row => row.split(",")); // Parse CSV

        if (rows.length < 2) {
            console.error("CSV file is empty or incorrectly formatted.");
            return;
        }

        const headers = rows.shift();
        const providers = rows.map(row => {
            return headers.reduce((obj, header, index) => {
                obj[header.trim()] = row[index] ? row[index].trim() : "";
                return obj;
            }, {});
        });

        displayProviders(providers);
    } catch (error) {
        console.error("Error fetching provider data:", error);
    }
}

// ✅ Function to Display Providers in Sections
function displayProviders(providers) {
    const categories = ["Swimming", "Gymnastics"];
    const container = document.getElementById("providerdetails-container");
    container.innerHTML = "";

    categories.forEach(category => {
        const section = document.createElement("div");
        section.classList.add("provider-category");
        section.innerHTML = `<h2>${category} Providers <span class="prototype-label">(prototype)</span></h2>`;

        const categoryProviders = providers
            .filter(provider => provider.Category === category)
            .slice(0, 9);

        const cardsContainer = document.createElement("div");
        cardsContainer.classList.add("providerdetails-cards-container");

        let imageIndex = 0;
        
        
        categoryProviders.forEach(provider => {
            const card = document.createElement("div");
            card.classList.add("providerdetails-card");

            const providerImage = defaultImages[category] 
                ? defaultImages[category][imageIndex % defaultImages[category].length] 
                : defaultImages["default"];
            imageIndex++;

            const fullDescription = provider.Description || "No description available";

            card.innerHTML = `
                    <img src="${providerImage}" alt="${provider.Name}">
                    <h3>${provider.Name}</h3>
                    <p class="description">${fullDescription}</p>

                    <div class="provider-info">
                        <div class="left-column">
                            <p><strong>Rating:</strong> ⭐ ${provider.Rating || "0"} (${provider.Reviews || "0"})</p>
                            <p><strong>Age:</strong> ${provider.Age || "N/A"}</p>
                            <p><strong>Class Schedule:</strong> Coming Soon</p>
                        </div>
                        <div class="right-column">
                            <p><strong>PlanO verified:</strong> ✔ Coming Soon</p>
                            <p><strong>Price:</strong> $ Coming Soon</p>
                            <p><strong>Registration:</strong> Coming Soon</p>
                        </div>
                    </div>

                    <div class="provider-buttons">
                        <button class="book-now">Book Now</button>
                        <a href="${provider.Website || "#"}" target="_blank" class="visit-btn" rel="noopener noreferrer">Visit Site</a>
                    </div>

                    <p class="reviews-summary"><strong>Reviews Summary:</strong> Coming Soon</p>

                    <div class="divider"></div>
                    <div class="footer-info">
                        <p class="location"><strong>Location:</strong> ${provider.Location || "N/A"}</p>
                        <span class="tag">Highly Rated</span>
                    </div>
                `;

            cardsContainer.appendChild(card);
        });

        section.appendChild(cardsContainer);
        container.appendChild(section);
    });
}

// ✅ Fetch provider data on page load
fetchProviders();
});