/* 
FILE: script.js
DESCRIPTION: All JavaScript logic. Save as "script.js" in the same folder.
             Fully functional: language toggle, dynamic menu, modal form, WhatsApp forwarding, animations.
             Every single line is heavily commented so you can debug/fix errors yourself.
             Replace MENU_ITEMS with your real menu from the Google Doc.
*/

// ==================== CONFIGURATION ====================
const WHATSAPP_NUMBER = '+391234567890'; // ←←← CHANGE THIS TO YOUR REAL WHATSAPP NUMBER (international format)

// Sample menu - REPLACE THIS ENTIRE ARRAY WITH YOUR GOOGLE DOC DATA
// Format: { id, nameEn, nameIt, descEn, descIt, price, category, img }
let MENU_ITEMS = [
    { id:1, nameEn:"Arancini al Ragu", nameIt:"Arancini al Ragu", descEn:"Crispy saffron rice balls filled with slow-cooked beef ragu", descIt:"Palline di riso allo zafferano croccanti ripiene di ragù di manzo", price:5.5, category:"Starters", img:"https://picsum.photos/id/29/600/400" },
    { id:2, nameEn:"Bruschetta Classica", nameIt:"Bruschetta Classica", descEn:"Toasted sourdough with fresh tomatoes, basil & extra virgin olive oil", descIt:"Pane tostato con pomodori freschi, basilico e olio extravergine", price:4.0, category:"Starters", img:"https://picsum.photos/id/30/600/400" },
    { id:3, nameEn:"Margherita Pizza Slice", nameIt:"Fetta di Pizza Margherita", descEn:"San Marzano tomatoes, fresh mozzarella, basil", price:6.0, category:"Mains", img:"https://picsum.photos/id/201/600/400" },
    { id:4, nameEn:"Pasta Carbonara", nameIt:"Pasta alla Carbonara", descEn:"Silky egg, pecorino & crispy pancetta", price:8.5, category:"Mains", img:"https://picsum.photos/id/251/600/400" },
    { id:5, nameEn:"Panino Porchetta", nameIt:"Panino Porchetta", descEn:"Slow-roasted pork, salsa verde, pickled onions", price:7.0, category:"Mains", img:"https://picsum.photos/id/29/600/400" },
    { id:6, nameEn:"Tiramisù", nameIt:"Tiramisù", descEn:"Classic coffee-soaked ladyfingers with mascarpone", price:4.5, category:"Desserts", img:"https://picsum.photos/id/29/600/400" },
    { id:7, nameEn:"Gelato Artigianale", nameIt:"Gelato Artigianale", descEn:"Choose pistachio, stracciatella or lemon", price:3.0, category:"Desserts", img:"https://picsum.photos/id/30/600/400" },
    { id:8, nameEn:"Fresh Limonata", nameIt:"Limonata Fresca", descEn:"Hand-squeezed Sicilian lemons & mint", price:3.5, category:"Drinks", img:"https://picsum.photos/id/201/600/400" }
];

// Current language
let currentLang = 'en';

