const VOTE_PRICE = 100;
const MISS_VOTES_STORAGE_KEY = "missVotes";
const RANKING_ACCESS_SESSION_KEY = "rankingAccessGranted";
const RANKING_ACCESS_CODE = "IMSP2026";
const AUTO_REPLY_DELAY_MS = 1600;

const candidates = [
    { id: 1, name: "OUSSOU Anaïs", photo: "images/Anais.jpg", description: "Plus qu'un visage, une vision. Plus qu'une candidate, une FEMME d'impact."},
    { id: 2, name: "DOS SANTOS Marie-Belle", photo: "images/Marie-Belle.jpg", description: "Quand la foi guide l'ambition, l'impossible devient destin. Croyez en moi."},
    { id: 3, name: "KPODANHOUE Ange Michelle", photo: "images/Michelle.jpeg", description: "Femme :Pas besoin de permission pour briller, votez pour une lumière  douce et authentique."},
    { id: 4, name: "KINTOGANDOU Vanessa", photo: "images/Vanessa.jpg", description: "L'élégance qui agit, le cœur qui ose. Votez pour une couronne authentique."},
    { id: 5, name: "CHABI-BOUKARI Zahidath", photo: "images/Zahidath.jpg", description: "L'élégance pour posture, le travail pour armure. Tenace aujourd'hui, triomphante demain."},
    { id: 6, name: "Kévine DONTE", photo: "images/Kévine.jpg", description: "Je ne subis pas ma vie, je l'écris. L'encre de mon histoire, l'art de mon destin."},
    { id: 7, name: "LOKO Ingrid", photo: "images/Ingrid.jpg", description: "La beauté captive, mais les valeurs marquent les esprits. Marquez le mien de votre vote."},
    { id: 8, name: "NONWANON Eurielle", photo: "images/eurielle.jpg", description: "L'ambition pour moteur, la détermination pour boussole. Visons ensemble l'élévation."},
    { id: 9, name: "AMOUSSOU Isnelle", photo: "images/Isnelle.jpg", description: "La foi pour essence, la confiance pour puissance. Je suis la lumière qui s'impose à vous."},
    { id: 10, name: "ADAM-TOURE Amiratou", photo: "images/Amirath.jpg", description: "Portée par la foi, propulsée par l'esprit. Votre vote est ma seule couronne."},
    { id: 11, name: "HOUENOU Séphora", photo: "images/sephora.jpg", description: "Forger l'avenir avec l'acier de la confiance. Ensemble vers un destin radieux."},
    { id: 12, name: "AKOTENOU Octavie", photo: "images/Octavie.jpg", description: "Analyser, oser, rimer : là où l'intelligence se transforme en éloquence."},
    { id: 13, name: "HOUNYO Ornella", photo: "images/Ornella.jpg", description: "Bâtir plutôt que briser : je fais de l'amour la force de mon engagement."},
    { id: 14, name: "KEDOTE Shammel", photo: "images/Shammel.jpg", description: "Je n'ai peut-être pas la démarche ni l'allure parfaite mais j'ai une détermination face à toute épreuve. Votez pour l'authenticité ✨"},
    { id: 15, name: "BIYAOU Fortunelle", photo:"images/Fortunelle.jpg", description: "Une femme : une histoire ,des valeurs, une foi inébranlable. Ensemble, voyons plus loin que le reflet dans un miroir"}
];

const container = document.getElementById("candidatesContainer");
const voteCounts = document.getElementById("voteCounts");
const cartBar = document.getElementById("cartBar");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const modalTotal = document.getElementById("modalTotal");
const voteSummary = document.getElementById("voteSummary");
const toggleVoteCountsBtn = document.getElementById("toggleVoteCounts");

const selectedVotes = {};

function getStoredVoteTotals() {
    const rawVotes = localStorage.getItem(MISS_VOTES_STORAGE_KEY);
    if (!rawVotes) {
        return {};
    }

    try {
        const parsedVotes = JSON.parse(rawVotes);
        if (!parsedVotes || typeof parsedVotes !== "object" || Array.isArray(parsedVotes)) {
            return {};
        }

        return Object.entries(parsedVotes).reduce((cleanVotes, [candidateId, value]) => {
            const safeValue = Math.max(0, Math.floor(Number(value) || 0));
            if (safeValue > 0) {
                cleanVotes[candidateId] = safeValue;
            }
            return cleanVotes;
        }, {});
    } catch (error) {
        console.log("Erreur chargement votes cumulés");
        return {};
    }
}

