// Game State
let gameState = {
    clicks: 0,
    cps: 0,
    totalSpent: 0,
    totalCps: 0,
    soundEnabled: true,
    darkMode: false,
    cart: [],
    lastClickTime: Date.now(),
    clicksInSecond: 0,
    currentCps: 0,
    autoClicks: 0
};

// Shop Items
const shopItems = [
    { id: 1, name: "Auto Clicker", price: 50, cps: 1, emoji: "🤖" },
    { id: 2, name: "Mega Clicker", price: 200, cps: 5, emoji: "⚡" },
    { id: 3, name: "Ultra Booster", price: 500, cps: 15, emoji: "🚀" },
    { id: 4, name: "Quantum Clicker", price: 1000, cps: 40, emoji: "🌀" },
    { id: 5, name: "Infinity Boost", price: 5000, cps: 200, emoji: "∞" }
];

// DOM Elements
let clickButton, clickCountDisplay, balanceDisplay, cpsDisplay;
let shopItemsContainer, cartItemsContainer, totalSpentDisplay, totalCpsDisplay;
let resetButton, themeButton, soundButton, clickEffectsContainer;

// Initialize Game
function initGame() {
    console.log("Initializing game...");
    
    // Load saved state
    loadGameState();
    
    // Get DOM elements
    clickButton = document.getElementById('clickButton');
    clickCountDisplay = document.getElementById('clickCount');
    balanceDisplay = document.getElementById('balance');
    cpsDisplay = document.getElementById('cps');
    shopItemsContainer = document.getElementById('shopItems');
    cartItemsContainer = document.getElementById('cartItems');
    totalSpentDisplay = document.getElementById('totalSpent');
    totalCpsDisplay = document.getElementById('totalCps');
    resetButton = document.getElementById('resetButton');
    themeButton = document.getElementById('themeButton');
    soundButton = document.getElementById('soundButton');
    clickEffectsContainer = document.getElementById('clickEffects');
    
    console.log("DOM elements:", {
        clickButton: !!clickButton,
        clickCountDisplay: !!clickCountDisplay,
        balanceDisplay: !!balanceDisplay,
        cpsDisplay: !!cpsDisplay
    });
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize UI
    renderShop();
    updateCart();
    updateUI();
    
    // Start game loops
    startCpsCalculation();
    startAutoClicker();
    
    console.log("Game initialized successfully!");
}

// Setup Event Listeners
function setupEventListeners() {
    console.log("Setting up event listeners...");
    
    // Click button
    clickButton.addEventListener('click', handleClick);
    clickButton.addEventListener('mousedown', handleMouseDown);
    clickButton.addEventListener('mouseup', handleMouseUp);
    clickButton.addEventListener('touchstart', handleTouchStart);
    clickButton.addEventListener('touchend', handleTouchEnd);
    
    // Reset button
    resetButton.addEventListener('click', handleReset);
    
    // Theme button
    themeButton.addEventListener('click', toggleTheme);
    
    // Sound button
    soundButton.addEventListener('click', toggleSound);
    
    console.log("Event listeners set up");
}

// Click Handlers
function handleClick(event) {
    event.preventDefault();
    console.log("Click detected!");
    addClick();
}

function handleMouseDown() {
    clickButton.style.transform = 'scale(0.95)';
}

function handleMouseUp() {
    clickButton.style.transform = 'scale(1.05)';
    setTimeout(() => {
        clickButton.style.transform = '';
    }, 100);
}

function handleTouchStart() {
    clickButton.style.transform = 'scale(0.95)';
}

function handleTouchEnd() {
    clickButton.style.transform = 'scale(1.05)';
    setTimeout(() => {
        clickButton.style.transform = '';
    }, 100);
}

// Game Logic
function addClick() {
    gameState.clicks++;
    gameState.clicksInSecond++;
    
    // Create click effect
    createClickEffect();
    
    // Play sound if enabled
    if (gameState.soundEnabled) {
        playClickSound();
    }
    
    // Update UI
    updateUI();
    
    // Save game state
    saveGameState();
}

function createClickEffect() {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = '+1';
    
    // Random position around the click button
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 50;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    effect.style.left = `calc(50% + ${x}px)`;
    effect.style.top = `calc(50% + ${y}px)`;
    
    clickEffectsContainer.appendChild(effect);
    
    // Remove after animation
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 1000);
}

function buyItem(item) {
    if (gameState.clicks >= item.price) {
        gameState.clicks -= item.price;
        gameState.totalSpent += item.price;
        gameState.totalCps += item.cps;
        gameState.cart.push(item.id);
        
        // Play purchase sound
        if (gameState.soundEnabled) {
            playPurchaseSound();
        }
        
        // Update UI
        updateUI();
        updateCart();
        renderShop();
        
        // Show notification
        showNotification(`Purchased ${item.name}!`);
        
        // Save game state
        saveGameState();
    } else {
        showNotification("Not enough clicks!", 'error');
    }
}

function updateUI() {
    // Update displays
    clickCountDisplay.textContent = gameState.clicks.toLocaleString();
    balanceDisplay.textContent = gameState.clicks.toLocaleString();
    cpsDisplay.textContent = gameState.currentCps.toFixed(1);
    totalSpentDisplay.textContent = `$${gameState.totalSpent.toLocaleString()}`;
    totalCpsDisplay.textContent = gameState.totalCps.toLocaleString();
    
    // Update button states
    updateShopButtons();
}

