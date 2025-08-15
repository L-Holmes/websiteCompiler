// Define the expected structure of translations
interface Translations {
    [page: string]: {
        [key: string]: string;
    };
}

/**
 * Loads translations and updates the page content accordingly.
 */
async function loadTranslations(): Promise<void> {
    console.log("Starting to load translations");
    
    // Get URL parameters
    const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
    const lang: string = urlParams.get("lang") || "en"; // Default to English
    
    const page: string | null = document.body.getAttribute("data-page"); // Get page name
    if (!page) {
        console.error("No data-page attribute found on <body>");
        return;
    }
    
    try {
        const response: Response = await fetch(`<root>/shared/page_text/${lang}.json`);
        const translations: Translations = await response.json();
        
        // Apply translations
        document.querySelectorAll("[add-text-section]").forEach((el: Element) => {
            const key: string | null = el.getAttribute("add-text-section");
            if (!key) return;
            
            (el as HTMLElement).innerText = translations[page]?.[key] || 
                                            translations["shared"]?.[key] || 
                                            key;
        });
        
        // Update all links to maintain the ?lang=xx in URLs
        document.querySelectorAll("a").forEach((link: HTMLAnchorElement) => {
            const href: URL = new URL(link.href, window.location.origin);
            href.searchParams.set("lang", lang); // Ensure language is in the URL
            link.href = href.toString();
        });
        
        console.log("Finished loading translations");
    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

/**
 * Sets the language and reloads the page with the new language setting.
 * @param lang - The language to set (e.g., "en", "fr").
 */
function setLanguage(lang: string): void {
    const url: URL = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.location.href = url.toString(); // Reload with new language setting
}

// Run on page load
document.addEventListener("DOMContentLoaded", loadTranslations);