function persistSelectionToTotalVotes() {
    const storedVotes = getStoredVoteTotals();

    candidates.forEach((candidate) => {
        const newVotes = selectedVotes[candidate.id] || 0;
        if (newVotes > 0) {
            const currentVotes = Number(storedVotes[candidate.id]) || 0;
            storedVotes[candidate.id] = currentVotes + newVotes;
        }
    });

    localStorage.setItem(MISS_VOTES_STORAGE_KEY, JSON.stringify(storedVotes));
}

function formatCandidateId(id) {
    return id.toString().padStart(3, "0");
}

function openRankingAccessModal(onValidated) {
    let overlay = document.getElementById("rankingAccessModal");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "rankingAccessModal";
        overlay.className = "access-modal-overlay";
        overlay.innerHTML = `
            <div class="access-modal" role="dialog" aria-modal="true" aria-labelledby="accessModalTitle">
                <h3 id="accessModalTitle">Acces au classement</h3>
                <p class="access-modal-subtitle">Entrez le code pour ouvrir la page classement.</p>
                <form id="accessCodeForm" class="access-code-form">
                    <input type="password" id="accessCodeInput" class="access-code-input" placeholder="Code d'acces" autocomplete="off" required>
                    <p id="accessCodeError" class="access-code-error"></p>
                    <div class="access-code-actions">
                        <button type="button" id="accessCancelBtn" class="access-btn access-btn-secondary">Annuler</button>
                        <button type="submit" class="access-btn access-btn-primary">Valider</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) {
                overlay.classList.remove("visible");
            }
        });
    }

    const form = overlay.querySelector("#accessCodeForm");
    const input = overlay.querySelector("#accessCodeInput");
    const error = overlay.querySelector("#accessCodeError");
    const cancelBtn = overlay.querySelector("#accessCancelBtn");

    form.onsubmit = (event) => {
        event.preventDefault();
        const codeValue = input.value.trim();

        if (codeValue !== RANKING_ACCESS_CODE) {
            error.textContent = "Code incorrect.";
            input.focus();
            input.select();
            return;
        }

        sessionStorage.setItem(RANKING_ACCESS_SESSION_KEY, "1");
        overlay.classList.remove("visible");
        if (typeof onValidated === "function") {
            onValidated();
        }
    };

    cancelBtn.onclick = () => {
        overlay.classList.remove("visible");
    };

    input.value = "";
    error.textContent = "";
    overlay.classList.add("visible");
    window.requestAnimationFrame(() => input.focus());
}

function getTotalVotes() {
    return Object.values(selectedVotes).reduce((sum, value) => sum + value, 0);
}

function getTotalAmount() {
    return getTotalVotes() * VOTE_PRICE;
}

function renderCandidates() {
    candidates.forEach((candidate) => {
        const card = document.createElement("div");
        card.className = "candidate-card";
        card.innerHTML = `
            <div class="candidate-info">
                <div class="candidate-number">Candidate n°${formatCandidateId(candidate.id)}</div>
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
        selectedVotes[candidate.id] = 0;
    });
}

function updateVoteDisplay(candidateId) {
    const input = document.querySelector(`.vote-input[data-id="${candidateId}"]`);
    if (input) {
        input.value = selectedVotes[candidateId] || 0;
    }
}

function updateVoteCountsDisplay() {
    const votedCandidates = candidates.filter((candidate) => selectedVotes[candidate.id] > 0);

    if (votedCandidates.length === 0) {
        voteCounts.innerHTML = '<p class="no-votes">Aucun vote enregistré</p>';
        return;
    }

    const listItems = votedCandidates
        .map(
            (candidate) => `
                <li class="vote-item">
                    <span class="candidate-vote-name">${candidate.name}</span>
                    <span class="vote-quantity">${selectedVotes[candidate.id]} vote(s)</span>
                    <button class="remove-vote" data-id="${candidate.id}" aria-label="Retirer ${candidate.name}">x</button>
                </li>
            `
        )
        .join("");

    voteCounts.innerHTML = `<ul class="votes-list">${listItems}</ul>`;
}

function updateSummaryUI() {
    const totalVotes = getTotalVotes();
    const totalAmount = getTotalAmount();

    cartCount.textContent = totalVotes;
    cartTotal.textContent = totalAmount;
    modalTotal.textContent = `${totalAmount} Frs`;

    cartBar.classList.toggle("visible", totalVotes > 0);

    updateVoteCountsDisplay();
}