function updateShopButtons() {
    const buttons = document.querySelectorAll('.buy-btn');
    buttons.forEach((button, index) => {
        const item = shopItems[index];
        if (item) {
            button.disabled = gameState.clicks < item.price;
            button.style.opacity = gameState.clicks < item.price ? '0.5' : '1';
        }
    });
}

function renderShop() {
    shopItemsContainer.innerHTML = '';
    
    shopItems.forEach(item => {
        const shopItem = document.createElement('div');
        shopItem.className = 'shop-item';
        
        shopItem.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.emoji} ${item.name}</div>
                <div class="item-details">
                    <span class="item-price">$${item.price.toLocaleString()}</span>
                    <span class="item-cps">+${item.cps} CPS</span>
                </div>
            </div>
            <button class="buy-btn" data-id="${item.id}">
                <i class="fas fa-shopping-cart"></i> Buy
            </button>
        `;
        
        shopItemsContainer.appendChild(shopItem);
        
        // Add event listener to buy button
        const buyButton = shopItem.querySelector('.buy-btn');
        buyButton.addEventListener('click', () => buyItem(item));
    });
}

function updateCart() {
    cartItemsContainer.innerHTML = '';
    
    // Count items in cart
    const itemCounts = {};
    gameState.cart.forEach(itemId => {
        itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
    });
    
    // Display items
    Object.entries(itemCounts).forEach(([itemId, count]) => {
        const item = shopItems.find(i => i.id === parseInt(itemId));
        if (item) {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.emoji} ${item.name}</div>
                    <div class="item-details">
                        <span class="item-price">Quantity: ${count}</span>
                        <span class="item-cps">+${item.cps * count} CPS</span>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        }
    });
}

// Game Loops
function startCpsCalculation() {
    setInterval(() => {
        const now = Date.now();
        const timeDiff = now - gameState.lastClickTime;
        
        if (timeDiff >= 1000) {
            // Manual CPS
            const manualCps = gameState.clicksInSecond;
            
            // Total CPS = manual + auto
            gameState.currentCps = manualCps + gameState.totalCps;
            gameState.clicksInSecond = 0;
            gameState.lastClickTime = now;
            
            // Update UI
            cpsDisplay.textContent = gameState.currentCps.toFixed(1);
        }
    }, 100);
}

function startAutoClicker() {
    setInterval(() => {
        if (gameState.totalCps > 0) {
            const autoClicks = Math.floor(gameState.totalCps);
            if (autoClicks > 0) {
                gameState.clicks += autoClicks;
                gameState.autoClicks += autoClicks;
                
                // Show auto click effect occasionally
                if (Math.random() < 0.3) {
                    createAutoClickEffect();
                }
                
                updateUI();
                saveGameState();
            }
        }
    }, 1000);
}

function createAutoClickEffect() {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = `+${gameState.totalCps}`;
    effect.style.color = '#4ecdc4';
    
    // Random position
    const x = Math.random() * 100 - 50;
    const y = Math.random() * 100 - 50;
    
    effect.style.left = `calc(50% + ${x}px)`;
    effect.style.top = `calc(50% + ${y}px)`;
    
    clickEffectsContainer.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 1000);
}

// Control Functions
function handleReset() {
    if (confirm("Are you sure you want to reset the game? All progress will be lost!")) {
        gameState = {
            clicks: 0,
            cps: 0,
            totalSpent: 0,
            totalCps: 0,
            soundEnabled: gameState.soundEnabled,
            darkMode: gameState.darkMode,
            cart: [],
            lastClickTime: Date.now(),
            clicksInSecond: 0,
            currentCps: 0,
            autoClicks: 0
        };
        
        localStorage.removeItem('clickerGameSave');
        
        updateUI();
        updateCart();
        renderShop();
        
        showNotification("Game reset successfully!");
    }
}

function toggleTheme() {
    gameState.darkMode = !gameState.darkMode;
    
    if (gameState.darkMode) {
        document.body.classList.add('dark-mode');
        themeButton.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        themeButton.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    }
    
    saveGameState();
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    
    if (gameState.soundEnabled) {
        soundButton.innerHTML = '<i class="fas fa-volume-up"></i> Sound On';
        // Test sound
        playClickSound();
    } else {
        soundButton.innerHTML = '<i class="fas fa-volume-mute"></i> Sound Off';
    }
    
    saveGameState();
}

// Sound Functions
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800 + Math.random() * 200;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.log("Audio not supported:", error);
    }
}

function playPurchaseSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Play multiple tones for purchase sound
        [1200, 1000, 1500].forEach((frequency, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            }, index * 50);
        });
    } catch (error) {
        console.log("Audio not supported:", error);
    }
}

// Utility Functions
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'error' ? '#ff6b6b' : '#4ecdc4'};
        color: white;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        animation-fill-mode: forwards;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function saveGameState() {
    try {
        localStorage.setItem('clickerGameSave', JSON.stringify(gameState));
    } catch (error) {
        console.log("Error saving game state:", error);
    }
}

function loadGameState() {
    try {
        const saved = localStorage.getItem('clickerGameSave');
        if (saved) {
            const loadedState = JSON.parse(saved);
            gameState = { ...gameState, ...loadedState };
        }
    } catch (error) {
        console.log("Error loading game state:", error);
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded, starting game...");
    initGame();
});

// Test function for debugging
window.debugClick = function() {
    console.log("Manual click via debug function");
    addClick();
};

// Export for testing
window.gameState = gameState;
window.addClick = addClick;