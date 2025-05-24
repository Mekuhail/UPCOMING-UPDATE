let currentUserUid = null;
let currentGrade = 5;
let currentGame = "speedDrill"; // Default game
let currentListenerRef = null;
let confettiActive = false;

window.addEventListener("DOMContentLoaded", () => {
    const gradeTabs = document.querySelectorAll(".grade-tabs button");
    const gameTabs = document.querySelectorAll(".game-tabs button");
    const toggleBtn = document.getElementById("toggleLeaderboardBtn");
    const leaderboardList = document.querySelector(".leaderboard-list");
    const currentGameStatName = document.getElementById("current-game-stat-name");
    const currentGradeStatName = document.getElementById("current-grade-stat-name");

    if (!toggleBtn || !leaderboardList || !currentGameStatName || !currentGradeStatName) {
        console.error("Missing DOM elements for leaderboard.");
        return;
    }

    function updateStatDisplay() {
        currentGameStatName.textContent = currentGame === "speedDrill" ? "Speed Drill" : "RoonRun";
        currentGradeStatName.textContent = currentGrade;
    }

    gameTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            gameTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentGame = tab.dataset.game;
            updateStatDisplay();
            loadLeaderboardData();
        });
    });

    gradeTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            gradeTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentGrade = parseInt(tab.dataset.grade, 10);
            updateStatDisplay();
            loadLeaderboardData();
        });
    });

    // Set initial active tabs and stat display
    document.querySelector(`.game-tabs button[data-game='${currentGame}']`).classList.add("active");
    document.querySelector(`.grade-tabs button[data-grade='${currentGrade}']`).classList.add("active");
    updateStatDisplay();

    leaderboardList.classList.add("collapsed");
    toggleBtn.addEventListener("click", () => {
        leaderboardList.classList.toggle("collapsed");
        toggleBtn.textContent = leaderboardList.classList.contains("collapsed")
            ? "Show Full Leaderboard ▼"
            : "Hide Full Leaderboard ▲";
        playSound("click");
    });

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUserUid = user.uid;
        } else {
            currentUserUid = null; 
            console.warn("No user logged in.");
        }
        loadLeaderboardData(); // Load data once auth state is known
    });

    initConfetti();
});

function loadLeaderboardData() {
    const loadingState = document.getElementById("loading-state");
    if (loadingState) {
        loadingState.style.display = "flex";
    }
    clearLeaderboard();
    // Add a small delay for UI updates if needed, then attach listener
    // setTimeout(() => attachLeaderboardListener(currentGame, currentGrade), 100); 
    attachLeaderboardListener(currentGame, currentGrade);
}

const soundEffects = {
    click: new Audio("click.mp3"),
    achievement: new Audio("achievement.mp3"),
    leaderboard: new Audio("achievement.mp3")
};

function playSound(sound) {
    try {
        if (soundEffects[sound]) {
            soundEffects[sound].currentTime = 0;
            soundEffects[sound].play().catch(e => console.log("Sound error:", e));
        }
    } catch (e) {
        console.log("Sound error:", e);
    }
}

function attachLeaderboardListener(game, grade) {
    if (currentListenerRef) {
        currentListenerRef.off(); // Detach previous listener
    }

    // Path will now include the game type: scores/speedDrill/5 or scores/roonRun/5
    const path = `scores/${game}/${grade}`;
    console.log(`Fetching leaderboard from: ${path}`);
    currentListenerRef = firebase.database().ref(path);

    currentListenerRef.on("value", snapshot => {
        const data = snapshot.val();
        console.log(`Leaderboard data for ${game} - Grade ${grade}:`, data);

        const loader = document.getElementById("loading-state");
        if (loader) loader.style.display = "none";

        if (!data) {
            clearLeaderboard(); // Clears podium, list, and user stats
            return;
        }

        const players = Object.entries(data).map(([uid, playerData]) => ({
            uid,
            username: playerData.username || "Anonymous", // Fallback for username
            score: playerData.score || 0 // Fallback for score
        })).sort((a, b) => b.score - a.score);

        updatePodium(players.slice(0, 3));
        updateList(players.slice(3));
        highlightUser(players);

        playSound("leaderboard");

        const userIndex = players.findIndex(p => p.uid === currentUserUid);
        if (userIndex >= 0 && userIndex < 3) {
            showConfetti();
        }
    }, error => {
        console.error("Firebase listener error:", error);
        const loader = document.getElementById("loading-state");
        if (loader) loader.style.display = "none";
        clearLeaderboard(); // Clear display on error
    });
}

function clearLeaderboard() {
    [".rank-1", ".rank-2", ".rank-3"].forEach(rankSelector => {
        const el = document.querySelector(rankSelector);
        if (el) {
            el.querySelector(".username").textContent = "---";
            el.querySelector(".score").textContent = "Score: ---";
            el.classList.remove("highlight");
            const achievementIcon = el.querySelector(".achievement-icon");
            if (achievementIcon) achievementIcon.remove();
        }
    });

    const list = document.querySelector(".leaderboard-list");
    if (list) list.innerHTML = "<li class=\"no-data\">No scores yet for this category.</li>";

    document.getElementById("user-rank").textContent = "N/A";
    document.getElementById("user-score").textContent = "N/A";
    document.getElementById("user-achievement").textContent = "-";
}

