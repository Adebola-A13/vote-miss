// Données des candidates (simulées)
const candidates = [
    { id: 1, name: "# Ida", photo: "etudiante_16.png", description: "Une âme passionnée déterminée à transformer ses rêves en réalité grâce à son courage et sa créativité." },
    { id: 2, name: "# Esther A.", photo: "etudiante_1.jpeg", description: "Passionnée de mode, timide mais pleine d'humour, elle allie calme et gentillesse avec élégance." },
    { id: 3, name: "# Esther K.", photo: "etudiante_6.jpeg", description: "À part la science, j'aime la nourriture, la lecture et je suis poète." },
    { id: 4, name: "# Roliath", photo: "etudiante_7.jpeg", description: "Portée par une grâce infinie, elle puise sa force en celui qui la fortifie." },
    { id: 6, name: "# Jeanelle", photo: "etudiante_5.jpeg", description: "Souriante et joviale, elle allie avec grâce bonne humeur et sérieux dans ses études." },
    { id: 7, name: "# Hérita", photo: "etudiante_8.png", description: "Une jeune fille réservée au calme apaisant, dotée d'une grande générosité." },
    { id: 10, name: "# Laurinda", photo: "etudiante_15.png", description: "Cerveau analytique et littéraire, elle excelle autant en mathématiques que dans la résolution d'énigmes." },
    { id: 12, name: "# Exaucée", photo: "etudiante_14.jpeg", description: "Ambitieuse, passionnée de foi, portée par la grâce et guidée par la vision de Dieu." },
    { id: 13, name: "# Rifiène", photo: "etudiante_9.png", description: "Un mélange harmonieux de créativité artistique et d'ambition méthodique." },
    { id: 15, name: "# Firdaosse", photo: "etudiante_13.jpeg", description: "Mélomane au grand cœur, toujours prête à soutenir son prochain avec bienveillance." },
    { id: 16, name: "# Océane", photo: "etudiante_18.png", description: "Optimiste invétérée, elle transforme chaque défi en opportunité avec studieuse passion." },
    { id: 17, name: "# Gisèle", photo: "etudiante_11.jpeg", description: "Réservée mais tenace, elle cultive l'excellence à force de persévérance et de curiosité." },
    { id: 19, name: "# Fumilayo", photo: "etudiante_10.png", description: "Engagée pour le développement durable de son pays, elle s'inspire de la nature et des livres." },
    { id: 20, name: "# Hanyath", photo: "etudiante_17.jpeg", description: "Résilience incarnée, elle illumine son entourage par son altruisme et sa force tranquille." },
    { id: 21, name: "# Christy", photo: "etudiante_12.jpeg", description: "Optimisme contagieux et gentillesse spontanée, elle sait adapter son caractère aux situations." },
    { id: 23, name: "# Marielle", photo: "etudiante_2.jpeg", description: "Élégance discrète mais mémorable, son silence parle plus fort que les mots." },
    { id: 25, name: "# Gertrude", photo: "etudiante_3.jpeg", description: "Sensible et audacieuse, elle navigue entre douceur et détermination au gré de ses aspirations." },
    { id: 26, name: "# Belvida", photo: "belvida.jpeg", description: "Énigmatique poétesse en quête d'horizons lointains, elle écrit son destin à l'encre des étoiles." }
];

const container = document.getElementById('candidatesContainer');
const voteCounts = document.getElementById('voteCounts');
let selectedVotes = {};

candidates.forEach(candidate => {
    const card = document.createElement('div');
    card.className = 'candidate-card';

    const formattedId = candidate.id.toString().padStart(3, '0');

    card.innerHTML = `
        <div class="candidate-info">
            <div class="candidate-number">Candidate n°${formattedId}</div>
            <img src="${candidate.photo}" alt="${candidate.name}" class="candidate-photo">
            <div class="candidate-details">
                <h3>${candidate.name}</h3>
                <p>${candidate.description}</p>
            </div>
        </div>
        <div class="vote-section">
            <div class="vote-controls">
                <button class="vote-btn vote-minus" data-id="${candidate.id}">-</button>
                <input type="number" class="vote-input" data-id="${candidate.id}" value="0" min="0">
                <button class="vote-btn vote-plus" data-id="${candidate.id}">+</button>
            </div>
        </div>
    `;

    container.appendChild(card);
});

