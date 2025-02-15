document.addEventListener("DOMContentLoaded", function () {

const sheetID = "18aPcMhMDrqFxb19__bW4fA9-SY1RgLWhQSpcZ2MAgIM";
const sheetName = "providers";
const apiKey = CONFIG.API_KEY;
const SHEET_URL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

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
        const response = await fetch(SHEET_URL);
        const data = await response.json();

        if (!data.values) {
            console.error("No data found in the spreadsheet.");
            return;
        }

        const rows = data.values;
        const headers = rows[0]; // First row = headers
        const providers = rows.slice(1).map(row => {
            return headers.reduce((obj, header, index) => {
                obj[header] = row[index] || ""; // Handle missing data
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
            .slice(0, 9); // ✅ Show only 9 providers per category

        const cardsContainer = document.createElement("div");
        cardsContainer.classList.add("providerdetails-cards-container");

        // ✅ Shuffle images for variety
        const imagesForCategory = defaultImages[category] || [defaultImages["default"]];
        let imageIndex = 0;
        
        
        categoryProviders.forEach(provider => {
            const card = document.createElement("div");
            card.classList.add("providerdetails-card");

            // ✅ Assign category-based image or default image
            let providerImage = imagesForCategory[imageIndex % imagesForCategory.length];
            imageIndex++;
            
            const rating = provider.Rating || "0";
            const reviews = provider.Reviews || "0";
            const website = provider.Website ? provider.Website.trim() : "#"; // Use "#" if website is missing

            // ✅ Static values
            const verified = "✔ Coming Soon";
            const price = "$ Coming Soon";
            const classSchedule = "Coming Soon";
            const registrationStarts = "Coming Soon";
            const reviewsSummary = "Coming Soon";
            const location = provider.Location || "N/A";

            const fullDescription = provider.Description || "No description available";
            const truncatedDescription = fullDescription.split(" ").slice(0, 18).join(" ") + "..";

            card.innerHTML = `
                <img src="${providerImage}" alt="${provider.Name}">
                <h3>${provider.Name}</h3>
                <p class="description">
                        <span class="short-text">${truncatedDescription}</span>
                        <span class="full-text hidden">${fullDescription}</span>
                        <a href="#" class="read-more">Read more</a>
                    </p>

                <div class="provider-info">
                    <div class="left-column">
                        <p><strong>Rating:</strong> ⭐ ${rating} (${reviews})</p>
                        <p><strong>Age:</strong> ${provider.Age || "N/A"}</p>
                        <p><strong>Class Schedule:</strong> ${classSchedule}</p>
                    </div>
                    <div class="right-column">
                        <p><strong>PlanO verified:</strong> ${verified}</p>
                        <p><strong>Price:</strong> ${price}</p>
                        <p><strong>Registration:</strong> ${registrationStarts}</p>
                    </div>
                </div>


                <div class="provider-buttons">
                    <button class="book-now">Book Now</button>
                    <a href="${website}" target="_blank" class="visit-btn" rel="noopener noreferrer">Visit Site</a>
                </div>

                <p class="reviews-summary"><strong>Reviews Summary:</strong> ${reviewsSummary}</p>

                <div class="divider"></div>

                    <div class="footer-info">
                        <p class="location"><strong>Location:</strong> ${location}</p>
                        <span class="tag">Highly Rated</span>
                    </div>
            `;

            cardsContainer.appendChild(card);
        });

        section.appendChild(cardsContainer);
        container.appendChild(section);
    });
    // ✅ Add event listener for "Read More" functionality
    document.querySelectorAll(".read-more").forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            const card = this.closest(".providerdetails-card");
            const shortText = card.querySelector(".short-text");
            const fullText = card.querySelector(".full-text");

            if (fullText.style.display === "none" || fullText.style.display === "") {
                fullText.style.display = "inline";  // Show full description
                shortText.style.display = "none";   // Hide short description
                this.textContent = "Read less";     // Change button text
            } else {
                fullText.style.display = "none";    // Hide full description
                shortText.style.display = "inline"; // Show short description
                this.textContent = "Read more";     // Reset button text
            }
        });
    });
}

// ✅ Fetch provider data on page load
fetchProviders();
});