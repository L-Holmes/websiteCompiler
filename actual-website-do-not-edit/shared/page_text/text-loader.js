var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Loads translations and updates the page content accordingly.
 */
function loadTranslations() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting to load translations");
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get("lang") || "en"; // Default to English
        const page = document.body.getAttribute("data-page"); // Get page name
        if (!page) {
            console.error("No data-page attribute found on <body>");
            return;
        }
        try {
            const response = yield fetch(`../../../shared/page_text/${lang}.json`);
            const translations = yield response.json();
            // Apply translations
            document.querySelectorAll("[add-text-section]").forEach((el) => {
                var _a, _b;
                const key = el.getAttribute("add-text-section");
                if (!key)
                    return;
                el.innerText = ((_a = translations[page]) === null || _a === void 0 ? void 0 : _a[key]) ||
                    ((_b = translations["shared"]) === null || _b === void 0 ? void 0 : _b[key]) ||
                    key;
            });
            // Update all links to maintain the ?lang=xx in URLs
            document.querySelectorAll("a").forEach((link) => {
                const href = new URL(link.href, window.location.origin);
                href.searchParams.set("lang", lang); // Ensure language is in the URL
                link.href = href.toString();
            });
            console.log("Finished loading translations");
        }
        catch (error) {
            console.error("Error loading translations:", error);
        }
    });
}
/**
 * Sets the language and reloads the page with the new language setting.
 * @param lang - The language to set (e.g., "en", "fr").
 */
function setLanguage(lang) {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.location.href = url.toString(); // Reload with new language setting
}
// Run on page load
document.addEventListener("DOMContentLoaded", loadTranslations);