function updatePodium(topThree) {
    const ranks = [".rank-1", ".rank-2", ".rank-3"];
    // Clear existing podium before updating
    ranks.forEach(rankSelector => {
        const el = document.querySelector(rankSelector);
        if (el) {
            el.querySelector(".username").textContent = "---";
            el.querySelector(".score").textContent = "Score: ---";
            el.classList.remove("highlight");
            const achievementIcon = el.querySelector(".achievement-icon");
            if (achievementIcon) achievementIcon.remove();
        }
    });

    topThree.forEach((player, idx) => {
        // Podium places are 1st, 2nd, 3rd. Array is 0, 1, 2.
        // So, player at idx 0 is rank 1, idx 1 is rank 2, idx 2 is rank 3.
        const rankSelector = ranks[idx]; 
        const el = document.querySelector(rankSelector);
        if (el) {
            el.querySelector(".username").textContent = player.username;
            el.querySelector(".score").textContent = `Score: ${player.score}`;
            el.classList.add("fade-in");
            setTimeout(() => el.classList.remove("fade-in"), 500);

            if (player.uid === currentUserUid) {
                const achievementIcon = document.createElement("div");
                achievementIcon.className = `achievement-icon ${idx === 0 ? "first-place-icon" : idx === 1 ? "second-place-icon" : "third-place-icon"}`;
                achievementIcon.textContent = idx === 0 ? "🏆" : idx === 1 ? "🥈" : "🥉";
                // Ensure only one icon is appended
                const existingIcon = el.querySelector(".achievement-icon");
                if(existingIcon) existingIcon.remove();
                el.appendChild(achievementIcon);
            }
        }
    });
}

function updateList(others) {
    const listEl = document.querySelector(".leaderboard-list");
    if (!listEl) return;

    listEl.innerHTML = ""; // Clear previous list
    if (others.length === 0) {
        listEl.innerHTML = "<li class=\"no-data\">No further scores in this category.</li>";
        return;
    }

    others.forEach((player, index) => {
        const li = document.createElement("li");
        li.classList.add("leaderboard-item");
        li.style.animationDelay = `${index * 0.05}s`; // Faster animation
        li.innerHTML = `
            <div class="player-info"><strong>#${index + 4}</strong> <span>${player.username}</span></div>
            <div class="player-score">Score: ${player.score}</div>
        `;
        if (player.uid === currentUserUid) {
            li.classList.add("highlight");
        }
        listEl.appendChild(li);
    });
}

function highlightUser(allPlayers) {
    const userRankEl = document.getElementById("user-rank");
    const userScoreEl = document.getElementById("user-score");
    const userAchievementEl = document.getElementById("user-achievement");

    if (!currentUserUid) { // If no user is logged in, clear stats
        userRankEl.textContent = "N/A";
        userScoreEl.textContent = "N/A";
        userAchievementEl.textContent = "-";
        return;
    }

    const userIndex = allPlayers.findIndex(p => p.uid === currentUserUid);

    if (userIndex === -1) {
        userRankEl.textContent = "N/A";
        userScoreEl.textContent = "N/A";
        userAchievementEl.textContent = "-";
        return;
    }

    const rank = userIndex + 1;
    const userScore = allPlayers[userIndex].score;

    userRankEl.textContent = `#${rank}`;
    userScoreEl.textContent = userScore;

    if (rank === 1) userAchievementEl.textContent = "🏆";
    else if (rank === 2) userAchievementEl.textContent = "🥈";
    else if (rank === 3) userAchievementEl.textContent = "🥉";
    else if (rank <= 10) userAchievementEl.textContent = "⭐";
    else userAchievementEl.textContent = "-";

    // Highlight in podium or list
    document.querySelectorAll(".rank-card.highlight, .leaderboard-item.highlight").forEach(el => el.classList.remove("highlight"));

    if (rank <= 3) {
        const podiumEl = document.querySelector(`.rank-${rank}`);
        if (podiumEl) podiumEl.classList.add("highlight");
    } else {
        const listItem = document.querySelector(`.leaderboard-list li:nth-child(${rank - 3})`);
        if (listItem) listItem.classList.add("highlight");
    }
}

// Confetti animation (assuming it exists and is functional)
function initConfetti() {
    window.confettiColors = ["#FF7F00", "#754979", "#4B0082", "#9B5DE5", "#FFD700", "#C0C0C0", "#CD7F32"];
}

function createConfetti() {
    const confettiContainer = document.getElementById("confettiContainer");
    if (!confettiContainer) return;
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    const left = Math.random() * 100;
    const color = window.confettiColors[Math.floor(Math.random() * window.confettiColors.length)];
    const size = 5 + Math.random() * 10;
    const duration = 3 + Math.random() * 4;
    confetti.style.left = `${left}%`;
    confetti.style.backgroundColor = color;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.animationDuration = `${duration}s`;
    if (Math.random() > 0.5) confetti.style.borderRadius = "50%";
    else confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiContainer.appendChild(confetti);
    setTimeout(() => confetti.remove(), duration * 1000);
}

function showConfetti() {
    if (confettiActive) return;
    confettiActive = true;
    const confettiInterval = setInterval(() => {
        for (let i = 0; i < 5; i++) createConfetti();
    }, 200);
    setTimeout(() => {
        clearInterval(confettiInterval);
        confettiActive = false;
    }, 5000);
    playSound("achievement");
}

