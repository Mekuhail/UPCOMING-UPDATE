// RoonRun Game Logic - V6 (Corrected Asset Paths)

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("roonRunCanvas");
    const ctx = canvas.getContext("2d");

    // Modal Elements
    const characterSelectModal = document.getElementById("characterSelectModal");
    const characterGrid = document.getElementById("characterGrid");
    const startGameWithCharBtn = document.getElementById("startGameWithCharBtn");
    const backToMenuBtnFromCharSelect = document.getElementById("backToMenuBtnFromCharSelect");
    const userDisplayNameNav = document.getElementById("userDisplayName");
    const logoutBtnNav = document.getElementById("logoutBtn");

    canvas.width = 800;
    canvas.height = 400;

    let gameRunning = false;
    let score = 0;
    let gameSpeed = 7;
    let obstacles = [];
    let frameCount = 0;
    let player;
    let questionActive = false;
    let currentQuestion = null;
    let questionTimer = 0;
    let questionTimeLimit = 10;

    let currentUser = null;
    let userInventory = [];
    let selectedCharacterConfig = null;

    const availableGameCharacters = [
        {
            id: "mr_roon_classic",
            name: "Mr. Roon (Classic)",
            selectionImage: "/characters/mr_roon_classic/classic-roon-idle.png",
            runImagePaths: ["/characters/mr_roon_classic/classic-roon-run.png",]
            deadFrames: ["/characters/mr_roon_classic/mr_roon_classic_gameover_f0.png"],
            duckFrames: ["assets/characters/mr_roon_classic/mr_roon_classic_duck_f0.png", "assets/characters/mr_roon_classic/mr_roon_classic_duck_f1.png"],
            jumpFrames: ["assets/characters/mr_roon_classic/mr_roon_classic_jump_f0.png", "assets/characters/mr_roon_classic/mr_roon_classic_jump_f1.png"],
            frameWidth: 64, frameHeight: 64, animationSpeed: 8
        },
        {
            id: "mr_roon_v2_blue",
            name: "Mr. Roon V2 (Blue)",
            selectionImage: "mr_roon_v2_1st.png",
            runImagePaths: ["mr_roon_v2_1st.png", "mr_roon_v2_4th.png"],
            deadFrames: ["assets/characters/mr_roon_v2_blue/mr_roon_v2_blue_gameover_f0.png"],
            duckFrames: ["assets/characters/mr_roon_v2_blue/mr_roon_v2_blue_duck_f0.png", "assets/characters/mr_roon_v2_blue/mr_roon_v2_blue_duck_f1.png"],
            jumpFrames: ["assets/characters/mr_roon_v2_blue/mr_roon_v2_blue_jump_f0.png", "assets/characters/mr_roon_v2_blue/mr_roon_v2_blue_jump_f1.png"],
            frameWidth: 64, frameHeight: 64, animationSpeed: 8
        },
        {
            id: "ninja_roon",
            name: "Ninja Roon",
            selectionImage: "assets/characters/ninja_roon/ninja_roon_idle_f0.png",
            runImagePaths: ["assets/characters/ninja_roon/ninja_roon_run_f0.png", "assets/characters/ninja_roon/ninja_roon_run_f1.png"],
            deadFrames: ["assets/characters/ninja_roon/ninja_roon_gameover_f0.png"],
            duckFrames: ["assets/characters/ninja_roon/ninja_roon_duck_f0.png", "assets/characters/ninja_roon/ninja_roon_duck_f1.png"],
            jumpFrames: ["assets/characters/ninja_roon/ninja_roon_jump_f0.png", "assets/characters/ninja_roon/ninja_roon_jump_f1.png"],
            frameWidth: 64, frameHeight: 64, animationSpeed: 8
        },
        {
            id: "alien_roon",
            name: "Alien Roon",
            selectionImage: "assets/characters/alien_roon/alien_roon_idle_f0.png",
            runImagePaths: ["assets/characters/alien_roon/alien_roon_run_f0.png", "assets/characters/alien_roon/alien_roon_run_f1.png"],
            deadFrames: ["assets/characters/alien_roon/alien_roon_gameover_f0.png"],
            duckFrames: ["assets/characters/alien_roon/alien_roon_duck_f0.png", "assets/characters/alien_roon/alien_roon_duck_f1.png"],
            jumpFrames: ["assets/characters/alien_roon/alien_roon_jump_f0.png", "assets/characters/alien_roon/alien_roon_jump_f1.png"],
            frameWidth: 64, frameHeight: 64, animationSpeed: 8
        },
        {
            id: "mage_roon",
            name: "Mage Roon",
            selectionImage: "assets/characters/mage_roon/mage_roon_idle_f0.png",
            runImagePaths: ["assets/characters/mage_roon/mage_roon_run_f0.png", "assets/characters/mage_roon/mage_roon_run_f1.png"],
            deadFrames: ["assets/characters/mage_roon/mage_roon_gameover_f0.png"],
            duckFrames: ["assets/characters/mage_roon/mage_roon_duck_f0.png", "assets/characters/mage_roon/mage_roon_duck_f1.png"],
            jumpFrames: ["assets/characters/mage_roon/mage_roon_jump_f0.png", "assets/characters/mage_roon/mage_roon_jump_f1.png"],
            frameWidth: 64, frameHeight: 64, animationSpeed: 8
        },
        {
            id: "mythical_gryphon",
            name: "Mythical Gryphon",
            selectionImage: "assets/characters/mythical_gryphon/mythical_gryphon_idle_f0.png",
            runImagePaths: ["assets/characters/mythical_gryphon/mythical_gryphon_run_f0.png", "assets/characters/mythical_gryphon/mythical_gryphon_run_f1.png"],
            deadFrames: ["assets/characters/mythical_gryphon/mythical_gryphon_gameover_f0.png"],
            duckFrames: ["assets/characters/mythical_gryphon/mythical_gryphon_duck_f0.png", "assets/characters/mythical_gryphon/mythical_gryphon_duck_f1.png"],
            jumpFrames: ["assets/characters/mythical_gryphon/mythical_gryphon_jump_f0.png", "assets/characters/mythical_gryphon/mythical_gryphon_jump_f1.png"],
            frameWidth: 64, frameHeight: 64, animationSpeed: 8
        },
        {
            id: "robo_roon",
            name: "Robo Roon",
            selectionImage: "assets/characters/robo_roon/robo_roon_idle_f0.png",
            runImagePaths: ["assets/characters/robo_roon/robo_roon_run_f0.png", "assets/characters/robo_roon/robo_roon_run_f1.png"],
            deadFrames: ["assets/characters/robo_roon/robo_roon_gameover_f0.png"],
            duckFrames: ["assets/characters/robo_roon/robo_roon_duck_f0.png", "assets/characters/robo_roon/robo_roon_duck_f1.png"],
            jumpFrames: ["assets/characters/robo_roon/robo_roon_jump_f0.png", "assets/characters/robo_roon/robo_roon_jump_f1.png"],
            frameWidth: 64, frameHeight: 64, animationSpeed: 8
        }
    ];
    const defaultCharacterConfig = availableGameCharacters[0];

    const obstacleImagePaths = {
        cube: "/obstacles/obstacle_cube.png",
        cone: "/obstacles/obstacle_cone.png",
        pyramid: "/obstacles/obstacle_pyramid.png",
        sphere: "/obstacles/obstacle_sphere.png"
    };

    let playerImage; // For sprite sheet if used, or current frame for individual images
    let playerRunImages = [];
    let playerDeadImages = [];
    let playerDuckImages = [];
    let playerJumpImages = [];
    let obstacleImages = {};
    let assetsLoadedCount = 0;
    let totalAssetsToLoad = 0;

    function assetLoadedCallback() {
        assetsLoadedCount++;
        // console.log(`Assets loaded: ${assetsLoadedCount}/${totalAssetsToLoad}`);
        if (assetsLoadedCount >= totalAssetsToLoad) {
            console.log("All selected character and common assets loaded.");
            hideCharacterSelectModal();
            resetGame();
            gameRunning = true;
            gameLoop();
        }
    }

    function loadGameAssetsForSelectedCharacter() {
        if (!selectedCharacterConfig) {
            console.error("No character selected! Defaulting...");
            selectedCharacterConfig = defaultCharacterConfig;
        }
        console.log("Loading assets for:", selectedCharacterConfig.name);

        assetsLoadedCount = 0;
        playerRunImages = [];
        playerDeadImages = [];
        playerDuckImages = [];
        playerJumpImages = [];

        let playerAssetPaths = [
            selectedCharacterConfig.selectionImage,
            ...(selectedCharacterConfig.runImagePaths || []),
            ...(selectedCharacterConfig.deadFrames || []),
            ...(selectedCharacterConfig.duckFrames || []),
            ...(selectedCharacterConfig.jumpFrames || [])
        ];
        totalAssetsToLoad = playerAssetPaths.length + Object.keys(obstacleImagePaths).length;
        console.log(`Total assets to load: ${totalAssetsToLoad}`);

        // Load selection image (used as idle frame 0 for now if no specific idle array)
        const selImg = new Image();
        selImg.onload = assetLoadedCallback;
        selImg.onerror = () => { console.error("Failed to load selection image:", selectedCharacterConfig.selectionImage); assetLoadedCallback(); };
        selImg.src = selectedCharacterConfig.selectionImage;
        // Assuming playerImage will be set to this initially or by Player class

        (selectedCharacterConfig.runImagePaths || []).forEach(path => {
            const img = new Image();
            img.onload = assetLoadedCallback;
            img.onerror = () => { console.error("Failed to load player run image:", path); assetLoadedCallback(); };
            img.src = path;
            playerRunImages.push(img);
        });

        (selectedCharacterConfig.deadFrames || []).forEach(path => {
            const img = new Image();
            img.onload = assetLoadedCallback;
            img.onerror = () => { console.error("Failed to load player dead image:", path); assetLoadedCallback(); };
            img.src = path;
            playerDeadImages.push(img);
        });

        (selectedCharacterConfig.duckFrames || []).forEach(path => {
            const img = new Image();
            img.onload = assetLoadedCallback;
            img.onerror = () => { console.error("Failed to load player duck image:", path); assetLoadedCallback(); };
            img.src = path;
            playerDuckImages.push(img);
        });

        (selectedCharacterConfig.jumpFrames || []).forEach(path => {
            const img = new Image();
            img.onload = assetLoadedCallback;
            img.onerror = () => { console.error("Failed to load player jump image:", path); assetLoadedCallback(); };
            img.src = path;
            playerJumpImages.push(img);
        });

        for (const type in obstacleImagePaths) {
            if (!obstacleImages[type] || !obstacleImages[type].complete || obstacleImages[type].src.includes("undefined")) {
                obstacleImages[type] = new Image();
                obstacleImages[type].onload = assetLoadedCallback;
                obstacleImages[type].onerror = () => { console.error("Failed to load obstacle image:", obstacleImagePaths[type]); assetLoadedCallback(); };
                obstacleImages[type].src = obstacleImagePaths[type];
            } else {
                assetLoadedCallback();
            }
        }
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            if (userDisplayNameNav) userDisplayNameNav.textContent = user.displayName || user.email;
            if (logoutBtnNav) logoutBtnNav.classList.remove("hidden");
            fetchUserInventoryAndShowSelector();
        } else {
            currentUser = null;
            if (userDisplayNameNav) userDisplayNameNav.textContent = "Guest";
            if (logoutBtnNav) logoutBtnNav.classList.add("hidden");
            userInventory = [defaultCharacterConfig.id];
            populateCharacterSelectModal();
            showCharacterSelectModal();
        }
    });

    if (logoutBtnNav) {
        logoutBtnNav.addEventListener("click", () => {
            firebase.auth().signOut().then(() => {
                window.location.href = "index.html";
            }).catch(error => console.error("Logout failed: ", error));
        });
    }

    function fetchUserInventoryAndShowSelector() {
        if (!currentUser) {
            userInventory = [defaultCharacterConfig.id];
            populateCharacterSelectModal();
            showCharacterSelectModal();
            return;
        }
        const userInventoryRef = firebase.database().ref(`users/${currentUser.uid}/inventory`);
        userInventoryRef.once("value", (snapshot) => {
            const inventoryData = snapshot.val();
            userInventory = inventoryData ? Object.keys(inventoryData) : [defaultCharacterConfig.id];
            if (!userInventory.includes(defaultCharacterConfig.id)) {
                userInventory.push(defaultCharacterConfig.id);
            }
            console.log("User inventory:", userInventory);
            populateCharacterSelectModal();
            showCharacterSelectModal();
        }).catch(error => {
            console.error("Error fetching user inventory: ", error);
            userInventory = [defaultCharacterConfig.id];
            populateCharacterSelectModal();
            showCharacterSelectModal();
        });
    }

    function showCharacterSelectModal() {
        gameRunning = false;
        if (characterSelectModal) characterSelectModal.classList.remove("hidden");
    }

    function hideCharacterSelectModal() {
        if (characterSelectModal) characterSelectModal.classList.add("hidden");
    }

    function populateCharacterSelectModal() {
        if (!characterGrid) return;
        characterGrid.innerHTML = "";
        let hasSelectableCharacter = false;
        selectedCharacterConfig = null; // Reset selected character

        availableGameCharacters.forEach(charConfig => {
            const optionDiv = document.createElement("div");
            optionDiv.className = "character-option pixel-panel";

            const img = new Image();
            img.src = charConfig.selectionImage;
            img.alt = charConfig.name;
            img.onerror = () => {
                console.warn("Failed to load selection image for", charConfig.name, ":", charConfig.selectionImage);
                img.src = "/matharoonLogo.png"; // Fallback image from root
            };

            const nameP = document.createElement("p");
            nameP.className = "char-name";
            nameP.textContent = charConfig.name;

            optionDiv.appendChild(img);
            optionDiv.appendChild(nameP);

            const isOwned = userInventory.includes(charConfig.id);

            if (!isOwned) {
                optionDiv.classList.add("locked");
                const lockIcon = document.createElement("span");
                lockIcon.className = "locked-icon";
                lockIcon.textContent = "🔒";
                optionDiv.appendChild(lockIcon);
            } else {
                hasSelectableCharacter = true;
                optionDiv.addEventListener("click", () => {
                    document.querySelectorAll("#characterSelectModal .character-option.selected").forEach(el => el.classList.remove("selected"));
                    optionDiv.classList.add("selected");
                    selectedCharacterConfig = charConfig;
                    if (startGameWithCharBtn) startGameWithCharBtn.disabled = false;
                });
                if (selectedCharacterConfig === null) { // Auto-select first available owned character
                    optionDiv.classList.add("selected");
                    selectedCharacterConfig = charConfig;
                    if (startGameWithCharBtn) startGameWithCharBtn.disabled = false;
                }
            }
            characterGrid.appendChild(optionDiv);
        });
        if (startGameWithCharBtn) startGameWithCharBtn.disabled = !hasSelectableCharacter || !selectedCharacterConfig;
    }

    if (startGameWithCharBtn) {
        startGameWithCharBtn.addEventListener("click", () => {
            if (selectedCharacterConfig) {
                console.log("Starting game with character:", selectedCharacterConfig.name);
                loadGameAssetsForSelectedCharacter();
            } else {
                alert("Please select an available character to start.");
            }
        });
    }
    if (backToMenuBtnFromCharSelect) {
        backToMenuBtnFromCharSelect.addEventListener("click", () => {
            window.location.href = "gamehub.html";
        });
    }

    class Player {
        constructor(config) {
            this.config = config;
            this.width = config.frameWidth || 64;
            this.height = config.frameHeight || 64;
            this.x = 100;
            this.groundY = canvas.height - this.height - 60;
            this.y = this.groundY;
            this.velocityY = 0;
            this.gravity = 0.8;
            this.jumpPower = 18; // Slightly reduced jump power
            this.isJumping = false;
            this.isDucking = false;
            this.isDead = false;

            this.currentRunFrame = 0;
            this.currentDeadFrame = 0;
            this.currentDuckFrame = 0;
            this.currentJumpFrame = 0;
            this.animationTick = 0;
            this.animationSpeed = config.animationSpeed || 6; // Slower animation speed for clarity

            // Use preloaded images
            this.runFrames = playerRunImages;
            this.deadAnimFrames = playerDeadImages;
            this.duckAnimFrames = playerDuckImages;
            this.jumpAnimFrames = playerJumpImages;
            this.idleImage = new Image();
            this.idleImage.src = config.selectionImage; // Use selection image as idle
        }

        jump() {
            if (!this.isJumping && !this.isDead) {
                this.isJumping = true;
                this.velocityY = -this.jumpPower;
                this.currentJumpFrame = 0;
            }
        }

        duck(shouldDuck) {
            if (this.isDead) return;
            this.isDucking = shouldDuck;
            if (shouldDuck) {
                this.height = (this.config.frameHeight || 64) / 2; // Ducking halves height
            } else {
                this.height = this.config.frameHeight || 64;
            }
            this.y = this.groundY - (this.isDucking ? 0 : (this.config.frameHeight || 64) / 2) + (this.isDucking ? (this.config.frameHeight || 64) / 2 : 0); // Adjust y when ducking

        }

        update() {
            if (this.isDead) {
                this.animationTick++;
                if (this.animationTick % this.animationSpeed === 0 && this.deadAnimFrames.length > 0) {
                    this.currentDeadFrame = (this.currentDeadFrame + 1) % this.deadAnimFrames.length;
                }
                return; // No movement if dead
            }

            // Jumping logic
            if (this.isJumping) {
                this.y += this.velocityY;
                this.velocityY += this.gravity;
                if (this.y >= this.groundY) {
                    this.y = this.groundY;
                    this.isJumping = false;
                    this.velocityY = 0;
                    this.currentJumpFrame = 0;
                }
                this.animationTick++;
                if (this.animationTick % this.animationSpeed === 0 && this.jumpAnimFrames.length > 0) {
                    this.currentJumpFrame = Math.min(this.currentJumpFrame + 1, this.jumpAnimFrames.length - 1); // Don_t loop jump animation
                }
            } else if (this.isDucking) {
                this.animationTick++;
                if (this.animationTick % this.animationSpeed === 0 && this.duckAnimFrames.length > 0) {
                    this.currentDuckFrame = (this.currentDuckFrame + 1) % this.duckAnimFrames.length;
                }
            } else {
                // Running animation
                this.animationTick++;
                if (this.animationTick % this.animationSpeed === 0 && this.runFrames.length > 0) {
                    this.currentRunFrame = (this.currentRunFrame + 1) % this.runFrames.length;
                }
            }
        }

        draw() {
            ctx.beginPath(); // Start a new path for player drawing
            let currentImageToDraw;
            if (this.isDead && this.deadAnimFrames.length > 0) {
                currentImageToDraw = this.deadAnimFrames[this.currentDeadFrame];
            } else if (this.isJumping && this.jumpAnimFrames.length > 0) {
                currentImageToDraw = this.jumpAnimFrames[this.currentJumpFrame];
            } else if (this.isDucking && this.duckAnimFrames.length > 0) {
                currentImageToDraw = this.duckAnimFrames[this.currentDuckFrame];
            } else if (this.runFrames.length > 0) {
                currentImageToDraw = this.runFrames[this.currentRunFrame];
            } else {
                currentImageToDraw = this.idleImage; // Fallback to idle/selection image
            }

            if (currentImageToDraw && currentImageToDraw.complete && currentImageToDraw.naturalHeight !== 0) {
                ctx.drawImage(currentImageToDraw, this.x, this.y, this.width, this.height);
            } else {
                // Fallback drawing if image not loaded or invalid
                ctx.fillStyle = "#00FF00"; // Green placeholder
                ctx.fillRect(this.x, this.y, this.width, this.height);
                // console.warn("Player image not ready or invalid, drawing placeholder.");
            }
            ctx.closePath(); // Close the path
        }
    }

    class Obstacle {
        constructor(type, xPosition) {
            this.type = type;
            this.image = obstacleImages[type];
            this.width = 50; // Standardized width
            this.height = 50; // Standardized height
            this.x = xPosition;
            this.y = canvas.height - this.height - 60; // Align with player_s ground

            if (this.type === "pyramid") this.height = 70; // Pyramids can be taller
            if (this.type === "cone") this.width = 40; // Cones can be narrower
        }

        update() {
            this.x -= gameSpeed;
        }

        draw() {
            if (this.image && this.image.complete && this.image.naturalHeight !== 0) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = "red"; // Red placeholder for obstacles
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }

    const mathQuestions = [
        { q: "5 + 7 = ?", a: "12" },
        { q: "10 - 3 = ?", a: "7" },
        { q: "4 * 3 = ?", a: "12" },
        { q: "15 / 5 = ?", a: "3" },
        { q: "8 + 9 = ?", a: "17" },
        { q: "12 - 5 = ?", a: "7" },
        { q: "6 * 4 = ?", a: "24" },
        { q: "20 / 4 = ?", a: "5" },
        { q: "3 * 7 = ?", a: "21" },
        { q: "18 / 2 = ?", a: "9" },
        { q: "13 + 6 = ?", a: "19" },
        { q: "25 - 10 = ?", a: "15" },
        { q: "9 * 3 = ?", a: "27" },
        { q: "30 / 6 = ?", a: "5" },
        { q: "7 * 2 = ?", a: "14" },
        { q: "16 - 7 = ?", a: "9" },
        { q: "4 + 11 = ?", a: "15" },
        { q: "5 * 5 = ?", a: "25" },
        { q: "21 / 3 = ?", a: "7" },
        { q: "14 + 8 = ?", a: "22" }
    ];

    function spawnObstacle() {
        const obstacleTypes = Object.keys(obstacleImagePaths);
        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        const xPosition = canvas.width + Math.random() * 200; // Spawn off-screen
        obstacles.push(new Obstacle(type, xPosition));
    }

    function triggerMathQuestion() {
        if (questionActive) return;
        questionActive = true;
        currentQuestion = mathQuestions[Math.floor(Math.random() * mathQuestions.length)];
        questionTimer = questionTimeLimit;
        // No prompt for now, draw directly on canvas
    }

    function drawQuestion() {
        if (!questionActive || !currentQuestion) return;
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(canvas.width / 2 - 200, 50, 400, 120);
        ctx.fillStyle = "white";
        ctx.font = "20px \"Press Start 2P\"";
        ctx.textAlign = "center";
        ctx.fillText(currentQuestion.q, canvas.width / 2, 100);
        ctx.font = "16px \"Press Start 2P\"";
        ctx.fillText(`Time: ${Math.ceil(questionTimer)}s (Answer with number keys)`, canvas.width / 2, 140);
    }

    function handleAnswer(answer) {
        if (!questionActive || !currentQuestion) return;
        if (answer === currentQuestion.a) {
            score += 100; // Bonus points for correct answer
            questionActive = false;
            currentQuestion = null;
            // Maybe a positive feedback sound/visual
        } else {
            // Penalty or just ignore wrong answers until time runs out
            console.log("Wrong answer, try again or time will run out.");
        }
    }

    function drawScore() {
        ctx.fillStyle = "white";
        ctx.font = "20px \"Press Start 2P\"";
        ctx.textAlign = "left";
        ctx.fillText("Score: " + score, 20, 30);
    }

    function drawGround() {
        ctx.fillStyle = "#553311"; // Brown color for ground
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
        // Add some details to the ground
        ctx.fillStyle = "#664422";
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.fillRect(i, canvas.height - 60, 10, 5); // Grass tufts or stones
        }
    }

    function drawBackground() {
        // Simple gradient background or a static image
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "#87CEEB"); // Sky blue
        gradient.addColorStop(1, "#ADD8E6"); // Lighter blue
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add some simple clouds (optional)
        ctx.fillStyle = "white";
        ctx.fillRect(100, 50, 100, 30);
        ctx.fillRect(300, 80, 150, 40);
        ctx.fillRect(600, 60, 120, 35);
    }

    function resetGame() {
        if (!selectedCharacterConfig) {
            console.error("Cannot reset game, no character config selected.");
            showCharacterSelectModal();
            return;
        }
        player = new Player(selectedCharacterConfig);
        obstacles = [];
        score = 0;
        gameSpeed = 4;
        frameCount = 0;
        questionActive = false;
        currentQuestion = null;
        gameRunning = false; // Will be set to true once assets load in loadGameAssets
    }

    function gameOver() {
        gameRunning = false;
        player.isDead = true;
        // Display Game Over screen
        setTimeout(() => { // Delay to show dead animation
            ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.font = "40px \"Press Start 2P\"";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);
            ctx.font = "20px \"Press Start 2P\"";
            ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2);
            ctx.fillText("Press R to Restart", canvas.width / 2, canvas.height / 2 + 40);

            // Save score to Firebase if user is logged in
            if (currentUser && firebase.database()) {
                const userScoreRef = firebase.database().ref(`users/${currentUser.uid}/highScores/roonRun`);
                userScoreRef.transaction(currentScore => {
                    if (currentScore === null || score > currentScore) {
                        return score;
                    }
                    return; // Abort transaction if new score isn_t higher
                }).then(() => console.log("Score saved/updated."))
                    .catch(err => console.error("Score save failed:", err));
            }
        }, 500); // Delay before showing game over text
    }

    function gameLoop() {
        if (!gameRunning) {
            // console.log("Game loop paused or not started.");
            return;
        }
        frameCount++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawGround();

        player.update();
        player.draw();

        // Obstacle handling
        if (frameCount % (150 - Math.floor(gameSpeed * 5)) === 0) { // Spawn rate increases with speed
            spawnObstacle();
        }

        obstacles.forEach((obstacle, index) => {
            obstacle.update();
            obstacle.draw();
            // Collision detection
            if (
                player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y &&
                !player.isDead
            ) {
                gameOver();
            }
            // Remove off-screen obstacles
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                score += 10; // Points for passing an obstacle
            }
        });

        // Math question handling
        if (score > 0 && score % 200 === 0 && !questionActive && obstacles.length > 0) { // Trigger every 200 points
            triggerMathQuestion();
        }
        if (questionActive) {
            drawQuestion();
            questionTimer -= 1 / 60; // Assuming 60 FPS
            if (questionTimer <= 0) {
                questionActive = false;
                currentQuestion = null;
                // Maybe a penalty for not answering
            }
        }

        drawScore();

        // Increase difficulty
        if (frameCount % 600 === 0 && gameSpeed < 10) { // Every 10 seconds (approx)
            gameSpeed += 0.5;
            console.log("Game speed increased to:", gameSpeed);
        }

        if (gameRunning) {
            requestAnimationFrame(gameLoop);
        }
    }

    // Event Listeners
    document.addEventListener("keydown", (e) => {
        if (!gameRunning && e.key.toLowerCase() === "r" && player && player.isDead) {
            showCharacterSelectModal(); // Go back to char select on restart
            return;
        }
        if (!gameRunning || !player || player.isDead) return;

        if (e.key === " " || e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
            player.jump();
        }
        if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
            player.duck(true);
        }
        // Answer handling for math questions
        if (questionActive && currentQuestion && e.key >= "0" && e.key <= "9") {
            // This is a simple single-digit answer. 
            // For multi-digit, need an input buffer.
            // For now, let_s assume answers are single digits or handled by a prompt.
            // The current question structure implies multi-digit answers.
            // A proper input field or sequence capture is needed.
            // For simplicity, this part is not fully implemented here.
            // handleAnswer(e.key); // Example: if answers were single digits
        }
    });
    document.addEventListener("keyup", (e) => {
        if (!gameRunning || !player || player.isDead) return;
        if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
            player.duck(false);
        }
    });

    console.log("RoonRun Game Initialized - V6");
    // Initial call to show character selector (will be triggered by auth state change)
    // showCharacterSelectModal(); 
});

