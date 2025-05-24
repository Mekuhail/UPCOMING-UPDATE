// aboutUs.js - Theme Toggling Logic

function toggleTheme() {
    const body = document.body;
    body.classList.toggle("light-mode"); // Standardizing on light-mode class for light theme

    const button = document.querySelector(".theme-toggle");
    const isLightMode = body.classList.contains("light-mode");

    if (isLightMode) {
        button.textContent = "Dark Mode";
        localStorage.setItem("theme", "light");
    } else {
        button.textContent = "Light Mode";
        localStorage.setItem("theme", "dark");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const button = document.querySelector(".theme-toggle");

    // Apply stored theme or default to dark mode
    if (localStorage.getItem("theme") === "light") {
        body.classList.add("light-mode");
        if (button) button.textContent = "Dark Mode";
    } else {
        body.classList.remove("light-mode"); // Ensure dark mode is active if not light
        if (button) button.textContent = "Light Mode";
    }

    // Smooth scroll for anchor links (already in aboutUs.html, kept here for modularity if HTML script is removed)
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute("href"));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // Intersection Observer for section animations (already in aboutUs.html)
    const sections = document.querySelectorAll("section");
    if (sections.length > 0 && typeof IntersectionObserver !== "undefined") {
        const options = {
            root: null, 
            rootMargin: "0px",
            threshold: 0.1
        };
        const observer = new IntersectionObserver(function(entries, observerInstance) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                }
                entry.target.classList.add("visible");
                observerInstance.unobserve(entry.target);
            });
        }, options);
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Dynamic Year for Footer (already in aboutUs.html)
    const currentYearElement = document.getElementById("currentYear");
    if (currentYearElement && !currentYearElement.textContent) { // Check if not already set by HTML
         currentYearElement.textContent = new Date().getFullYear();
    }
});

