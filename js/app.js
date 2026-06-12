// Relational Area Database Mock Dataset Mirroring the Architectural Schema Guide
const geoDatabase = {
    "Dhaka": {
        "Dhaka District": ["Mirpur", "Uttara", "Gulshan", "Badda", "Dhanmondi"],
        "Gazipur": ["Board Bazar", "Konabari", "Ch चौराहे"]
    },
    "Chattogram": {
        "Chattogram District": ["Panchlaish", "Double Mooring", "Halishahar"],
        "Cox's Bazar": ["Sadar", "Ukhiya", "Teknaf"]
    }
};

// Static Property Array Matching Data Relational Target Criteria
const mockListings = [
    { id: 1, title: "Premium Single Room near University", type: "Single Room", division: "Dhaka", district: "Dhaka District", thana: "Mirpur", rent: 5500, phone: "+880 1711-112233" },
    { id: 2, title: "Spacious Family Flat with Balcony", type: "Flat", division: "Dhaka", district: "Dhaka District", thana: "Dhanmondi", rent: 22000, phone: "+880 1822-445566" },
    { id: 3, title: "Affordable Sublet for Bachelor / Student", type: "Sublet", division: "Dhaka", district: "Dhaka District", thana: "Badda", rent: 8000, phone: "+880 1933-778899" },
    { id: 4, title: "Cozy Hostel Seat with WiFi & Meals", type: "Hostel Seat", division: "Dhaka", district: "Dhaka District", thana: "Uttara", rent: 4500, phone: "+880 1544-001122" },
    { id: 5, title: "Modern Double Bed Flat Area", type: "Flat", division: "Chattogram", district: "Chattogram District", thana: "Panchlaish", rent: 18000, phone: "+880 1655-334455" }
];

// Element Selectors
const divSelect = document.getElementById('divisionSelect');
const distSelect = document.getElementById('districtSelect');
const thanaSelect = document.getElementById('thanaSelect');
const budgetRange = document.getElementById('budgetRange');
const budgetValue = document.getElementById('budgetValue');
const listingsGrid = document.getElementById('listingsGrid');

// Dynamic Interactive Events initialization
window.addEventListener('DOMContentLoaded', () => {
    // Populate Division Node Values
    for (let div in geoDatabase) {
        let opt = document.createElement('option');
        opt.value = div;
        opt.textContent = div;
        divSelect.appendChild(opt);
    }
    renderListings(mockListings);
});

// Dynamic Budget Slider Node Realtime feedback
budgetRange.addEventListener('input', (e) => {
    budgetValue.textContent = parseInt(e.target.value).toLocaleString() + " TK";
});

// Cascading Layer 1 (Division changed -> Populate Districts)
divSelect.addEventListener('change', (e) => {
    distSelect.innerHTML = '<option value="" selected disabled>Select District</option>';
    thanaSelect.innerHTML = '<option value="" selected disabled>Select Thana</option>';
    thanaSelect.disabled = true;
    
    const districts = geoDatabase[e.target.value];
    if (districts) {
        distSelect.disabled = false;
        for (let dist in districts) {
            let opt = document.createElement('option');
            opt.value = dist;
            opt.textContent = dist;
            distSelect.appendChild(opt);
        }
    }
});

// Cascading Layer 2 (District changed -> Populate Thanas)
distSelect.addEventListener('change', (e) => {
    thanaSelect.innerHTML = '<option value="" selected disabled>Select Thana</option>';
    const selectedDiv = divSelect.value;
    const thanas = geoDatabase[selectedDiv][e.target.value];
    if (thanas) {
        thanaSelect.disabled = false;
        thanas.forEach(thana => {
            let opt = document.createElement('option');
            opt.value = thana;
            opt.textContent = thana;
            thanaSelect.appendChild(opt);
        });
    }
});

// Rendering Component Grid Engine Layout (FR-3.3 Compliance)
function renderListings(dataset) {
    listingsGrid.innerHTML = '';
    if (dataset.length === 0) {
        listingsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-folder-open text-muted fs-1 mb-2"></i>
                <p class="text-muted">No rooms currently match your requested operational filters.</p>
            </div>`;
        return;
    }

    dataset.forEach(item => {
        const cardCol = document.createElement('div');
        cardCol.className = 'col-md-6 col-lg-4';
        cardCol.innerHTML = `
            <div class="card listing-card h-100 position-relative">
                <span class="badge-room-type">${item.type}</span>
                <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=400&h=250" class="card-img-top rounded-top" alt="Room Render">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="price-tag">${item.rent.toLocaleString()} TK<span class="text-muted fs-6 font-normal">/mo</span></span>
                        </div>
                        <h6 class="fw-bold card-title text-dark">${item.title}</h6>
                        <p class="text-muted small mb-3"><i class="fa-solid fa-location-dot text-danger me-1"></i>${item.thana}, ${item.district}</p>
                    </div>
                    <button onclick="revealContact('${item.phone}')" class="btn btn-outline-primary btn-sm w-100 fw-medium">
                        <i class="fa-solid fa-phone me-1"></i> Contact Landlord Directly
                    </button>
                </div>
            </div>`;
        listingsGrid.appendChild(cardCol);
    });
}

// Logic Filter Mapping Engine Algorithm (FR-3.2)
function filterListings() {
    const selectedDiv = divSelect.value;
    const selectedDist = distSelect.value;
    const selectedThana = thanaSelect.value;
    const selectedType = document.getElementById('typeSelect').value;
    const maxBudget = parseInt(budgetRange.value);

    const filtered = mockListings.filter(item => {
        const matchDiv = !selectedDiv || item.division === selectedDiv;
        const matchDist = !selectedDist || item.district === selectedDist;
        const matchThana = !selectedThana || item.thana === selectedThana;
        const matchType = selectedType === 'All' || item.type === selectedType;
        const matchBudget = item.rent <= maxBudget;

        return matchDiv && matchDist && matchThana && matchType && matchBudget;
    });

    renderListings(filtered);
    
    // Auto scroll down to showcase feed
    document.getElementById('featured-listings').scrollIntoView({ behavior: 'smooth' });
}

function resetFilters() {
    document.getElementById('searchForm').reset();
    distSelect.disabled = true;
    thanaSelect.disabled = true;
    budgetValue.textContent = "15,000 TK";
    renderListings(mockListings);
}

function revealContact(phoneNumber) {
    document.getElementById('modalPhone').textContent = phoneNumber;
    const modal = new bootstrap.Modal(document.getElementById('contactModal'));
    modal.show();
}