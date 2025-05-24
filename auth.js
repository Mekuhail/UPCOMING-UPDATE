// auth.js - Firebase Authentication Logic

// Ensure Firebase is initialized (from firebase.js)
if (typeof firebase === "undefined" || !firebase.apps.length) {
    console.error("Firebase core is not initialized. Ensure firebase.js is loaded and configured before auth.js.");
    alert("Authentication services are unavailable. Please configure Firebase first.");
}

const auth = firebase.auth();
const db = firebase.database();

function setupAuthUI() {
    const accountBtn = document.getElementById("accountBtn");
    const accountDropdown = document.getElementById("accountDropdown");
    const userCreditsDiv = document.getElementById("userCredits"); // Expected inside accountDropdown

    const user = auth.currentUser;

    // If the primary account button/dropdown structure isn't on the page, log a warning and exit this specific UI setup.
    // Other UI elements unrelated to this dropdown might still be updated below.
    if (!accountBtn || !accountDropdown) {
        // console.warn("Account button or dropdown structure not found on this page. Auth UI for dropdown will not be rendered.");
        // Fall through to update other potential auth-related elements if they exist
    } else {
        // Clear previous dynamic links from dropdown, preserving userCreditsDiv
        Array.from(accountDropdown.children).forEach(child => {
            if (child.id !== "userCredits") {
                accountDropdown.removeChild(child);
            }
        });

        if (user) {
            // User is signed in
            const displayName = user.displayName || (user.email ? user.email.split("@")[0] : "User");
            accountBtn.textContent = displayName;
            // accountBtn.setAttribute("data-translate-value", displayName); // For dynamic translation if needed

            const logoutLink = document.createElement("a");
            logoutLink.href = "#";
            logoutLink.id = "logoutLink";
            logoutLink.className = "pixel-button";
            logoutLink.textContent = "Log Out";
            logoutLink.setAttribute("data-translate", "logout");
            logoutLink.addEventListener("click", (e) => {
                e.preventDefault();
                logoutUser().catch(error => console.error("Logout error:", error.message));
                accountDropdown.classList.add("hidden"); // Hide dropdown on action
            });
            accountDropdown.insertBefore(logoutLink, userCreditsDiv); // Insert before the credits div

            if (userCreditsDiv) {
                userCreditsDiv.classList.remove("hidden");
                const userDbRef = db.ref(`users/${user.uid}/credits`);
                userDbRef.on("value", snapshot => {
                    const credits = snapshot.val() || 0;
                    userCreditsDiv.textContent = `Credits: ${credits}`;
                });
            } else {
                 console.warn("#userCredits div not found within accountDropdown");
            }
            
            // Ensure default character is in inventory
            const userInventoryRef = db.ref(`users/${user.uid}/inventory/mr_roon_classic`);
            userInventoryRef.once("value").then(snapshot => {
                if (!snapshot.exists()) {
                    userInventoryRef.set(true);
                }
            });

        } else {
            // User is signed out
            accountBtn.textContent = "Account"; // Reset button text
            accountBtn.setAttribute("data-translate", "account");

            const loginLink = document.createElement("a");
            loginLink.href = "login.html";
            loginLink.id = "loginLink";
            loginLink.className = "pixel-button";
            loginLink.textContent = "Log In";
            loginLink.setAttribute("data-translate", "login");
            accountDropdown.insertBefore(loginLink, userCreditsDiv);

            const signUpLink = document.createElement("a");
            signUpLink.href = "signUp.html";
            signUpLink.id = "signUpLink";
            signUpLink.className = "pixel-button";
            signUpLink.textContent = "Sign Up";
            signUpLink.setAttribute("data-translate", "signUp");
            accountDropdown.insertBefore(signUpLink, userCreditsDiv);

            if (userCreditsDiv) {
                userCreditsDiv.classList.add("hidden");
                userCreditsDiv.textContent = "Credits: 0"; // Reset
            }
        }
    }

    // Handle other user-specific displays if they exist (e.g., userEmailDisplayNav, userRoonsDisplayNav from original logic)
    // This part is kept from the original auth.js in case these elements are used on some pages.
    const userEmailDisplayNav = document.getElementById("userEmailDisplayNav");
    const userRoonsDisplayNav = document.getElementById("userRoonsDisplayNav");
    if (user) {
        if (userEmailDisplayNav) userEmailDisplayNav.textContent = user.email || "";
        if (userRoonsDisplayNav) {
            userRoonsDisplayNav.classList.remove("hidden");
            const userDbRef = db.ref(`users/${user.uid}/credits`);
            userDbRef.on("value", snapshot => {
                const credits = snapshot.val() || 0;
                userRoonsDisplayNav.textContent = `Credits: ${credits}`;
            });
        }
    } else {
        if (userEmailDisplayNav) userEmailDisplayNav.textContent = "";
        if (userRoonsDisplayNav) {
            userRoonsDisplayNav.textContent = "Credits: N/A";
            userRoonsDisplayNav.classList.add("hidden");
        }
    }

    // Apply translations if the function is available
    if (typeof applyTranslations === "function") {
        applyTranslations(localStorage.getItem("language") || "en");
    }
}