container.addEventListener('click', function(e) {
    const target = e.target;
    const candidateId = target.getAttribute('data-id');

    if (!candidateId) return;

    if (target.classList.contains('vote-plus')) {
        selectedVotes[candidateId] = (selectedVotes[candidateId] || 0) + 1;
    } else if (target.classList.contains('vote-minus')) {
        if (selectedVotes[candidateId] > 0) {
            selectedVotes[candidateId]--;
        }
    }

    updateVoteDisplay(candidateId);
    updateVoteCountsDisplay();
});

container.addEventListener('input', function(e) {
    if (e.target.classList.contains('vote-input')) {
        const candidateId = e.target.getAttribute('data-id');
        let value = parseInt(e.target.value);
        selectedVotes[candidateId] = isNaN(value) || value < 0 ? 0 : value;
        updateVoteDisplay(candidateId);
        updateVoteCountsDisplay();
    }
});

function updateVoteDisplay(candidateId) {
    const input = document.querySelector(`.vote-input[data-id="${candidateId}"]`);
    if (input) {
        input.value = selectedVotes[candidateId] || 0;
    }
}

function updateVoteCountsDisplay() {
    const votedCandidates = candidates.filter(c => selectedVotes[c.id] > 0);

    if (votedCandidates.length === 0) {
        voteCounts.innerHTML = '<p class="no-votes">Aucun vote enregistré</p>';
        return;
    }

    let html = '<div class="votes-container">';
    html += '<h4>Vos sélections :</h4>';
    html += '<ul class="votes-list">';

    votedCandidates.forEach(candidate => {
        html += `
            <li class="vote-item">
                <span class="candidate-vote-name">${candidate.name}</span>
                <span class="vote-quantity">${selectedVotes[candidate.id]} vote(s)</span>
                <button class="remove-vote" data-id="${candidate.id}">×</button>
            </li>
        `;
    });

    html += '</ul>';
    html += '<div class="total-votes">Total: ' + Object.values(selectedVotes).reduce((a, b) => a + b, 0) + ' vote(s)</div>';
    html += '</div>';

    voteCounts.innerHTML = html;

    document.querySelectorAll('.remove-vote').forEach(button => {
        button.addEventListener('click', function() {
            const candidateId = this.getAttribute('data-id');
            selectedVotes[candidateId] = 0;
            updateVoteDisplay(candidateId);
            updateVoteCountsDisplay();
        });
    });
}

document.getElementById("confirmVotes").addEventListener("click", function() {
    if (Object.values(selectedVotes).every(v => v === 0)) {
        alert("Veuillez sélectionner au moins un vote.");
        return;
    }

    const numeroWhatsApp = "22963071792";
    const votesText = candidates
        .filter(c => selectedVotes[c.id] > 0)
        .map(c => {
            const formattedId = c.id.toString().padStart(3, '0');
            return `#${formattedId} ${c.name}: ${selectedVotes[c.id]} vote(s)`;
        })
        .join("\n");

    const message = encodeURIComponent(
        `Bonjour, voici mes votes pour Miss Prépa:\n\n${votesText}\n\nTotal: ${Object.values(selectedVotes).reduce((a, b) => a + b, 0)} vote(s)\n\nCordialement`
    );

    window.open(`https://wa.me/${numeroWhatsApp}?text=${message}`, "_blank");
});

document.getElementById("cancelVotes").addEventListener("click", function() {
    candidates.forEach(candidate => {
        selectedVotes[candidate.id] = 0;
        updateVoteDisplay(candidate.id);
    });
    updateVoteCountsDisplay();
});

document.getElementById("toggleVoteCounts").addEventListener("click", function() {
    const voteCountsDiv = document.getElementById("voteCounts");
    voteCountsDiv.style.display = voteCountsDiv.style.display === "none" ? "block" : "none";
    this.textContent = voteCountsDiv.style.display === "none" ? "▼" : "▲";
});

document.getElementById('voteTrigger').addEventListener('click', function() {
    document.getElementById('voteSummary').classList.toggle('visible');
});

updateVoteCountsDisplay();

// Animation IntersectionObserver (optionnel)
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
});
