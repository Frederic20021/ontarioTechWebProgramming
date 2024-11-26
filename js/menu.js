class MenuManager {
    constructor() {
        console.log('MenuManager initialized');
        this.menuGrid = document.getElementById('menuGrid');
        this.threeDView = document.getElementById('threeDView');
        this.selectedItemName = document.getElementById('selectedItemName');
        this.menuData = null;
    }

    async init() {
        console.log('MenuManager init called');
        try {
            await this.loadMenuData();
            this.renderMenuItems();
        } catch (error) {
            console.error('Error initializing menu:', error);
            // Optionally show user-friendly error message
            this.menuGrid.innerHTML = '<p>Sorry, there was an error loading the menu. Please try again later.</p>';
        }
    }

    async loadMenuData() {
        try {
            const response = await fetch('../data/menuData.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.menuData = data.menuData;
            console.log('Menu data loaded:', this.menuData);
        } catch (error) {
            console.error('Error loading JSON:', error);
            throw error; // Re-throw to be handled by init()
        }
    }

    renderMenuItems() {
        console.log('Rendering menu items');
        if (!this.menuData) {
            console.error('No menu data available');
            return;
        }

        this.menuGrid.innerHTML = ''; // Clear existing items
        this.menuData.forEach(item => {
            const menuItem = this.createMenuItem(item);
            this.menuGrid.appendChild(menuItem);
        });
    }

    createMenuItem(item) {
        console.log('Creating menu item:', item.name);
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='/images/placeholder.jpg'">
            <div class="menu-item-content">
                <h3 class="menu-item-title">${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <p class="menu-item-price">$${item.price}</p>
            </div>
        `;

        div.addEventListener('click', () => {
            console.log('Menu item clicked:', item.name);
            this.handleMenuItemClick(item);
        });
        return div;
    }

    handleMenuItemClick(item) {
        console.log('Handling menu item click:', item);
        if (!item || !item.name) {
            console.error('Invalid item clicked:', item);
            return;
        }

        this.selectedItemName.textContent = item.name;
        this.threeDView.classList.remove('hidden');
        const target = document.getElementById('threeDView');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (window.threeDViewer) {
            console.log('Calling threeDViewer.loadModel with:', item.name);
            window.threeDViewer.loadModel(item.name);
        } else {
            console.error('threeDViewer not initialized');
            alert('3D viewer not initialized');
        }
    }
}

// Add debug log for when the script loads
console.log('menu.js loaded');

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing MenuManager');
    window.menuManager = new MenuManager();
    await window.menuManager.init();
});