auth.onAuthStateChanged(user => {
    console.log("Auth state changed. User:", user ? user.uid : "None");
    setupAuthUI(); // Re-render the auth UI elements
    document.dispatchEvent(new CustomEvent("authStateReady", { detail: { user: user } }));
});

function signUpUser(email, password, displayName) {
    return auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            console.log("User signed up:", user.uid);
            return user.updateProfile({
                displayName: displayName
            }).then(() => {
                const userDbRef = db.ref(`users/${user.uid}`);
                return userDbRef.set({
                    displayName: displayName,
                    email: email,
                    credits: 0, // Initialize credits to 0
                    inventory: { "mr_roon_classic": true }, // Grant default character
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                });
            });
        });
}

function loginUser(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log("User logged in:", userCredential.user.uid);
            return userCredential.user;
        });
}

function logoutUser() {
    return auth.signOut()
        .then(() => {
            console.log("User logged out successfully.");
            const nonRedirectPaths = ["/index.html", "/login.html", "/signUp.html", "/"];
            let onNonRedirectPage = nonRedirectPaths.some(p => window.location.pathname.endsWith(p) || (p === "/" && window.location.pathname === "/"));
            if (window.location.pathname.includes("index.html")) onNonRedirectPage = true; // Explicitly check for index.html
            
            if (!onNonRedirectPage) {
                 window.location.href = "index.html";
            }
        });
}

function getCurrentUser() {
    return auth.currentUser;
}

function getCurrentUserUID() {
    const user = getCurrentUser();
    return user ? user.uid : null;
}

document.addEventListener("DOMContentLoaded", () => {
    setupAuthUI(); // Initial setup on DOM load

    // Event listeners for login and signup forms (kept from original)
    if (document.getElementById("loginForm")) {
        const loginForm = document.getElementById("loginForm");
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            const errorDiv = document.getElementById("loginError");
            if(errorDiv) errorDiv.textContent = "";

            loginUser(email, password)
                .then(() => {
                    window.location.href = "index.html";
                })
                .catch(error => {
                    console.error("Login failed:", error.message);
                    if(errorDiv) errorDiv.textContent = error.message;
                });
        });
    }

    if (document.getElementById("signUpForm")) {
        const signUpForm = document.getElementById("signUpForm");
        signUpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const displayName = signUpForm.displayName.value;
            const email = signUpForm.email.value;
            const password = signUpForm.password.value;
            const confirmPassword = signUpForm.confirmPassword.value;
            const errorDiv = document.getElementById("signUpError");
            if(errorDiv) errorDiv.textContent = "";

            if (password !== confirmPassword) {
                if(errorDiv) errorDiv.textContent = "Passwords do not match.";
                return;
            }
            if (password.length < 6) {
                 if(errorDiv) errorDiv.textContent = "Password should be at least 6 characters.";
                return;
            }

            signUpUser(email, password, displayName)
                .then(() => {
                    window.location.href = "index.html";
                })
                .catch(error => {
                    console.error("Sign up failed:", error.message);
                    if(errorDiv) errorDiv.textContent = error.message;
                });
        });
    }
});

console.log("auth.js loaded and initialized with updated dropdown UI setup.");