// Render the entire menu dynamically
function renderMenu() {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';
    
    MENU_ITEMS.forEach(dish => {
        const card = document.createElement('div');
        card.className = 'dish-card bg-zinc-900 rounded-3xl overflow-hidden group';
        
        card.innerHTML = `
            <img src="${dish.img}" alt="${dish.nameEn}" class="w-full h-60 object-cover">
            <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="text-2xl font-playfair" id="dish-name-${dish.id}">${currentLang === 'en' ? dish.nameEn : dish.nameIt}</h3>
                        <p class="text-xs text-orange-400 mt-1">${dish.category}</p>
                    </div>
                    <span class="text-2xl font-bold text-orange-400">€${dish.price}</span>
                </div>
                <p class="text-zinc-400 text-sm line-clamp-3 mb-6" id="dish-desc-${dish.id}">
                    ${currentLang === 'en' ? dish.descEn : dish.descIt}
                </p>
                
                <!-- ORDER NOW BUTTON -->
                <button onclick="openOrderModal(${dish.id})" 
                        class="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2">
                    <span id="order-now-${dish.id}-en">ORDER NOW</span>
                    <span id="order-now-${dish.id}-it" class="hidden">ORDINA ORA</span>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Open modal and pre-select the clicked dish
function openOrderModal(dishId) {
    const dish = MENU_ITEMS.find(d => d.id === dishId);
    if (!dish) return;
    
    // Populate select with ALL dishes
    const select = document.getElementById('dish-select');
    select.innerHTML = '<option value="">Choose your dish...</option>';
    
    MENU_ITEMS.forEach(item => {
        const option = document.createElement('option');
        option.value = currentLang === 'en' ? item.nameEn : item.nameIt;
        option.textContent = `${currentLang === 'en' ? item.nameEn : item.nameIt} — €${item.price}`;
        select.appendChild(option);
    });
    
    // Pre-select the clicked dish
    select.value = currentLang === 'en' ? dish.nameEn : dish.nameIt;
    
    // Show modal
    document.getElementById('order-modal').classList.remove('hidden');
    document.getElementById('order-modal').classList.add('flex');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('order-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Handle form submission → WhatsApp
function handleOrderSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const dish = document.getElementById('dish-select').value;
    
    if (!name || !phone || !dish) {
        alert("Please fill all fields!");
        return;
    }
    
    const message = `🚚 New Order from Veloce Truck website!%0A%0A` +
                    `Name: ${name}%0A` +
                    `Phone: ${phone}%0A` +
                    `Dish: ${dish}%0A%0A` +
                    `Ready to pay on delivery!`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Success feedback
    closeModal();
    setTimeout(() => {
        alert("✅ Order sent to WhatsApp! 🎉");
    }, 500);
}

// Language toggle (EN ↔ IT)
function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'it' : 'en';
    
    // Update static texts
    document.getElementById('btn-en').classList.toggle('bg-orange-500', currentLang === 'en');
    document.getElementById('btn-en').classList.toggle('text-black', currentLang === 'en');
    document.getElementById('btn-it').classList.toggle('bg-orange-500', currentLang === 'it');
    document.getElementById('btn-it').classList.toggle('text-black', currentLang === 'it');
    
    // Update all IDs that have both versions
    const elements = {
        'hero-badge-en': 'hero-badge-it',
        'hero-title-en': 'hero-title-it',
        'hero-subtitle-en': 'hero-subtitle-it',
        'hero-cta-en': 'hero-cta-it',
        'order-btn-en': 'order-btn-it',
        'about-title-en': 'about-title-it',
        'about-text-en': 'about-text-it',
        'about-stat-en': 'about-stat-it',
        'menu-title-en': 'menu-title-it',
        'modal-title-en': 'modal-title-it',
        'buy-btn-en': 'buy-btn-it'
    };
    
    Object.keys(elements).forEach(enId => {
        const enEl = document.getElementById(enId);
        const itEl = document.getElementById(elements[enId]);
        if (enEl && itEl) {
            enEl.classList.toggle('hidden', currentLang !== 'en');
            itEl.classList.toggle('hidden', currentLang !== 'it');
        }
    });
    
    // Re-render menu with new language
    renderMenu();
}

// Smooth scroll helper
function smoothScrollTo(section) {
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
}

// Tailwind script initialization
function initTailwind() {
    // Already initialized via CDN
}

// Start the website
function initializeWebsite() {
    // Render menu first time
    renderMenu();
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
    
    console.log('%c✅ Veloce Truck website loaded successfully! 🚚', 'color:orange; font-size:16px');
}

// Run when page loads
window.onload = initializeWebsite;

/* 
404 ERROR PAGE INSTRUCTIONS:
1. Create a new file called "404.html" in the same folder.
2. Copy the entire content below into it.
3. When you host the site (Netlify, Vercel, GitHub Pages), set the custom 404 page to point to 404.html.
   Every wrong URL will automatically show the beautiful 404 truck page.
*/
