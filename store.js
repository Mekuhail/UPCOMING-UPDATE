// store.js - Logic for the Matharoon RoonRun Character Store - V3 (Corrected Asset Paths)

document.addEventListener("DOMContentLoaded", () => {
    if (typeof firebase === "undefined" || typeof firebase.auth === "undefined" || typeof firebase.database === "undefined") {
        console.error("Firebase is not initialized. Ensure firebase.js and auth.js are loaded and configured correctly.");
        // Keep UI functional for browsing if possible, disable purchase actions
        // alert("Error: Store services are currently unavailable for purchasing. Please try again later.");
    }

    const storeGrid = document.getElementById("storeGrid");
    const userCreditsDisplayStore = document.getElementById("storeUserCredits");
    const userCreditsDisplayNav = document.getElementById("userRoonsDisplayNav");
    const buyMoreCreditsBtn = document.getElementById("buyMoreCreditsBtn");

    let currentUser = null;
    let userCredits = 0;
    let userInventory = []; // Array of item IDs user owns

    // --- STORE ITEMS DEFINITION --- 
    // Paths are relative to the HTML file (store.html), assuming it's in the same dir as roonRun.html
    // and assets are in ./assets/characters/
    let storeItems = [
        {
            id: "mr_roon_classic",
            name: "Mr. Roon (Classic)",
            poses: [
                "/characters/mr_roon_classic/classic-roon-idle.png",
                "/characters/mr_roon_classic/classic-roon-duck.png",
                "/characters/mr_roon_classic/classic-roon-jump.png",
                "/characters/mr_roon_classic/classic-roon-run.png",

            ],
            rarity: "Default", // Classic should be free or easily obtainable
            description: "The original, the classic, Mr. Roon! Always ready for an adventure."
        },
        {
            id: "mr_roon_v2_blue",
            name: "Mr. Roon V2 (Blue)",
            poses: [
                "/mr_roon_v2_1st.png",
                "/mr_roon_v2_2nd.png",
                "/mr_roon_v2_3rd.png",
                "/mr_roon_v2_4th.png",
            ],
            rarity: "Rare",
            description: "A cool blue variant for Mr. Roon, with a sleek new look."
        },
        {
            id: "ninja_roon",
            name: "Ninja Roon",
            poses: [
                "assets/characters/ninja_roon/ninja_roon_idle_f0.png",
                "assets/characters/ninja_roon/ninja_roon_run_f0.png",
                "assets/characters/ninja_roon/ninja_roon_jump_f0.png"
            ],
            rarity: "Epic",
            description: "Swift and silent, the Ninja Roon masters the art of surprise."
        },
        {
            id: "mage_roon",
            name: "Mage Roon",
            poses: [
                "assets/characters/mage_roon/mage_roon_idle_f0.png",
                "assets/characters/mage_roon/mage_roon_run_f0.png",
                "assets/characters/mage_roon/mage_roon_jump_f0.png"
            ],
            rarity: "Epic",
            description: "Wielding arcane energies, the Mage Roon is a formidable scholar."
        },
        {
            id: "robo_roon",
            name: "Robo Roon",
            poses: [
                "/characters/robo_roon/robo_roon_idle_f0.png",
                "/characters/robo_roon/robo_roon_duck_f0.png",
                "/characters/robo_roon/robo_roon_jump_f0.png",
                "/characters/robo_roon/robo_roon_run_f0.png",

            ],
            rarity: "Epic",
            description: "Cybernetic precision and power, the Robo Roon is built for challenges."
        },
        {
            id: "alien_roon",
            name: "Alien Roon",
            poses: [
                "/characters/alien_roon/alien_roon_idle_f0.png",
                "/characters/alien_roon/alien_roon_duck_f1.png",
                "/characters/alien_roon/alien_roon_jump_f1.png",
                "/characters/alien_roon/alien_roon_run_f1.png",
            ],
            rarity: "Rare",
            description: "An enigmatic visitor from a distant galaxy, with unique abilities."
        },
        {
            id: "mythical_gryphon",
            name: "Mythical Gryphon",
            poses: [
                "assets/characters/mythical_gryphon/mythical_gryphon_idle_f0.png",
                "assets/characters/mythical_gryphon/mythical_gryphon_run_f0.png",
                "assets/characters/mythical_gryphon/mythical_gryphon_jump_f0.png"
            ],
            rarity: "Mythical",
            description: "A legendary creature of immense power and wisdom."
        }
    ];

    // Sort store items by name alphabetically
    storeItems.sort((a, b) => a.name.localeCompare(b.name));

    const rarityPrices = {
        "Default": 0,
        "Rare": 250,
        "Epic": 500,
        "Mythical": 1000,
    };

    // Firebase Auth Listener
    if (firebase && firebase.auth) {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                fetchUserData();
            } else {
                currentUser = null;
                userCredits = 0;
                userInventory = ["mr_roon_classic"]; // Guest owns classic by default
                if (userCreditsDisplayStore) userCreditsDisplayStore.textContent = "0";
                if (userCreditsDisplayNav) userCreditsDisplayNav.textContent = "Credits: N/A";
                renderStoreItems();
            }
        });
    } else {
        console.warn("Firebase auth not available. Store will operate in guest mode for browsing.");
        userInventory = ["mr_roon_classic"]; // Guest owns classic
        renderStoreItems();
    }

    function fetchUserData() {
        if (!currentUser || !firebase || !firebase.database) return;
        const userDbRef = firebase.database().ref(`users/${currentUser.uid}`);

        userDbRef.on("value", (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                userCredits = userData.credits || 0;
                userInventory = userData.inventory ? Object.keys(userData.inventory) : [];
                if (!userInventory.includes("mr_roon_classic")) {
                    userInventory.push("mr_roon_classic"); // Ensure logged-in users also have classic
                }
            } else {
                userCredits = 0;
                userInventory = ["mr_roon_classic"];
                // Initialize user data if it doesn_t exist, giving them the classic character
                userDbRef.set({ credits: 0, inventory: { "mr_roon_classic": true } });
            }
            if (userCreditsDisplayStore) userCreditsDisplayStore.textContent = userCredits;
            if (userCreditsDisplayNav) userCreditsDisplayNav.textContent = `Credits: ${userCredits}`;
            renderStoreItems();
        }, error => {
            console.error("Error fetching user data:", error);
            userCredits = 0;
            userInventory = ["mr_roon_classic"];
            renderStoreItems(); // Render with defaults on error
        });
    }

    function renderStoreItems() {
        if (!storeGrid) return;
        storeGrid.innerHTML = "";

        storeItems.forEach(item => {
            const itemOwned = userInventory.includes(item.id);
            const price = rarityPrices[item.rarity] !== undefined ? rarityPrices[item.rarity] : 9999;

            const card = document.createElement("div");
            card.className = "store-item-card pixel-panel";

            const itemName = document.createElement("h3");
            itemName.className = "character-name";
            itemName.textContent = item.name;

            const imageContainer = document.createElement("div");
            imageContainer.className = "character-image-container";

            let currentPoseIndex = 0;
            const itemImage = document.createElement("img");
            itemImage.src = item.poses[currentPoseIndex];
            itemImage.alt = item.name;
            itemImage.onerror = () => {
                console.warn("Failed to load pose image:", item.poses[currentPoseIndex]);
                itemImage.src = "matharoonLogo.png"; // Fallback image in assets folder
            };
            imageContainer.appendChild(itemImage);

            if (item.poses.length > 1) {
                const indicatorsContainer = document.createElement("div");
                indicatorsContainer.className = "swipe-indicators";
                item.poses.forEach((_, index) => {
                    const indicator = document.createElement("div");
                    indicator.className = "swipe-indicator" + (index === 0 ? " active" : "");
                    indicatorsContainer.appendChild(indicator);
                });
                imageContainer.appendChild(indicatorsContainer);

                let isDragging = false, startX, currentX;
                const threshold = 50; // Min distance for a swipe, increased for less sensitivity, more deliberate swipe

                const updateIndicators = () => {
                    indicatorsContainer.childNodes.forEach((ind, idx) => {
                        ind.classList.toggle("active", idx === currentPoseIndex);
                    });
                };

                const changePose = (direction) => {
                    // Clear any ongoing transform from dragging before starting animation
                    itemImage.style.transition = "none";
                    itemImage.style.transform = "translateX(0px)";
                    // Force reflow to apply the reset immediately
                    itemImage.offsetHeight;

                    itemImage.style.transition = "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)"; // Smoother transition
                    itemImage.style.transform = direction === "next" ? "translateX(-100%)" : "translateX(100%)";

                    setTimeout(() => {
                        if (direction === "next") {
                            currentPoseIndex = (currentPoseIndex + 1) % item.poses.length;
                        } else {
                            currentPoseIndex = (currentPoseIndex - 1 + item.poses.length) % item.poses.length;
                        }
                        itemImage.style.transition = "none"; // Remove transition for instant src change
                        itemImage.src = item.poses[currentPoseIndex];
                        itemImage.style.transform = "translateX(0px)"; // Reset position
                        updateIndicators();
                    }, 300); // Match transition duration
                };

                imageContainer.addEventListener("mousedown", (e) => {
                    isDragging = true;
                    startX = e.pageX;
                    imageContainer.style.cursor = "grabbing";
                    itemImage.style.transition = "none"; // No transition while dragging
                });
                imageContainer.addEventListener("touchstart", (e) => {
                    isDragging = true;
                    startX = e.touches[0].pageX;
                    itemImage.style.transition = "none";
                }, { passive: true });



                // NEW: make container focusable for keyboard access
                imageContainer.tabIndex = 0;

                // Utility: go to an absolute pose
                function goToPose(idx) {
                    currentPoseIndex = idx;
                    itemImage.src = item.poses[currentPoseIndex];
                    updateIndicators();
                }

                // Replace all the old swipe logic with ONE pointer listener
                let pointerStartX = 0, pointerDeltaX = 0;
                const dynamicThreshold = () => imageContainer.offsetWidth * 0.15;

                imageContainer.addEventListener('pointerdown', e => {
                    pointerStartX = e.clientX;
                    pointerDeltaX = 0;
                    itemImage.style.transition = 'none';
                    imageContainer.setPointerCapture(e.pointerId);
                });

                imageContainer.addEventListener('pointermove', e => {
                    if (pointerStartX === null) return;
                    pointerDeltaX = e.clientX - pointerStartX;
                    itemImage.style.transform = `translateX(${pointerDeltaX}px)`;
                });

                imageContainer.addEventListener('pointerup', e => {
                    imageContainer.releasePointerCapture(e.pointerId);
                    const dist = pointerDeltaX;
                    const thresh = dynamicThreshold();
                    itemImage.style.transition = 'transform 0.25s ease-out';

                    if (dist < -thresh) changePose('next');
                    else if (dist > thresh) changePose('prev');
                    else {
                        // Treat as a simple click/tap = next pose
                        changePose('next');
                    }
                    itemImage.style.transform = 'translateX(0)';
                    pointerStartX = null;
                });

                // Keyboard arrows
                imageContainer.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowRight') changePose('next');
                    if (e.key === 'ArrowLeft') changePose('prev');
                });

                // CLICKABLE DOTS
                indicatorsContainer.querySelectorAll('.swipe-indicator')
                    .forEach((dot, idx) => {
                        dot.dataset.index = idx;
                        dot.style.cursor = 'pointer';
                        dot.addEventListener('click', () => goToPose(idx));
                    });
            }

            const rarityBar = document.createElement("div");
            rarityBar.className = `rarity-bar rarity-${item.rarity.toLowerCase()}`;

            const itemPriceDisplay = document.createElement("p");
            itemPriceDisplay.className = "item-price";
            itemPriceDisplay.innerHTML = `Price: <span style="color: var(--pixel-color-accent);">${price}</span> RoonBux`;

            const purchaseButton = document.createElement("button");
            purchaseButton.className = "pixel-button";

            if (itemOwned) {
                purchaseButton.textContent = "Owned";
                purchaseButton.disabled = true;
            } else if (price === 0 && !itemOwned) {
                purchaseButton.textContent = "Get (Free)";
                if (!currentUser && firebase && firebase.auth) { // Only disable if firebase is expected but no user
                    purchaseButton.disabled = true;
                    purchaseButton.title = "Log in to get this item.";
                } else {
                    purchaseButton.onclick = () => handlePurchase(item, price);
                }
            } else if (currentUser) {
                if (userCredits >= price) {
                    purchaseButton.textContent = "Buy";
                    purchaseButton.onclick = () => handlePurchase(item, price);
                } else {
                    purchaseButton.textContent = "Not Enough Credits";
                    purchaseButton.disabled = true;
                }
            } else { // No current user, and item is not free
                purchaseButton.textContent = "Log in to Buy";
                purchaseButton.disabled = true;
            }

            card.appendChild(itemName);
            card.appendChild(imageContainer);
            card.appendChild(rarityBar);
            card.appendChild(itemPriceDisplay);
            card.appendChild(purchaseButton);
            storeGrid.appendChild(card);
        });
    }

    function handlePurchase(item, itemPrice) {
        if (!currentUser || !firebase || !firebase.database) {
            alert("Store services for purchasing are currently unavailable. Please log in or try again later.");
            return;
        }
        if (userInventory.includes(item.id)) {
            alert("You already own this item!");
            return;
        }
        if (userCredits < itemPrice) {
            alert("You do not have enough Credits to purchase this item.");
            return;
        }

        const confirmation = confirm(`Are you sure you want to buy ${item.name} for ${itemPrice} Credits?`);
        if (confirmation) {
            const newCredits = userCredits - itemPrice;
            const userDbRef = firebase.database().ref(`users/${currentUser.uid}`);

            userDbRef.update({
                credits: newCredits,
                [`inventory/${item.id}`]: true
            })
                .then(() => {
                    alert(`${item.name} purchased successfully!`);
                    // Data will re-render via on("value") listeners, updating userCredits and userInventory locally.
                })
                .catch(error => {
                    console.error("Purchase failed: ", error);
                    alert("There was an error processing your purchase. Please try again.");
                });
        }
    }

    if (buyMoreCreditsBtn) {
        buyMoreCreditsBtn.addEventListener("click", () => {
            // Redirect to buy_credits.html instead of prompt
            window.location.href = "buy_credits.html";
        });
    }
});

