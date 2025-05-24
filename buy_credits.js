// buy_credits.js

document.addEventListener("DOMContentLoaded", () => {
    const creditBundlesContainer = document.getElementById("creditBundlesContainer");
    let currentUser = null;

    // Define credit bundles
    // In a real application, these would likely come from a backend or configuration file
    const creditBundles = [
        {
            id: "bundle_small",
            name: "Starter Pack",
            credits: 500,
            priceUSD: 0.99,
            description: "A small boost to get you started!"
        },
        {
            id: "bundle_medium",
            name: "Adventurer Bundle",
            credits: 1200,
            priceUSD: 1.99,
            description: "Perfect for the dedicated Roon Runner."
        },
        {
            id: "bundle_large",
            name: "Pro Rooner Stash",
            credits: 2800,
            priceUSD: 3.99,
            description: "For the ultimate Matharoon champion!"
        },
        {
            id: "bundle_mega",
            name: "Mega Roon Haul",
            credits: 7000,
            priceUSD: 7.99,
            description: "The best value for serious collectors!"
        }
    ];

    if (firebase && firebase.auth) {
        firebase.auth().onAuthStateChanged(user => {
            currentUser = user;
            renderCreditBundles(); // Re-render to enable/disable buttons based on login state
        });
    } else {
        console.warn("Firebase auth not available. Purchase functionality will be disabled.");
        renderCreditBundles();
    }

    function renderCreditBundles() {
        if (!creditBundlesContainer) return;
        creditBundlesContainer.innerHTML = ""; // Clear existing bundles

        creditBundles.forEach(bundle => {
            const card = document.createElement("div");
            card.className = "credit-bundle-card pixel-panel";

            const bundleName = document.createElement("h3");
            bundleName.textContent = bundle.name;
            bundleName.setAttribute("data-translate", `bundle_${bundle.id}_name`); // For translation

            const bundleCredits = document.createElement("p");
            bundleCredits.className = "bundle-credits";
            bundleCredits.innerHTML = `${bundle.credits} <span data-translate="roonBux">RoonBux</span>`;

            const bundlePrice = document.createElement("p");
            bundlePrice.className = "bundle-price";
            bundlePrice.textContent = `$${bundle.priceUSD.toFixed(2)} USD`;

            const bundleDescription = document.createElement("p");
            bundleDescription.className = "bundle-description";
            bundleDescription.textContent = bundle.description;
            bundleDescription.setAttribute("data-translate", `bundle_${bundle.id}_desc`); // For translation

            const purchaseButton = document.createElement("button");
            purchaseButton.className = "pixel-button buy-bundle-button";
            purchaseButton.textContent = "Buy Now";
            purchaseButton.setAttribute("data-translate", "buyNow");

            if (currentUser) {
                purchaseButton.onclick = () => handleBuyBundle(bundle);
            } else {
                purchaseButton.textContent = "Login to Buy";
                purchaseButton.setAttribute("data-translate", "loginToBuy");
                purchaseButton.disabled = true;
            }

            card.appendChild(bundleName);
            card.appendChild(bundleCredits);
            card.appendChild(bundlePrice);
            card.appendChild(bundleDescription);
            card.appendChild(purchaseButton);
            creditBundlesContainer.appendChild(card);
        });
        // After rendering, apply translations if the function is available
        if (typeof applyTranslations === "function") {
            applyTranslations(localStorage.getItem("language") || "en");
        }
    }

    function handleBuyBundle(bundle) {
        if (!currentUser || !firebase || !firebase.database) {
            alert("You need to be logged in to purchase credits. Firebase services might be unavailable.");
            return;
        }

        // Simulate payment process
        const paymentConfirmed = confirm(`Confirm purchase of "${bundle.name}" for $${bundle.priceUSD.toFixed(2)}?`);

        if (paymentConfirmed) {
            // In a real application, you would integrate with a payment gateway here.
            // For this simulation, we directly add credits to the user_s account.
            console.log(`Simulating payment for ${bundle.name}...`);

            const userCreditsRef = firebase.database().ref(`users/${currentUser.uid}/credits`);

            userCreditsRef.transaction(currentCredits => {
                return (currentCredits || 0) + bundle.credits;
            }).then(() => {
                alert(`Successfully purchased ${bundle.credits} RoonBux! Your new balance will update shortly.`);
                console.log(`${bundle.credits} credits added to user ${currentUser.uid}`);
                // Optionally, redirect or update UI further
                // The user_s credit display in the nav should update automatically due to the onAuthStateChanged listener in auth.js
                // and the on("value") listener for user data in store.js (if on the store page) or other relevant pages.
            }).catch(error => {
                console.error("Failed to add credits after simulated payment:", error);
                alert("There was an issue adding credits to your account after payment. Please contact support.");
            });
        } else {
            alert("Purchase cancelled.");
        }
    }

    // Initial render
    renderCreditBundles();
});

