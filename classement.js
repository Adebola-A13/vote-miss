const MISS_VOTES_STORAGE_KEY = "missVotes";
const RANKING_ACCESS_SESSION_KEY = "rankingAccessGranted";
const RANKING_ACCESS_CODE = "IMSP2026";

function openRankingAccessModal() {
    return new Promise((resolve) => {
        let overlay = document.getElementById("rankingAccessModal");

        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "rankingAccessModal";
            overlay.className = "access-modal-overlay";
            overlay.innerHTML = `
                <div class="access-modal" role="dialog" aria-modal="true" aria-labelledby="rankingAccessTitle">
                    <h3 id="rankingAccessTitle">Acces protege</h3>
                    <p class="access-modal-subtitle">Entrez le code pour consulter le classement.</p>
                    <form id="accessCodeForm" class="access-code-form">
                        <input type="password" id="accessCodeInput" class="access-code-input" placeholder="Code d'acces" autocomplete="off" required>
                        <p id="accessCodeError" class="access-code-error"></p>
                        <div class="access-code-actions">
                            <button type="button" id="accessBackBtn" class="access-btn access-btn-secondary">Retour</button>
                            <button type="submit" class="access-btn access-btn-primary">Valider</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(overlay);
            overlay.addEventListener("click", (event) => {
                if (event.target === overlay) {
                    resolve(false);
                }
            });
        }

        const form = overlay.querySelector("#accessCodeForm");
        const input = overlay.querySelector("#accessCodeInput");
        const error = overlay.querySelector("#accessCodeError");
        const backBtn = overlay.querySelector("#accessBackBtn");

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
            resolve(true);
        };

        backBtn.onclick = () => {
            overlay.classList.remove("visible");
            resolve(false);
        };

        input.value = "";
        error.textContent = "";
        overlay.classList.add("visible");
        window.requestAnimationFrame(() => input.focus());
    });
}

async function ensureRankingAccess() {
    document.body.classList.add("ranking-locked");

    const hasSessionAccess = sessionStorage.getItem(RANKING_ACCESS_SESSION_KEY) === "1";
    if (hasSessionAccess) {
        document.body.classList.remove("ranking-locked");
        return true;
    }

    const hasAccess = await openRankingAccessModal();
    if (!hasAccess) {
        window.location.href = "index.html";
        return false;
    }

    document.body.classList.remove("ranking-locked");
    return true;
}

const candidates = [
    { id: 1, name: "OUSSOU Anaïs", photo: "images/Anais.jpg" },
    { id: 2, name: "DOS SANTOS Marie-Belle", photo: "images/Marie-Belle.jpg" },
    { id: 3, name: "KPODANHOUE Ange Michelle", photo: "images/Michelle.jpeg" },
    { id: 4, name: "KINTOGANDOU Vanessa", photo: "images/Vanessa.jpg" },
    { id: 5, name: "CHABI-BOUKARI Zahidath", photo: "images/Zahidath.jpg" },
    { id: 6, name: "Kévine DONTE", photo: "images/Kévine.jpg" },
    { id: 7, name: "LOKO Ingrid", photo: "images/Ingrid.jpg" },
    { id: 8, name: "NONWANON Eurielle", photo: "images/eurielle.jpg" },
    { id: 9, name: "AMOUSSOU Isnelle", photo: "images/Isnelle.jpg" },
    { id: 10, name: "ADAM-TOURE Amiratou", photo: "images/Amirath.jpg" },
    { id: 11, name: "HOUENOU Séphora", photo: "images/sephora.jpg" },
    { id: 12, name: "AKOTENOU Octavie", photo: "images/Octavie.jpg" },
    { id: 13, name: "HOUNYO Ornella", photo: "images/Ornella.jpg" },
    { id: 14, name: "KEDOTE Shammel", photo: "images/Shammel.jpg" }
];

const manualValidatedVotes = window.MANUAL_VALIDATED_VOTES || {};

function getAdminValidatedVotes(candidateId) {
    const adminVotes = Number(manualValidatedVotes[candidateId]);
    return Number.isFinite(adminVotes) ? Math.max(0, Math.floor(adminVotes)) : 0;
}

const podiumContainer = document.getElementById("podium");
const rankingTableBody = document.getElementById("rankingTableBody");
const lastUpdated = document.getElementById("lastUpdated");

function formatCandidateId(id) {
    return id.toString().padStart(3, "0");
}

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
        return {};
    }
}

function getRankedCandidates() {
    const storedVotes = getStoredVoteTotals();

    return candidates
        .map((candidate) => {
            const persistedVotes = Number(storedVotes[candidate.id]) || 0;
            return {
                ...candidate,
                totalVotes: getAdminValidatedVotes(candidate.id) + persistedVotes
            };
        })
        .sort((a, b) => {
            if (b.totalVotes !== a.totalVotes) {
                return b.totalVotes - a.totalVotes;
            }
            return a.id - b.id;
        });
}

function renderPodium(rankedCandidates) {
    const medals = ["1", "2", "3"];
    const topThree = rankedCandidates.slice(0, 3);

    podiumContainer.innerHTML = topThree
        .map((candidate, index) => `
            <article class="podium-card place-${index + 1}">
                <div class="place-badge">${medals[index]}</div>
                <img src="${candidate.photo}" alt="${candidate.name}" class="podium-photo">
                <h3>${candidate.name}</h3>
                <p>Candidate n°${formatCandidateId(candidate.id)}</p>
                <strong>${candidate.totalVotes} vote(s)</strong>
            </article>
        `)
        .join("");
}

function renderRankingTable(rankedCandidates) {
    rankingTableBody.innerHTML = rankedCandidates
        .map((candidate, index) => `
            <tr>
                <td>#${index + 1}</td>
                <td class="candidate-cell">
                    <img src="${candidate.photo}" alt="${candidate.name}" class="table-photo">
                    <span>${candidate.name}</span>
                </td>
                <td>${formatCandidateId(candidate.id)}</td>
                <td><strong>${candidate.totalVotes}</strong></td>
            </tr>
        `)
        .join("");
}

function renderRanking() {
    const rankedCandidates = getRankedCandidates();
    renderPodium(rankedCandidates);
    renderRankingTable(rankedCandidates);

    const now = new Date();
    lastUpdated.textContent = `Derniere mise a jour: ${now.toLocaleString("fr-FR")}`;
}

async function initializeRankingPage() {
    const isAllowed = await ensureRankingAccess();
    if (!isAllowed) {
        return;
    }

    window.addEventListener("storage", renderRanking);
    renderRanking();
}

initializeRankingPage();
