// main.js — combined code from index.js and intro.js
// © 2025 Matharoon — All rights reserved

// Set the page title immediately so the tab feels snappy
// (no need to wait for DOMContentLoaded)
document.title = "Matharoon - Fun Math Games & Learning Platform";

/**
 * Everything else waits for the DOM to be ready so we can safely
 * grab elements that might be placed anywhere in the document.
 */
document.addEventListener("DOMContentLoaded", () => {
    /* ------------------------------------------------------------------ */
    /* THEME TOGGLING                                                     */
    /* ------------------------------------------------------------------ */
    const body = document.body;
    const themeToggleBtn = document.querySelector(".theme-toggle");

    // Apply the requested theme and update the toggle button label
    const applyTheme = (theme /* 'light' | 'dark' */) => {
        const isLight = theme === "light";
        body.classList.toggle("light-mode", isLight);
        if (themeToggleBtn) themeToggleBtn.textContent = isLight ? "Dark Mode" : "Light Mode";
    };

    // Initialise from localStorage (defaults to dark)
    applyTheme(localStorage.getItem("theme") || "dark");

    // Expose a global for HTML onclick="toggleTheme()"
    window.toggleTheme = () => {
        const isLight = body.classList.toggle("light-mode");
        if (themeToggleBtn) themeToggleBtn.textContent = isLight ? "Dark Mode" : "Light Mode";
        localStorage.setItem("theme", isLight ? "light" : "dark");
    };

    /* ------------------------------------------------------------------ */
    /* ACCOUNT DROPDOWN MENU                                              */
    /* ------------------------------------------------------------------ */
    const accountBtn = document.getElementById("accountBtn");
    const accountDropdown = document.getElementById("accountDropdown");
    const accountMenuContainer = document.getElementById("accountMenuContainer");

    if (accountBtn && accountDropdown && accountMenuContainer) {
        const hideDropdown = () => {
            if (!accountDropdown.classList.contains("hidden")) {
                accountDropdown.classList.add("hidden");
                accountBtn.setAttribute("aria-expanded", "false");
            }
        };

        accountBtn.addEventListener("click", event => {
            event.stopPropagation(); // don’t let the click bubble and instantly close the menu
            accountDropdown.classList.toggle("hidden");
            accountBtn.setAttribute("aria-expanded", accountDropdown.classList.contains("hidden") ? "false" : "true");
        });

        // Close on outside‑click
        document.addEventListener("click", event => {
            if (!accountMenuContainer.contains(event.target)) hideDropdown();
        });

        // Close on Esc for keyboard/screen‑reader users
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                hideDropdown();
                accountBtn.focus();
            }
        });
    } else {
        console.warn("Account menu elements not found – dropdown disabled.");
    }

    /* ------------------------------------------------------------------ */
    /* NEWS LIST (mock data for now)                                      */
    /* ------------------------------------------------------------------ */
    const newsItems = [
        { date: "2025-05-10", message: "Welcome to the new Matharoon!" },
        { date: "2025-05-09", message: "RoonRun game updated with new features!" },
        { date: "2025-05-08", message: "Check out the enhanced store items!" }
    ];

    const newsList = document.getElementById("newsList");
    if (newsList) {
        newsList.innerHTML = newsItems
            .map(item => `<li><span class="news-item-date">${item.date}</span>${item.message}</li>`) // prettier-ignore
            .join("");
    }
});