function resetVotes() {
    Object.keys(selectedVotes).forEach((id) => {
        selectedVotes[id] = 0;
        updateVoteDisplay(id);
    });
    updateSummaryUI();
}

function setVoteCount(candidateId, value) {
    const safeValue = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    selectedVotes[candidateId] = safeValue;
    updateVoteDisplay(candidateId);
    updateSummaryUI();
}

container.addEventListener("click", (event) => {
    const target = event.target;
    const candidateId = Number(target.getAttribute("data-id"));

    if (!candidateId) {
        return;
    }

    if (target.classList.contains("vote-plus")) {
        setVoteCount(candidateId, (selectedVotes[candidateId] || 0) + 1);
        return;
    }

    if (target.classList.contains("vote-minus")) {
        setVoteCount(candidateId, (selectedVotes[candidateId] || 0) - 1);
        return;
    }
});

container.addEventListener("input", (event) => {
    if (!event.target.classList.contains("vote-input")) {
        return;
    }

    const candidateId = Number(event.target.getAttribute("data-id"));
    const value = Number(event.target.value);
    setVoteCount(candidateId, value);
});

voteCounts.addEventListener("click", (event) => {
    if (!event.target.classList.contains("remove-vote")) {
        return;
    }

    const candidateId = Number(event.target.getAttribute("data-id"));
    setVoteCount(candidateId, 0);
});

toggleVoteCountsBtn.addEventListener("click", () => {
    const isHidden = voteCounts.style.display === "none" || voteCounts.style.display === "";
    voteCounts.style.display = isHidden ? "block" : "none";
    toggleVoteCountsBtn.textContent = isHidden ? "▲" : "▼";
});

document.getElementById("voteTrigger").addEventListener("click", () => {
    if (getTotalVotes() === 0) {
        alert("Veuillez sélectionner au moins un vote avant de continuer.");
        return;
    }

    voteSummary.classList.add("visible");
});

function closeModal() {
    voteSummary.classList.remove("visible");
}

function generateVoteReference() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `VM-${timestamp}-${randomPart}`;
}

function showAutoReplyToast(reference, totalVotes, totalAmount) {
    let toast = document.getElementById("autoReplyToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "autoReplyToast";
        toast.className = "auto-reply-toast";
        document.body.appendChild(toast);
    }

    toast.innerHTML = `
        <p><strong>Message automatique :</strong> Votre vote est en cours de traitement.</p>
        <p>Reference: <strong>${reference}</strong></p>
        <p>Total: ${totalVotes} vote(s) · ${totalAmount} Frs</p>
    `;

    toast.classList.add("visible");
    clearTimeout(showAutoReplyToast.hideTimer);
    showAutoReplyToast.hideTimer = setTimeout(() => {
        toast.classList.remove("visible");
    }, 6500);
}

document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelVotes").addEventListener("click", () => {
    resetVotes();
    closeModal();
});

voteSummary.addEventListener("click", (event) => {
    if (event.target === voteSummary) {
        closeModal();
    }
});

document.querySelectorAll('a[href="classement.html"]').forEach((rankingLink) => {
    rankingLink.addEventListener("click", (event) => {
        event.preventDefault();
        openRankingAccessModal(() => {
            window.location.href = "classement.html";
        });
    });
});

document.getElementById("confirmVotes").addEventListener("click", () => {
    if (getTotalVotes() === 0) {
        alert("Veuillez sélectionner au moins un vote.");
        return;
    }

    const totalVotes = getTotalVotes();
    const totalAmount = getTotalAmount();
    const voteReference = generateVoteReference();

    persistSelectionToTotalVotes();

    const numeroWhatsApp = "2290158184796";
    const votesText = candidates
        .filter((candidate) => selectedVotes[candidate.id] > 0)
        .map((candidate) => `${candidate.name} (N°${formatCandidateId(candidate.id)}): ${selectedVotes[candidate.id]} vote(s)`)
        .join("\n");

    const message = encodeURIComponent(
        `Bonjour, voici mes votes pour Miss Prépa:\n\n${votesText}\n\nTotal votes: ${totalVotes}\nMontant: ${totalAmount} Frs\nReference: ${voteReference}\n\nCordialement`
    );

    window.open(`https://wa.me/${numeroWhatsApp}?text=${message}`, "_blank");
    setTimeout(() => {
        showAutoReplyToast(voteReference, totalVotes, totalAmount);
    }, AUTO_REPLY_DELAY_MS);

    resetVotes();
    closeModal();
});

renderCandidates();
updateSummaryUI();
voteCounts.style.display = "none";
