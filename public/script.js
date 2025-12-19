// ================= CONFIGURATION & DATA =================
const CONFIG = {
    cartKey: 'herbalCart',
    userKey: 'herbalHealth_user',
    stickyHeaderOffset: 50,
    headerLoadDelay: 0,
    API_BASE_URL: 'http://localhost:5000/api'
};
// ================= SETUP DISEASE LINKS =================
function setupDiseaseLinks() {
    document.querySelectorAll('[data-disease]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const disease = link.dataset.disease;
            window.location.href = `search-results.html?disease=${encodeURIComponent(disease)}`;
        });
    });
}
// ================= CORE UTILITIES =================
const Utils = {
    getCart() {
        try {
            const cart = localStorage.getItem(CONFIG.cartKey);
            return cart ? JSON.parse(cart) : [];
        } catch (e) {
            console.error('Error reading cart:', e);
            return [];
        }
    },

    saveCart(cart) {
        try {
            localStorage.setItem(CONFIG.cartKey, JSON.stringify(cart));
            this.updateCartCount();
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    },

    updateCartCount() {
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCountElements = document.querySelectorAll('#cart-count, #cart-count-results');
        cartCountElements.forEach(element => {
            if (element) element.textContent = totalItems;
        });
    },

    safeQuerySelector(selector) {
        return document.querySelector(selector);
    },

    safeGetElement(id) {
        return document.getElementById(id);
    },

    addSafeEventListener(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
        }
    }
};
// ================= HEADER & FOOTER MANAGER =================
const HeaderFooterManager = {
    init() {
        this.loadHeaderAndFooter();
        setTimeout(() => {
            this.initHeaderFunctionality();
            Utils.updateCartCount();
        }, CONFIG.headerLoadDelay);
    },

    loadHeaderAndFooter() {
        this.loadHeader();
        this.loadFooter();
    },

    loadHeader() {
        const headerContainer = Utils.safeGetElement('header-container');
        if (!headerContainer) return;

        headerContainer.innerHTML = `
            <header>
                <div class="container nav-container">
                    <div class="logo">
                        <i class="fas fa-leaf"></i>
                        <span>Herbal Health</span>
                    </div>
                    <ul class="nav-links">
                        <li><a href="index.html#home">Home</a></li>
                        <li><a href="index.html#products">Products</a></li>
                        <li><a href="index.html#recommendations">Recommendations</a></li>
                        <li><a href="index.html#about">About</a></li>
                        <li><a href="index.html#contact">Contact</a></li>
                    </ul>
                    <div class="nav-icons">
                        <div class="search-icon">
                            <i class="fas fa-search" id="nav-search"></i>
                        </div>
                        <div class="cart-icon">
                            <a href="shopping_cart.html">
                                <i class="fas fa-shopping-cart"></i>
                                <span class="cart-count" id="cart-count">0</span>
                            </a>
                        </div>
                        
                        <div class="login-dropdown">
                            <a href="#" class="login-btn" id="login-btn">
                                <span>Login/Register</span>
                                <i class="fas fa-chevron-down"></i>
                            </a>
                            <div class="login-dropdown-content" id="login-dropdown-content">
                                <a href="login.html" id="login-option">Login</a>
                                <a href="register.html" id="register-option">Register</a>
                            </div>
                        </div>
                        
                        <div class="user-profile">
                            <i class="fas fa-user" id="user-icon"></i>
                            <div class="profile-dropdown" id="profile-dropdown">
                                <a href="#" class="user-option" data-role="user">User Profile</a>
                                <a href="#" class="user-option" data-role="staff">Staff Dashboard</a>
                                <a href="#" class="user-option" data-role="admin">Admin Panel <span class="admin-badge">Admin</span></a>
                                <a href="#">Settings</a>
                                <a href="#">Logout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        `;
    },

    loadFooter() {
        const footerContainer = Utils.safeGetElement('footer-container');
        if (!footerContainer) return;

        footerContainer.innerHTML = `
            <footer id="contact">
                <div class="container">
                    <div class="footer-content">
                        <div class="footer-column">
                            <h3>Herbal Health</h3>
                            <p>Your trusted source for natural remedies and wellness products.</p>
                            <div class="social-icons">
                                <a href="#"><i class="fab fa-facebook-f"></i></a>
                                <a href="#"><i class="fab fa-twitter"></i></a>
                                <a href="#"><i class="fab fa-instagram"></i></a>
                                <a href="#"><i class="fab fa-pinterest"></i></a>
                            </div>
                        </div>
                        <div class="footer-column">
                            <h3>Quick Links</h3>
                            <ul class="footer-links">
                                <li><a href="index.html#home">Home</a></li>
                                <li><a href="index.html#products">Products</a></li>
                                <li><a href="index.html#about">About</a></li>
                                <li><a href="index.html#contact">Contact</a></li>
                            </ul>
                        </div>
                        <div class="footer-column">
                            <h3>Categories</h3>
                            <ul class="footer-links">
                                <li><a href="search-results.html?disease=Diabetes">Diabetes Products</a></li>
                                <li><a href="search-results.html?disease=High Blood Pressure">Blood Pressure</a></li>
                                <li><a href="search-results.html?disease=Digestive Issues">Digestive Health</a></li>
                            </ul>
                        </div>
                        <div class="footer-column">
                            <h3>Contact Us</h3>
                            <ul class="footer-links">
                                <li><i class="fas fa-map-marker-alt"></i> Tahrir Street, Cairo</li>
                                <li><i class="fas fa-phone"></i> +20108651139</li>
                                <li><i class="fas fa-envelope"></i> info@herbalhealth.com</li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; 2023 Herbal Health. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
    },

    initHeaderFunctionality() {
        this.initUserDropdown();
        this.initProfileDropdownNavigation();
        this.initLoginDropdown();
        this.initSearchNavigation();
        this.initSmoothScrolling();
        this.initLogoutHandler(); 
        AuthManager.updateAuthUI(); 
    },

    initUserDropdown() {
        const userIcon = Utils.safeGetElement('user-icon');
        const profileDropdown = Utils.safeGetElement('profile-dropdown');

        Utils.addSafeEventListener(userIcon, 'click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });

        Utils.addSafeEventListener(document, 'click', () => {
            if (profileDropdown) profileDropdown.classList.remove('active');
        });
    },

    initProfileDropdownNavigation() {
        const userLink = document.querySelector('.user-option[data-role="user"]');
        const staffLink = document.querySelector('.user-option[data-role="staff"]');
        const adminLink = document.querySelector('.user-option[data-role="admin"]');

        if (userLink) {
            userLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'user.html';
            });
        }
        
        if (staffLink) {
            staffLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'staff.html';
            });
        }

        if (adminLink) {
            adminLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'admin.html';
            });
        }
    },

    initLoginDropdown() {
        const loginBtn = document.getElementById('login-btn');
        const loginDropdown = document.getElementById('login-dropdown-content');
        const loginOption = document.getElementById('login-option');
        const registerOption = document.getElementById('register-option');

        if (loginBtn && loginDropdown) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                loginDropdown.classList.toggle('active');
            });

            if (loginOption) {
                loginOption.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'login.html';
                });
            }

            if (registerOption) {
                registerOption.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'register.html';
                });
            }

            document.addEventListener('click', (e) => {
                if (loginDropdown && !loginDropdown.contains(e.target) && !loginBtn.contains(e.target)) {
                    loginDropdown.classList.remove('active');
                }
            });
        }
    },

    initSearchNavigation() {
        const navSearch = Utils.safeGetElement('nav-search');
        Utils.addSafeEventListener(navSearch, 'click', () => {
            window.location.href = 'index.html#search-section';
        });
    },

    initLogoutHandler() {
        const logoutBtn = document.querySelector('.profile-dropdown a[href="#"]:last-child');
        if (logoutBtn && logoutBtn.textContent.includes('Logout')) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (confirm('Are you sure you want to logout?')) {
                    AuthManager.logout();
                }
            });
        }
        
        document.addEventListener('click', (e) => {
            const target = e.target;
            if ((target.textContent === 'Logout' || target.textContent.includes('Logout')) && 
                target.tagName === 'A') {
                e.preventDefault();
                
                if (confirm('Are you sure you want to logout?')) {
                    AuthManager.logout();
                }
            }
        });
    },

    initSmoothScrolling() {
        Utils.addSafeEventListener(document, 'click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
                const href = e.target.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    history.pushState(null, null, href);
                }
            }
        });
    }
};
// ================= CART MANAGER =================
const CartManager = {
    isProcessing: false, // ✅ علامة لمنع التشغيل المتعدد
    
    // دالة بسيطة لإنشاء ID
    generateProductId(product) {
        return product._id || product.id || `product_${Date.now()}`;
    },
    
    getCartFromBackend: async function() {
    // ❌ مفتاح للتحكم في الدالة: False لاستخدام التخزين المحلي، True لتفعيل الـ API
    const USE_MOCK_DATA = false; 
    
    // إذا كنت لا تملك الخادم أو لا تريد اتصالات حالياً
    if (!USE_MOCK_DATA) {
        console.warn("getCartFromBackend called. Using local storage data (MOCK MODE).");
        return Utils.getCart();
    }
    
    // 🏆 هذا هو كود الـ Fetch الحقيقي (الذي يمكن مناقشته) 🏆
    try {
        const token = AuthManager.getToken();
        if (!token) {
            console.error("User not authenticated for fetching cart.");
            return Utils.getCart(); // الرجوع للسلة المحلية إذا لم يكن هناك توكن
        }

        const response = await fetch(`${CONFIG.API_BASE_URL}/cart`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // إذا فشل الـ API، نستخدم البيانات المحلية كخيار احتياطي
            console.error(`Failed to fetch cart from backend: ${response.status}`);
            return Utils.getCart(); 
        }

        const backendCart = await response.json();
        
        // ملاحظة: عادةً يتم مزامنة الـ Local Storage مع ما يأتي من الـ Backend هنا.
        // Utils.saveCart(backendCart.items); 
        
        return backendCart.items || [];

    } catch (error) {
        console.error("Network error during cart fetch:", error);
        // نستخدم البيانات المحلية في حال وجود خطأ في الشبكة
        return Utils.getCart(); 
    }
},
    addToCart(product) {
        console.log("🛒 addToCart called with:", product);
        
        // ✅ منع التشغيل المتعدد
        if (this.isProcessing) {
            console.log("⏱️ Processing another request, skipping...");
            return;
        }
        
        this.isProcessing = true;
        
        try {
            let cart = Utils.getCart();
            const productId = this.generateProductId(product);
            const priceValue = this.parsePrice(product.price);
            
            if (isNaN(priceValue) || priceValue <= 0) {
                alert("Error: Product price is invalid.");
                return;
            }
            
            // البحث عن المنتج
            const existingItemIndex = cart.findIndex(item => 
                item.id === productId || 
                item._originalId === product._id
            );
            
            if (existingItemIndex !== -1) {
                // ✅ زيادة الكمية فقط
                cart[existingItemIndex].quantity += 1;
            } else {
                // ✅ إضافة منتج جديد
                cart.push({
                    id: productId,
                    name: product.name,
                    price: priceValue,
                    image: product.image || 'images/default-product.jpg',
                    quantity: 1,
                    _originalId: product._id || '',
                    _addedAt: Date.now()
                });
            }
            
            Utils.saveCart(cart);
            
            // ✅ إشعار واحد فقط
            this.showNotification(
                existingItemIndex !== -1 ? 
                `Updated ${product.name} quantity` : 
                `Added ${product.name} to cart!`
            );
            
            // ✅ تحديث العرض إذا كانت صفحة السلة
            if (window.location.pathname.includes('shopping_cart.html')) {
                this.displayCart();
            }
            
        } catch (error) {
            console.error("Error in addToCart:", error);
        } finally {
            // ✅ إعادة السماح بالتشغيل بعد انتهاء العملية
            setTimeout(() => {
                this.isProcessing = false;
            }, 500);
        }
    },
    
    parsePrice(price) {
        if (!price) return 0;
        if (typeof price === 'number') return price;
        const cleanPrice = String(price).replace(/[^\d.]/g, '');
        const parsed = parseFloat(cleanPrice);
        return isNaN(parsed) ? 0 : parsed;
    },
    
    showNotification(message) {
        // إزالة الإشعارات القديمة
        const oldAlerts = document.querySelectorAll('.cart-notification');
        oldAlerts.forEach(alert => alert.remove());
        
        // إنشاء إشعار جديد
        const alertDiv = document.createElement('div');
        alertDiv.className = 'cart-notification';
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(alertDiv);
        
        // إزالته بعد 3 ثواني
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => alertDiv.remove(), 300);
            }
        }, 3000);
    },

    displayCart() {
        const cart = Utils.getCart();
        const cartItemsContainer = Utils.safeQuerySelector('#cart-items');
        
        if (!cartItemsContainer) {
            this.renderCartItemsOld();
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 50px;">
                        <i class="fas fa-shopping-cart fa-3x" style="color: #ddd;"></i>
                        <h4 style="color: #666; margin-top: 20px;">Your cart is empty</h4>
                    </td>
                </tr>
            `;
        } else {
            cart.forEach((item) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <img src="${item.image}" alt="${item.name}" 
                             class="cart-item-image"
                             onerror="this.src='images/default-product.jpg'">
                    </td>
                    <td>${item.name}</td>
                    <td>${item.price.toFixed(2)} EGP</td>
                    <td>
                        <div class="quantity-control">
                            <button class="qty-btn qty-decrease" data-id="${item.id}">-</button>
                            <input type="number" value="${item.quantity}" min="1" 
                                   class="qty-input" data-id="${item.id}" 
                                   style="width: 50px; text-align: center;">
                            <button class="qty-btn qty-increase" data-id="${item.id}">+</button>
                        </div>
                    </td>
                    <td class="item-total">${itemTotal.toFixed(2)} EGP</td>
                    <td>
                        <button class="btn-remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                cartItemsContainer.appendChild(row);
            });
        }
        
        this.updateCartTotals(total);
        this.bindCartEvents();
    },

    bindCartEvents() {
        const cartItemsContainer = Utils.safeQuerySelector('#cart-items');
        if (!cartItemsContainer) return;
        
        // ✅ إزالة الأحداث القديمة أولاً لمنع التكرار
        const newContainer = cartItemsContainer.cloneNode(true);
        cartItemsContainer.parentNode.replaceChild(newContainer, cartItemsContainer);
        
        const currentContainer = Utils.safeQuerySelector('#cart-items');
        
        // ✅ استخدام event delegation مرة واحدة فقط
        currentContainer.addEventListener('click', (e) => {
            const target = e.target;
            
            if (target.closest('.qty-increase')) {
                const button = target.closest('.qty-increase');
                const productId = button.dataset.id;
                e.stopPropagation();
                this.changeQuantity(productId, 1);
            }
            else if (target.closest('.qty-decrease')) {
                const button = target.closest('.qty-decrease');
                const productId = button.dataset.id;
                e.stopPropagation();
                this.changeQuantity(productId, -1);
            }
            else if (target.closest('.btn-remove')) {
                const button = target.closest('.btn-remove');
                const productId = button.dataset.id;
                e.stopPropagation();
                if (confirm('Are you sure you want to remove this item from cart?')) {
                    this.removeFromCart(productId);
                }
            }
        });
        
        // ✅ أحداث الكيبورد مرة واحدة فقط
        currentContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('qty-input')) {
                const input = e.target;
                const productId = input.dataset.id;
                const newQuantity = parseInt(input.value);
                
                if (!isNaN(newQuantity) && newQuantity > 0) {
                    this.setQuantity(productId, newQuantity);
                } else {
                    input.value = 1;
                    this.setQuantity(productId, 1);
                }
            }
        });
    },

    // ✅ دالة البلس والماينس المصححة
    changeQuantity(productId, delta) {
        const cart = Utils.getCart();
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex === -1) {
            console.log(`❌ Item not found: ${productId}`);
            return;
        }
        
        const item = cart[itemIndex];
        const newQuantity = item.quantity + delta;
        
        if (newQuantity >= 1) {
            item.quantity = newQuantity;
            Utils.saveCart(cart);
            this.displayCart();
        } else if (newQuantity < 1) {
            if (confirm(`Remove ${item.name} from cart?`)) {
                this.removeFromCart(productId);
            } else {
                item.quantity = 1;
                Utils.saveCart(cart);
                this.displayCart();
            }
        }
    },

    setQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            if (confirm('Remove this item from cart?')) {
                this.removeFromCart(productId);
            }
            return;
        }
        
        const cart = Utils.getCart();
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = parseInt(newQuantity);
            Utils.saveCart(cart);
            this.displayCart();
        }
    },

    removeFromCart(productId) {
        let cart = Utils.getCart();
        const initialLength = cart.length;
        
        cart = cart.filter(item => item.id !== productId);
        
        if (cart.length < initialLength) {
            Utils.saveCart(cart);
            this.displayCart();
            this.showNotification('Item removed from cart');
        }
    },

    updateCartTotals(subtotal) {
        const shipping = 20.00;
        const discount = 0.00;
        const finalTotal = subtotal - discount + shipping;

        const updateElementText = (selector, text) => {
            const el = Utils.safeQuerySelector(selector);
            if (el) el.textContent = text;
        };

        updateElementText('.subtotal-value', `${subtotal.toFixed(2)} EGP`);
        updateElementText('.discount-value', `-${discount.toFixed(2)} EGP`);
        updateElementText('.shipping-value', `${shipping.toFixed(2)} EGP`);
        updateElementText('.total-final-value', `${finalTotal.toFixed(2)} EGP`);
    },
    // ==========================================================
// ✅ دالة مخصصة لصفحة Checkout لعرض الملخص
// ==========================================================
renderCheckoutSummary() {
    const summaryContainer = Utils.safeQuerySelector('.order-summary-container');
    if (!summaryContainer) return;

    const cart = Utils.getCart();
    let subtotal = 0;

    // بناء HTML لعناصر السلة
    const cartItemsHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="summary-item">
                <img src="${item.image}" alt="${item.name}" class="summary-item-img" onerror="this.src='images/default-product.jpg'">
                <div class="summary-item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-qty">Qty: ${item.quantity}</span>
                </div>
                <span class="item-price">${itemTotal.toFixed(2)} EGP</span>
            </div>
        `;
    }).join('');

    // بناء هيكل ملخص الطلب بالكامل
    summaryContainer.innerHTML = `
        <h3 class="section-title summary-title"><i class="fas fa-receipt"></i> Order Summary</h3>
        <div class="summary-items-list">
            ${cartItemsHTML || '<p style="text-align: center; color: #999;">Your cart is empty.</p>'}
        </div>
        <div class="summary-totals">
            <div class="summary-line">
                <span>Subtotal:</span>
                <span class="subtotal-value">${subtotal.toFixed(2)} EGP</span>
            </div>
            <div class="summary-line">
                <span>Shipping:</span>
                <span class="shipping-value">20.00 EGP</span>
            </div>
            <div class="summary-line discount">
                <span>Discount:</span>
                <span class="discount-value">-0.00 EGP</span>
            </div>
            <hr>
            <div class="summary-line total-line">
                <strong>Order Total:</strong>
                <strong class="total-final-value">${(subtotal + 20.00).toFixed(2)} EGP</strong>
            </div>
        </div>
    `;

    // تحديث الإجماليات واستدعاء دالة تحديثها
    this.updateCartTotals(subtotal);
},

    // ================= للتوافق مع النسخة القديمة =================
    
    renderCartItemsOld() {
        const cart = Utils.getCart();
        const cartList = Utils.safeQuerySelector('.cart-items-list');
        
        if (!cartList) return;

        cartList.innerHTML = '';
        
        if (cart.length === 0) {
            cartList.innerHTML = '<div class="empty-cart-message">Your cart is empty. Start shopping now!</div>';
        } else {
            const itemsHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="item-img">
                    <div class="item-details">
                        <h2>${item.name}</h2>
                        <div class="item-actions">
                            <span class="quantity-control">
                                <button class="qty-btn" data-action="decrement" data-item-id="${item.id}">-</button>
                                <input type="number" value="${item.quantity}" min="1" class="qty-input" data-item-id="${item.id}" readonly>
                                <button class="qty-btn" data-action="increment" data-item-id="${item.id}">+</button>
                            </span>
                            <button class="remove-btn" data-item-id="${item.id}"><i class="fas fa-trash-alt"></i> Remove</button>
                        </div>
                    </div>
                    <div class="item-price item-subtotal" id="subtotal-${item.id}">
                        ${(item.price * item.quantity).toFixed(2)} EGP
                    </div> 
                </div>
            `).join('');
            
            cartList.innerHTML = itemsHTML;
        }

        const subtotalValue = cart.reduce((sub, item) => sub + (item.price * item.quantity), 0);
        this.updateCartTotals(subtotalValue);
        this.attachCartEventListenersOld();
    },

    attachCartEventListenersOld() {
        const cartList = Utils.safeQuerySelector('.cart-items-list');
        if (!cartList) return;

        // ✅ إزالة الأحداث القديمة أولاً
        const newList = cartList.cloneNode(true);
        cartList.parentNode.replaceChild(newList, cartList);
        
        const currentList = Utils.safeQuerySelector('.cart-items-list');
        
        currentList.addEventListener('click', (event) => {
            const target = event.target;
            
            if (target.closest('.qty-btn')) {
                const button = target.closest('.qty-btn');
                const action = button.dataset.action;
                const itemId = button.dataset.itemId;
                this.handleQuantityChangeOld(action, itemId);
            } else if (target.closest('.remove-btn')) {
                const button = target.closest('.remove-btn');
                const itemId = button.dataset.itemId;
                this.handleRemoveItemOld(itemId);
            }
        });
    },

    handleQuantityChangeOld(action, itemId) {
        let cart = Utils.getCart();
        const item = cart.find(i => i.id === itemId);

        if (item) {
            if (action === 'increment') {
                item.quantity += 1;
            } else if (action === 'decrement' && item.quantity > 1) {
                item.quantity -= 1;
            }
            Utils.saveCart(cart);
            this.renderCartItemsOld();
        }
    },

    handleRemoveItemOld(itemId) {
        let cart = Utils.getCart();
        const newCart = cart.filter(item => item.id !== itemId);
        Utils.saveCart(newCart);
        this.renderCartItemsOld();
    },

    clearCart() {
        if (confirm('Are you sure you want to clear the entire cart?')) {
            Utils.saveCart([]);
            this.displayCart();
            this.showNotification('Cart cleared successfully');
        }
    },

    getCartTotal() {
        const cart = Utils.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    getCartItemsCount() {
        const cart = Utils.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    }
};

// ================= POPUP MANAGER =================
const PopupManager = {
    init() {
        if (!window.location.pathname.includes("checkout.html")) return;

        const form = document.getElementById("checkoutForm");
        const modal = document.getElementById("confirmationModal");
        const continueBtn = document.getElementById("continueShoppingBtn");
        const cardDetails = document.getElementById("creditCardDetails");
        const codMessage = document.getElementById("cashOnDeliveryMessage");
        const paymentRadios = document.querySelectorAll('input[name="payment_method"]');

        if (!form || !modal || !continueBtn) return;

        // 🟢 تبديل طرق الدفع
        const updatePaymentDisplay = () => {
            const selected = document.querySelector('input[name="payment_method"]:checked').value;
            if (selected === "card") {
                cardDetails.style.display = "block";
                codMessage.style.display = "none";
            } else {
                cardDetails.style.display = "none";
                codMessage.style.display = "block";
            }
        };

        paymentRadios.forEach(radio => radio.addEventListener("change", updatePaymentDisplay));
        updatePaymentDisplay();

        // 🟢 فتح البوب عند Confirm Order
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            modal.style.display = "flex";
        });

        // 🟢 زر Continue Shopping
        continueBtn.addEventListener("click", () => {
            window.location.href = "index.html";
        });

        // 🟢 اغلاق البوب عند الضغط خارج المحتوى
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
};
// ================= AUTHENTICATION MANAGER =================
const AuthManager = {
    getAuthData() {
        try {
            const data = localStorage.getItem(CONFIG.userKey) || sessionStorage.getItem(CONFIG.userKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error parsing auth data:', e);
            return null;
        }
    },
    
    getToken() {
        const authData = this.getAuthData();
        return authData ? authData.token : null;
    },

    getUser() {
        const authData = this.getAuthData();
        return authData ? authData.user : null;
    },

    saveAuthData(token, user, rememberMe = false) {
        const dataToSave = { token, user };
        
        if (rememberMe) {
            localStorage.setItem(CONFIG.userKey, JSON.stringify(dataToSave));
            sessionStorage.removeItem(CONFIG.userKey);
        } else {
            sessionStorage.setItem(CONFIG.userKey, JSON.stringify(dataToSave));
            localStorage.removeItem(CONFIG.userKey);
        }
        this.updateAuthUI();
    },
    
    login(token, user, rememberMe = false) {
        this.saveAuthData(token, user, rememberMe);
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    },
    
    updateAuthUI() {
        const user = this.getUser();
        const token = this.getToken();
        const loginBtn = document.getElementById('login-btn');
        const userProfile = document.querySelector('.user-profile');
        
        const isLoggedIn = user && token;
        
        if (isLoggedIn) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (userProfile) userProfile.style.display = 'flex';
        } else {
            if (loginBtn) loginBtn.style.display = 'flex';
            if (userProfile) userProfile.style.display = 'none';
        }
    },

    logout() {
        localStorage.removeItem(CONFIG.userKey);
        sessionStorage.removeItem(CONFIG.userKey);
        
        this.updateAuthUI();
        
        setTimeout(() => {
            window.location.href = 'register.html';
        }, 500);
    },

    isLoggedIn() {
        return !!this.getToken();
    }
};

// ================= PRODUCT MANAGER =================
const ProductManager = {
    async fetchProductsByDisease(disease) {
        try {
            const url = `${CONFIG.API_BASE_URL}/products?disease=${encodeURIComponent(disease)}`;
            console.log('Fetching products from:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch products. Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            if (data.success && Array.isArray(data.data)) {
                return data.data;
            } else if (Array.isArray(data)) {
                return data;
            }
            
            return [];
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    },

    async fetchProductDetails(productId) {
        try {
            console.log(`🔍 Fetching product details for ID: ${productId}`);
            
            const url = `${CONFIG.API_BASE_URL}/products/${productId}`;
            console.log('Fetching product from:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch product details. Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response for product details:', data);
            
            if (data.success && data.data) {
                return data.data;
            } else if (data.product) {
                return data.product;
            } else if (data) {
                return data;
            }
            
            return null;
        } catch (error) {
            console.error("Error fetching product details:", error);
            return null;
        }
    }
};
// ================= SEARCH & DISPLAY MANAGER =================
const SearchManager = {
    allProducts: [],
async initProductDisplay() {
        console.log("🔍 SearchManager.initProductDisplay() called!");
        
        const urlParams = new URLSearchParams(window.location.search);
        let disease = urlParams.get('disease');
        
        if (!disease) {
            disease = urlParams.get('query');
            console.log("⚠️ Using query parameter as disease:", disease);
            
            if (disease) {
                const newUrl = `${window.location.pathname}?disease=${encodeURIComponent(disease)}`;
                window.history.replaceState({}, '', newUrl);
                console.log("🔄 Updated URL to:", window.location.href);
            }
        }
        
        console.log("📝 URL Params:", window.location.search);
        console.log("🎯 Final disease to search:", disease);
        
        if (!disease) {
            console.log("❌ No disease or query parameter found");
            this.showNoProducts();
            return;
        }
        
        const diseaseTitle = document.getElementById('disease-title');
        if (diseaseTitle) {
            diseaseTitle.textContent = `Products for ${disease}`;
            console.log("✅ Updated disease title");
        }
        
        console.log("🌐 Fetching products for disease:", disease);
        this.allProducts = await ProductManager.fetchProductsByDisease(disease);
        
        console.log("📦 Products received:", this.allProducts.length, "items");
        
        const container = document.getElementById('products-container');
        if (container) {
            console.log("✅ Found products container");
            this.displayProducts(this.allProducts, container);
        } else {
            console.error("❌ products-container NOT found!");
        }
        
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = `Showing ${this.allProducts.length} products`;
        }
        
        // 🏆 الآن بعد التأكد من أن bindEvents موجودة في هذا الكائن، سيتم استدعاؤها
        this.bindEvents(); 
        
        this.setupCategoryTabs();
        this.setupModalListeners();
        
        console.log("✅ initProductDisplay completed!");
    },
    
    displayProducts(products, containerElement) {
        console.log("🎨 Displaying products...");
        containerElement.innerHTML = '';
        
        if (products && Array.isArray(products) && products.length > 0) {
            console.log(`🖼️ Rendering ${products.length} products`);
            products.forEach((product, index) => {
                const itemId = product._id || product.id;
                const itemName = product.name;
                const itemPrice = product.price;
                const itemImage = product.image;
                const itemDescription = product.description;
                const itemCategory = product.category;
                
                const card = document.createElement('div');
                card.className = `product-card ${itemCategory}`;
                
                card.innerHTML = `
                    <div class="product-badge">${index % 3 === 0 ? '25% OFF' : index % 3 === 1 ? 'BEST SELLER' : 'NEW'}</div>
                    <div class="product-img">
                        <img src="${itemImage || 'images/default.jpg'}" alt="${itemName}" 
                             onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                    </div>
                    
                    <div class="product-info">
                        <div class="product-category">${itemCategory === 'herbs' ? 'Herbal Supplement' : 'Fruit Extract'}</div>
                        <h3 class="product-name">${itemName}</h3>
                        <p class="product-description">${itemDescription || 'No description available'}</p>
                        
                        <div class="product-rating">
                            <div class="stars">${'★'.repeat(5)}</div>
                            <div class="rating-count">4.8 (125)</div>
                        </div>
                        
                        <div class="product-price">
                            <div class="price">
                                ${itemPrice}
                                ${index % 3 === 0 ? `<span class="old-price">${(parseFloat(itemPrice.replace(/[^0-9.]/g, '')) * 1.33).toFixed(2)} EGP</span>` : ''}
                                ${index % 3 === 0 ? `<span class="discount">25% OFF</span>` : ''}
                            </div>
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn-view view-details" data-index="${index}">
                                View Details
                            </button>
                            <button class="btn-cart add-to-cart-btn" data-index="${index}">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                `;
                containerElement.appendChild(card);
            });
            
            // 💡 ملاحظة: استدعي bindEvents لربط الأزرار المضافة
            this.bindEvents();
        } else {
            console.log("📭 No products to display");
            this.showNoProducts();
        }
    },
    
    // 🏆 الدالة التي كانت مفقودة/غير واضحة
    bindEvents() {
        console.log("🔗 Binding events in SearchManager...");
        
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const index = parseInt(button.dataset.index);
                const product = this.allProducts[index];
                
                if (product) {
                    console.log("🖱️ View Details clicked for:", product.name);
                    this.openProductModal(product);
                } else {
                    console.error("❌ Product not found at index:", index);
                }
            });
        });
        
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const index = parseInt(button.dataset.index);
                const product = this.allProducts[index];
                
                if (product) {
                    // 🚨 هنا يتم استدعاء CartManager.addToCart المُحدّث
                    console.log("🛒 Add to Cart clicked for:", product.name);
                    CartManager.addToCart(product);
                }
            });
        });
        
        console.log("✅ Events bound successfully");
    },
    setupCategoryTabs() {
        console.log("🏷️ Setting up category tabs...");
        const tabs = document.querySelectorAll('.category-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const category = tab.dataset.category;
                console.log("🔍 Filtering by category:", category);
                this.filterByCategory(category);
            });
        });
    },
    
    filterByCategory(category) {
        console.log("🎯 Filtering products by category:", category);
        const container = document.getElementById('products-container');
        if (!container) {
            console.error("❌ Container not found!");
            return;
        }
        
        const allCards = container.querySelectorAll('.product-card');
        console.log("📊 Total cards found:", allCards.length);
        
        if (category === 'all') {
            allCards.forEach(card => {
                card.style.display = 'block';
            });
            console.log("✅ Showing all products");
        } else {
            let visibleCount = 0;
            allCards.forEach(card => {
                if (card.classList.contains(category)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            console.log(`✅ Showing ${visibleCount} ${category} products`);
        }
    },
    
    setupModalListeners() {
        console.log("🪟 Setting up modal listeners...");
        const modal = document.getElementById('productModal');
        const closeBtn = document.querySelector('.close-modal');
        
        if (modal && closeBtn) {
            closeBtn.onclick = () => {
                console.log("❌ Modal closed");
                modal.style.display = 'none';
            };
            
            window.onclick = (e) => {
                if (e.target === modal) {
                    console.log("❌ Modal closed (clicked outside)");
                    modal.style.display = 'none';
                }
            };
            
            console.log("✅ Modal listeners set up");
        } else {
            console.error("❌ Modal or close button not found!");
        }
    },
    
    openProductModal(product) {
        console.log("🪟 Opening product modal...");
        
        const modal = document.getElementById('productModal');
        if (!modal) {
            console.error("❌ Modal not found!");
            return;
        }
        
        document.getElementById('modalProductName').textContent = product.name || 'Product';
        document.getElementById('modalProductCategory').textContent = product.category || 'Herbal Product';
        document.getElementById('modalProductDescription').textContent = product.description || 'No description available';
        document.getElementById('modalProductBenefits').textContent = product.benefits || product.features || 'No benefits information';
        document.getElementById('modalProductUsage').textContent = product.usage || product.how_to_use || 'No usage instructions';
        document.getElementById('modalProductPrice').textContent = `${product.price || 'N/A'} `;
        
        const reviewsHTML = `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-name">Ahmed M.</div>
                    <div class="review-stars">★★★★★</div>
                </div>
                <p class="review-text">"Excellent product! Really helped regulate my ${product.disease?.toLowerCase() || 'condition'} naturally."</p>
                <div class="review-date">2 weeks ago</div>
            </div>
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-name">Fatma S.</div>
                    <div class="review-stars">★★★★☆</div>
                </div>
                <p class="review-text">"Good quality and effective. Noticed improvement within 2 weeks of regular use."</p>
                <div class="review-date">1 month ago</div>
            </div>
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-name">Mohamed R.</div>
                    <div class="review-stars">★★★★★</div>
                </div>
                <p class="review-text">"Authentic and pure. Much better than other brands I have tried."</p>
                <div class="review-date">3 months ago</div>
            </div>
        `;
        
        document.getElementById('modalProductReviews').innerHTML = reviewsHTML;

        const productImage = document.getElementById('modalProductImage');
        if (productImage) {
            productImage.src = product.image || 'https://via.placeholder.com/300x200?text=No+Image';
            productImage.alt = product.name || 'Product';
        }
        
        modal.style.display = 'flex';
        
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
            };
        }
        
        const addToCartBtn = document.getElementById('modalAddToCart');
        if (addToCartBtn) {
            addToCartBtn.onclick = () => {
                CartManager.addToCart({
                    id: product._id || product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                modal.style.display = 'none';
                alert(`${product.name} added to cart!`);
            };
        }
        
        window.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    },
    
    async fetchAndDisplayProductDetails(productId, modal) {
        try {
            console.log(`🔍 Fetching full details for product: ${productId}`);
            
            const productDetails = await ProductManager.fetchProductDetails(productId);
            
            if (!productDetails) {
                throw new Error("Failed to load product details");
            }
            
            console.log("✅ Product details loaded:", productDetails);
            this.displayProductInModal(productDetails, modal);
            
        } catch (error) {
            console.error("❌ Error loading product details:", error);
            
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="error-modal">
                        <i class="fas fa-exclamation-triangle fa-3x"></i>
                        <h3>Unable to load full details</h3>
                        <p>Showing basic information...</p>
                    </div>
                </div>
            `;
            
            const closeBtn = modal.querySelector('.close-modal');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    modal.style.display = 'none';
                };
            }
        }
    },

    displayProductInModal(product, modal) {
        if (!modal) return;
        
        const modalHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                
                <div class="modal-product-details">
                    <div class="modal-product-image">
                        <img src="${product.image || 'https://via.placeholder.com/400x300?text=No+Image'}" 
                             alt="${product.name || 'Product'}"
                             onerror="this.src='https://via.placeholder.com/400x300?text=Image+Error'">
                    </div>
                    
                    <div class="modal-product-info">
                        <div class="modal-header">
                            <span class="product-category">${product.category || 'Product'}</span>
                            <h2>${product.name || 'Unnamed Product'}</h2>
                            ${product.disease ? `<div class="product-disease">For: ${product.disease}</div>` : ''}
                        </div>
                        
                        <div class="modal-price">
                            <span class="price">${product.price || 'N/A'} EGP</span>
                            ${product.originalPrice ? `<span class="original-price">${product.originalPrice} EGP</span>` : ''}
                        </div>
                        
                        <div class="modal-section">
                            <h3><i class="fas fa-info-circle"></i> Description</h3>
                            <p>${product.description || product.about || 'No description available'}</p>
                        </div>
                        
                        ${(product.benefits || product.features) ? `
                        <div class="modal-section">
                            <h3><i class="fas fa-heart"></i> Benefits</h3>
                            <ul class="benefits-list">
                                ${Array.isArray(product.benefits || product.features) 
                                    ? (product.benefits || product.features).map(benefit => `<li>${benefit}</li>`).join('')
                                    : `<li>${product.benefits || product.features}</li>`
                                }
                            </ul>
                        </div>
                        ` : ''}
                        
                        ${product.usage || product.how_to_use ? `
                        <div class="modal-section">
                            <h3><i class="fas fa-book"></i> How to Use</h3>
                            <p>${product.usage || product.how_to_use}</p>
                        </div>
                        ` : ''}
                        
                        ${product.ingredients ? `
                        <div class="modal-section">
                            <h3><i class="fas fa-flask"></i> Ingredients</h3>
                            <p>${product.ingredients}</p>
                        </div>
                        ` : ''}
                        
                        <div class="modal-actions">
                            <button class="btn-wishlist" id="modalWishlistBtn">
                                <i class="far fa-heart"></i> Add to Wishlist
                            </button>
                            <button class="btn-add-to-cart" id="modalAddToCartBtn">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.innerHTML = modalHTML;
        this.bindModalEvents(product, modal);
    },

    bindModalEvents(product, modal) {
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
            };
        }
        
        const addToCartBtn = modal.querySelector('#modalAddToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.onclick = () => {
                CartManager.addToCart({
                    id: product._id || product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                modal.style.display = 'none';
                alert(`${product.name} added to cart!`);
            };
        }
        
        const wishlistBtn = modal.querySelector('#modalWishlistBtn');
        if (wishlistBtn) {
            wishlistBtn.onclick = () => {
                alert(`${product.name} added to wishlist!`);
            };
        }
        
        window.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    },
    
    showNoProducts() {
        console.log("📭 Showing 'no products' message");
        const container = document.getElementById('products-container');
        if (container) {
            container.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-leaf fa-3x"></i>
                    <h3>No products found</h3>
                    <p>Try selecting a different health condition</p>
                    <a href="index.html" class="btn">Back to Home</a>
                </div>
            `;
        }
    },
};
// ================= HOME PAGE MANAGER =================
const HomePageManager = {
    init() {
        if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') return;

        this.initSearchSuggestions();
        this.initRecommendations();
        this.initSearchFunctionality();
    },

    initSearchSuggestions() {
        const herbSuggestions = [
           "Diabetes management herbs",
           "Blood pressure control", 
           "Digestive health supplements",
           "Stress relief teas",
            "Immune boosting fruits",
            "Anti-inflammatory herbs",
            "Sleep aid supplements",
            "Weight management products",
             "Skin care herbs",
            "Respiratory health"
        ];

        const hospitalSuggestions = [
            "El-Salam Medical Center",
            "The Health Bridge Hospital",
            "Al-Noor Herbal Clinic",
            "Cardiology hospitals in Cairo",
            "Oncology centers Egypt",
            "Neurology specialists",
            "Orthopedics hospitals",
            "Pediatrics clinics",
            "Dermatology centers",
            "Gastroenterology hospitals",
            "Endocrinology specialists",
            "Ophthalmology centers",
            "Emergency hospitals"
        ];

        this.initSuggestionBox('herb-search', 'herb-suggestions', herbSuggestions);
        this.initSuggestionBox('hospital-search', 'hospital-suggestions', hospitalSuggestions);
    },

    initSuggestionBox(inputId, suggestionsId, suggestions) {
        const input = document.getElementById(inputId);
        const suggestionsEl = document.getElementById(suggestionsId);

        if (!input || !suggestionsEl) return;

        input.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            suggestionsEl.innerHTML = '';

            if (value.length > 0) {
                const filtered = suggestions.filter(s => s.toLowerCase().includes(value));
                if (filtered.length > 0) {
                    suggestionsEl.classList.add('active');
                    filtered.forEach(s => {
                        const div = document.createElement('div');
                        div.textContent = s;
                        div.addEventListener('click', () => {
                            input.value = s;
                            suggestionsEl.classList.remove('active');
                        });
                        suggestionsEl.appendChild(div);
                    });
                } else {
                    suggestionsEl.classList.remove('active');
                }
            } else {
                suggestionsEl.classList.remove('active');
            }
        });
    },

    initRecommendations() {
        const getRecommendationsBtn = document.getElementById('get-recommendations');
        if (!getRecommendationsBtn) return;

        getRecommendationsBtn.addEventListener('click', () => this.handleDynamicRecommendations());
    },
    
    async handleDynamicRecommendations() {
        const healthConcern = document.getElementById('health-concern').value;
        const productTypes = Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(cb => cb.value);
        const budget = document.getElementById('budget').value;

        if (!healthConcern) {
            alert('Please select a health concern');
            return;
        }

        const button = document.getElementById('get-recommendations');
        const originalText = button.textContent;
        button.textContent = 'Finding Recommendations...';
        button.disabled = true;

        try {
            const recommendations = await RecommendationManager.getRecommendationsForTool(
                healthConcern, 
                productTypes, 
                budget
            );

            if (recommendations.length > 0) {
                this.displayRecommendations(recommendations, healthConcern);
            } else {
                alert('Could not find products matching your criteria. Try changing filters.');
            }
        } catch (err) {
            console.error(err);
            alert('Error fetching recommendations. Please try again.');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    },
    
    displayRecommendations(recommendations, healthConcern) {
        const resultsContainer = document.getElementById('recommendation-results');
        const resultsGrid = document.getElementById('results-grid');
        
        if (!resultsContainer || !resultsGrid) {
            console.error("❌ Missing container or grid element");
            return;
        }

        resultsGrid.innerHTML = '';
        
        if (recommendations.length === 0) {
            resultsGrid.innerHTML = `
                <div class="no-recommendations" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-leaf fa-3x" style="color: #ccc; margin-bottom: 20px;"></i>
                    <h4>No products found</h4>
                    <p>Try adjusting your filters or select a different health concern.</p>
                </div>
            `;
        } else {
            recommendations.forEach((rec, index) => {
                const item = document.createElement('div');
                item.className = 'result-item';
                item.innerHTML = `
                    <h4>${rec.name}</h4>
                    <p>${rec.description}</p>
                    <ul class="result-features">
                        ${rec.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                    <div class="result-price">${rec.price}</div>
                    <div class="result-actions">
                        <button class="btn add-to-cart-btn" data-index="${index}">
                            Add to Cart
                        </button>
                        <button class="btn view-details-btn" data-index="${index}">
                            View Details
                        </button>
                    </div>
                `;
                resultsGrid.appendChild(item);
            });

            resultsGrid.querySelectorAll('.add-to-cart-btn').forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    const rec = recommendations[index];
                    
                    if (rec.originalProduct) {
                        CartManager.addToCart({
                            id: rec.originalProduct._id || rec.originalProduct.id,
                            name: rec.originalProduct.name,
                            price: rec.originalProduct.price,
                            image: rec.originalProduct.image || 'images/default-product.jpg',
                            quantity: 1
                        });
                    } else {
                        CartManager.addToCart({
                            id: `rec_${Date.now()}_${index}`,
                            name: rec.name,
                            price: rec.price,
                            image: 'images/default-product.jpg',
                            quantity: 1
                        });
                    }
                });
            });

            resultsGrid.querySelectorAll('.view-details-btn').forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    const rec = recommendations[index];
                    
                    if (rec.originalProduct && SearchManager.openProductModal) {
                        SearchManager.openProductModal(rec.originalProduct);
                    } else {
                        alert(`Product: ${rec.name}\nPrice: ${rec.price}\nDescription: ${rec.description}`);
                    }
                });
            });
        }

        resultsContainer.classList.add('active');
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    initSearchFunctionality() {
        this.initHerbSearch();
        this.initHospitalSearch();
        this.initSuggestionTags();
    },

    initHerbSearch() {
        const herbSearch = document.getElementById('herb-search');
        const herbSearchBtn = document.querySelector('#herb-search + button');

        const searchHandler = async () => {
            const query = herbSearch.value.trim();
            if (!query) return;

            try {
                const res = await fetch(`/api/herbs/search?query=${encodeURIComponent(query)}`);
                const data = await res.json();

                if (data.success && data.results.length > 0) {
                    window.location.href = `search-results.html?disease=${encodeURIComponent(query)}`;
                } else {
                    alert('No results found for your search.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred while searching. Please try again.');
            }
        };

        herbSearch.addEventListener('keypress', e => { if (e.key === 'Enter') searchHandler(); });
        if (herbSearchBtn) herbSearchBtn.addEventListener('click', searchHandler);
    },

    initHospitalSearch() {
        const hospitalSearch = document.getElementById('hospital-search');
        const hospitalSearchBtn = document.querySelector('#hospital-search + button');

        const searchHandler = async () => {
            const query = hospitalSearch.value.trim();
            if (!query) return;

            try {
                const res = await fetch(`/api/hospitals/search?query=${encodeURIComponent(query)}`);
                const data = await res.json();

                if (data.success && data.results.length > 0) {
                    window.location.href = `hospital.html?query=${encodeURIComponent(query)}`;
                } else {
                    alert('No hospitals found for your search.');
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred while searching. Please try again.');
            }
        };

        hospitalSearch.addEventListener('keypress', e => { if (e.key === 'Enter') searchHandler(); });
        if (hospitalSearchBtn) hospitalSearchBtn.addEventListener('click', searchHandler);
    },

   initSuggestionTags() {
    document.querySelectorAll('.suggestion-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const text = this.textContent.trim();
            let url = '';

            if (['Diabetes', 'High Blood Pressure', 'Digestive Issues'].includes(text)) {
                url = `search-results.html?disease=${encodeURIComponent(text)}`;
            } else {
                url = `hospital.html?query=${encodeURIComponent(text)}`;
            }

            window.location.href = url;
        });
    });
}
};
// ================= LOGIN PAGE MANAGER =================
const LoginManager = {
    init() {
        if (AuthManager.isLoggedIn()) {
            window.location.href = 'index.html';
            return;
        }

        this.initPasswordToggle();
        this.initFormSubmission();
        this.initSocialLogin();
    },

    initPasswordToggle() {
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', function (e) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
                this.classList.toggle('fa-eye');
            });
        }
    },

    initFormSubmission() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    },

   async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember') ? document.getElementById('remember').checked : false;

        if (!this.validateForm(email, password)) return;

        this.setLoadingState(true);

        try {
            const result = await this.loginRequest(email, password);

            // تأكد أن الـ API يرجع success: true وبيانات داخل data
            if (result.success || result.token) { 
                this.showSuccessMessage('Login successful! Redirecting...');

                // استخراج الـ user والـ token من نتيجة الـ API
                const userData = result.data?.user || result.user || {};
                const token = result.data?.token || result.token;

                // معالجة الاسم للتأكد أنه لن يكون undefined
                userData.name = userData.name || userData.fullName || userData.firstName || 'User';

                // استدعاء AuthManager بشكل صحيح
                AuthManager.login(token, userData, rememberMe);

            } else {
                this.showError(result.message || 'Invalid email or password.');
            }

        } catch (error) {
            console.error('Login error:', error);
            this.showError('Login failed: ' + error.message);
        } finally {
            this.setLoadingState(false);
        }
    },

    validateForm(email, password) {
        this.clearErrors();

        let isValid = true;

        if (!email) {
            this.showFieldError('email', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!password) {
            this.showFieldError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            this.showFieldError('password', 'Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    showFieldError(fieldId, message) {
        const inputGroup = document.getElementById(fieldId)?.closest('.input-group');
        if (!inputGroup) return;
        
        inputGroup.classList.add('error');
        
        let errorElement = inputGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            inputGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    },

    showError(message) {
        this.showFieldError('email', message);
        
        const form = document.querySelector('.login-form');
        if (form) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-error';
            errorDiv.style.cssText = `
                background-color: #f8d7da;
                color: #721c24;
                padding: 12px 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                text-align: center;
                border: 1px solid #f5c6cb;
            `;
            errorDiv.textContent = message;
            form.insertBefore(errorDiv, form.firstChild);
            
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    },

    showSuccessMessage(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        successElement.style.cssText = `
            background-color: #d4edda;
            color: #155724;
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            border: 1px solid #c3e6cb;
        `;
        
        const form = document.querySelector('.login-form');
        if (form) {
            form.insertBefore(successElement, form.firstChild);
        }
    },

    clearErrors() {
        document.querySelectorAll('.input-group').forEach(group => {
            group.classList.remove('error');
            const errorElement = group.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
        
        document.querySelectorAll('.alert-error').forEach(el => el.remove());
    },

    async loginRequest(email, password) {
        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ 
                email: email.trim(),
                password: password 
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        return data;
    },

    setLoadingState(isLoading) {
        const submitButton = document.querySelector('.sign-in-button');
        if (!submitButton) return;

        if (isLoading) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            submitButton.textContent = 'Signing in...';
            
            const spinner = document.createElement('i');
            spinner.className = 'fas fa-spinner fa-spin';
            spinner.style.marginLeft = '8px';
            submitButton.appendChild(spinner);
        } else {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.textContent = 'Sign in';
            
            const spinner = submitButton.querySelector('.fa-spinner');
            if (spinner) spinner.remove();
        }
    },

    initSocialLogin() {
        document.querySelectorAll('.social-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = button.classList.contains('google') ? 'Google' : 'Apple';
                this.handleSocialLogin(provider);
            });
        });
    },

    handleSocialLogin(provider) {
        alert(`Connecting to ${provider}...\n\nNote: This is a demo. In a real application, this would connect to ${provider} OAuth.`);
        
        setTimeout(() => {
            this.showSuccessMessage(`${provider} login successful! Redirecting...`);
            
            const demoUser = {
                _id: 'demo_id',
                firstName: 'Demo',
                lastName: 'User',
                name: 'Demo User', 
                email: `user@${provider.toLowerCase()}.com`,
                role: 'user'
            };
            
            AuthManager.login(`demo_token_${provider}`, demoUser, true);
        }, 2000);
    }
};

// ================= REGISTER PAGE MANAGER =================
const RegisterManager = {
    init() {
        if (AuthManager.isLoggedIn()) {
            window.location.href = 'index.html';
            return;
        }

        this.initPasswordToggle();
        this.initFormSubmission();
        this.initSocialRegister();
    },

    initPasswordToggle() {
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', function (e) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
                this.classList.toggle('fa-eye');
            });
        }

        if (toggleConfirmPassword && confirmPasswordInput) {
            toggleConfirmPassword.addEventListener('click', function (e) {
                const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPasswordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
                this.classList.toggle('fa-eye');
            });
        }
    },

    initFormSubmission() {
        const registerForm = document.getElementById('registerForm');
        if (!registerForm) return;

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    },

    async handleRegister() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms') ? document.getElementById('agreeTerms').checked : false;

        if (!this.validateForm(firstName, lastName, email, password, confirmPassword, agreeTerms)) {
            return;
        }

        this.setLoadingState(true);

        try {
            const result = await this.registerRequest(firstName, lastName, email, password);
            
            if (result && result.success) {
                this.showSuccessMessage('Account created successfully! Welcome to Herbal Health 🎉');
                
                if (result.data && result.data.token && result.data.user) {
                    const user = result.data.user;
                    user.name =
    user.name ||
    user.fullName ||
    user.username ||
    `${firstName} ${lastName}`;
                    AuthManager.login(
                        result.data.token,
                        user,
                        true
                    );
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                } else {
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                }
                
            } else {
                this.showError(result.message || 'Registration failed. Email might already be registered.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showError('Registration failed. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    },

    validateForm(firstName, lastName, email, password, confirmPassword, agreeTerms) {
        this.clearErrors();

        let isValid = true;

        if (!firstName) {
            this.showFieldError('firstName', 'First name is required');
            isValid = false;
        } else if (firstName.length < 2) {
            this.showFieldError('firstName', 'First name must be at least 2 characters');
            isValid = false;
        }

        if (!lastName) {
            this.showFieldError('lastName', 'Last name is required');
            isValid = false;
        } else if (lastName.length < 2) {
            this.showFieldError('lastName', 'Last name must be at least 2 characters');
            isValid = false;
        }

        if (!email) {
            this.showFieldError('email', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!password) {
            this.showFieldError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            this.showFieldError('password', 'Password must be at least 6 characters');
            isValid = false;
        } else if (!this.isStrongPassword(password)) {
            this.showFieldError('password', 'Password must include uppercase, lowercase, and numbers');
            isValid = false;
        }

        if (!confirmPassword) {
            this.showFieldError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }

        if (!agreeTerms) {
            this.showTermsError('You must agree to the terms and conditions');
            isValid = false;
        }

        return isValid;
    },

    isStrongPassword(password) {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        return strongRegex.test(password);
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    showFieldError(fieldId, message) {
        const inputGroup = document.getElementById(fieldId)?.closest('.input-group');
        if (!inputGroup) return;
        
        inputGroup.classList.add('error');
        
        let errorElement = inputGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            inputGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    },

    showTermsError(message) {
        const termsCheckbox = document.getElementById('agreeTerms');
        if (!termsCheckbox) return;
        
        const termsLabel = termsCheckbox.closest('.terms-checkbox');
        if (!termsLabel) return;
        
        let errorElement = termsLabel.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            termsLabel.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    },

    showError(message) {
        const form = document.querySelector('.register-form');
        if (form) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-error';
            errorDiv.style.cssText = `
                background-color: #f8d7da;
                color: #721c24;
                padding: 12px 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                text-align: center;
                border: 1px solid #f5c6cb;
            `;
            errorDiv.textContent = message;
            form.insertBefore(errorDiv, form.querySelector('h2').nextSibling);
            
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    },

    showSuccessMessage(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-check-circle" style="color: #28a745; font-size: 3em; margin-bottom: 15px;"></i>
                <h3 style="margin: 10px 0; color: #155724;">Success!</h3>
                <p style="font-size: 16px; color: #155724;">${message}</p>
                <p style="color: #666; font-size: 14px; margin-top: 10px;">
                    <i class="fas fa-spinner fa-spin"></i> Redirecting...
                </p>
            </div>
        `;
        
        const form = document.querySelector('.register-form');
        if (form) {
            form.style.display = 'none';
            
            const formContainer = form.parentElement;
            if (formContainer) {
                formContainer.appendChild(successElement);
            }
        }
    },

    clearErrors() {
        document.querySelectorAll('.input-group').forEach(group => {
            group.classList.remove('error');
            const errorElement = group.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });

        const termsLabel = document.querySelector('.terms-checkbox');
        if (termsLabel) {
            const errorElement = termsLabel.querySelector('.error-message');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
        
        document.querySelectorAll('.alert-error').forEach(el => el.remove());
    },

    async registerRequest(firstName, lastName, email, password) {
        const response = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }
        
        return data;
    },

    setLoadingState(isLoading) {
        const submitButton = document.querySelector('.sign-up-button');
        if (!submitButton) return;

        if (isLoading) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            submitButton.textContent = 'Creating Account...';
            
            const spinner = document.createElement('i');
            spinner.className = 'fas fa-spinner fa-spin';
            spinner.style.marginLeft = '8px';
            submitButton.appendChild(spinner);
        } else {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.textContent = 'Create Account';
            
            const spinner = submitButton.querySelector('.fa-spinner');
            if (spinner) spinner.remove();
        }
    },

    initSocialRegister() {
        document.querySelectorAll('.social-button-icon').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = button.classList.contains('google') ? 'Google' : 
                               button.classList.contains('facebook') ? 'Facebook' : 'Apple';
                this.handleSocialRegister(provider);
            });
        });
    },

    handleSocialRegister(provider) {
        alert(`Connecting to ${provider}...\n\nNote: This is a demo. In a real application, this would connect to ${provider} OAuth.`);
        
        setTimeout(() => {
            this.showSuccessMessage(`${provider} registration successful! Redirecting...`);
            
            const demoUser = {
                _id: 'demo_social_id',
                firstName: 'Social',
                lastName: 'User',
                name: 'Social User',
                email: `social@${provider.toLowerCase()}.com`,
                role: 'user'
            };
            
            AuthManager.login(`demo_social_token_${provider}`, demoUser, true);
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }, 2000);
    }
};
// ================= USER PROFILE PAGE =================
const UserProfileManager = {
    // console.log('USER FROM AUTH:', AuthManager.getUser());

    init() {
        // حماية الصفحة
        if (!AuthManager.isLoggedIn()) {
            window.location.href = 'login.html';
            return;
        }

        const user = AuthManager.getUser();
        if (!user) return;

        this.fillUserData(user);
        this.initLogout();
        this.initEditProfileModal(user);
    },

    fillUserData(user) {
    // 🧠 اسم اليوزر بذكاء
    const displayName =
        user.name ||
        user.fullName ||
        user.username ||
        (user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.firstName) ||
        'User';

    // أعلى الصفحة
    this.setText('pageUserName', `Welcome, ${displayName}`);
    this.setText('pageUserEmail', user.email || 'Not set');
    this.setText('pageUserRole', user.role || 'Customer');

    // Personal info
    this.setText('infoName', displayName);
    this.setText('infoEmail', user.email || 'Not set');
    this.setText('infoPhone', user.phone || 'Not set');
    this.setText('infoAddress', user.address || 'Not set');

    // Modal inputs
    this.setValue('modalNameInput', displayName);
    this.setValue('modalEmailInput', user.email || '');
    this.setValue('modalPhoneInput', user.phone || '');
    this.setValue('modalAddressInput', user.address || '');
},


    setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    },

    setValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value;
    },

    initLogout() {
        const logoutBtn = document.querySelector('.user-logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    AuthManager.logout();
                }
            });
        }
    },

    initEditProfileModal(user) {
        const openBtn = document.getElementById('openProfileModalBtn');
        const modal = document.getElementById('profileModal');
        const closeBtn = document.getElementById('profileModalClose');
        const cancelBtn = document.getElementById('cancelProfileBtn');
        const saveBtn = document.getElementById('saveProfileBtn');
        const successMsg = document.getElementById('profileSuccessMessage');

        if (!openBtn || !modal) return;

        openBtn.onclick = () => modal.style.display = 'flex';
        closeBtn.onclick = cancelBtn.onclick = () => modal.style.display = 'none';

        saveBtn.onclick = () => {
            // تحديث البيانات محلياً (Frontend فقط)
            user.name = document.getElementById('modalNameInput').value;
            user.email = document.getElementById('modalEmailInput').value;
            user.phone = document.getElementById('modalPhoneInput').value;
            user.address = document.getElementById('modalAddressInput').value;

            const token = AuthManager.getToken();
            AuthManager.saveAuthData(token, user, true);

            this.fillUserData(user);

            successMsg.style.display = 'block';
            setTimeout(() => {
                successMsg.style.display = 'none';
                modal.style.display = 'none';
            }, 1500);
        };
    }
};
// ================= AUTO-FIX URL PARAMETERS =================
function fixURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const disease = urlParams.get('disease');
    
    if (query && !disease && window.location.pathname.includes('search-results.html')) {
        console.log("🔄 Auto-fixing URL parameters...");
        const newUrl = `${window.location.pathname}?disease=${encodeURIComponent(query)}`;
        window.history.replaceState({}, '', newUrl);
        console.log("✅ URL fixed to:", window.location.href);
        return true;
    }
    return false;
}
// ================= COMMON EVENT HANDLERS =================
const EventHandlers = {
    init() {
        this.initStickyHeader();
        this.initGlobalEventListeners();
    },

    initStickyHeader() {
        Utils.addSafeEventListener(window, 'scroll', () => {
            const header = Utils.safeQuerySelector('header');
            if (!header) return;

            if (window.scrollY > CONFIG.stickyHeaderOffset) {
                header.style.padding = '5px 0';
                header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.padding = '15px 0';
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }
        });
    },

    initGlobalEventListeners() {
        Utils.addSafeEventListener(document, 'click', (e) => {
            if (!e.target.closest('.search-form')) {
                const suggestionBoxes = document.querySelectorAll('.suggestions');
                suggestionBoxes.forEach(box => box.classList.remove('active'));
            }
        });
    }
};
// ================= MASTER EXECUTION SCRIPT =================
document.addEventListener("DOMContentLoaded", async () => {
    fixURLParameters();

    // 1️⃣ تشغيل الهيدر والفوتر (مرة واحدة فقط)
    if (typeof HeaderFooterManager !== 'undefined') {
        await HeaderFooterManager.init();
    } else {
        console.error("HeaderFooterManager is not defined!");
        return;
    }

    const path = window.location.pathname;

    // ================== HELPERS ==================
    const setupModalListeners = (openBtnId, modalId, closeBtnIds) => {
        const openBtn = document.getElementById(openBtnId);
        const modal = document.getElementById(modalId);

        if (!openBtn || !modal) return;

        openBtn.onclick = () => modal.style.display = 'flex';

        closeBtnIds.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.onclick = () => modal.style.display = 'none';
        });

        window.addEventListener('click', e => {
            if (e.target === modal) modal.style.display = 'none';
        });
    };
// ================= CHECKOUT MANAGER =================
const CheckoutManager = {
    // 🏆 دالة جلب السلة وعرضها في صفحة Checkout
    async init() {
        if (!AuthManager.isLoggedIn()) {
            alert('Please log in to proceed to checkout.');
            window.location.href = 'login.html';
            return;
        }

        const cart = await CartManager.getCartFromBackend(); 

        if (cart.length === 0) {
            alert('Your cart is empty. Cannot proceed to checkout.');
            window.location.href = 'shopping_cart.html';
            return;
        }
        
        this.fillUserInfo();
        this.displayOrderSummary(cart);
        this.bindPaymentToggle();
        this.bindFormSubmit();
    },

    // 🏆 تعبئة معلومات المستخدم المسجل دخوله
    fillUserInfo() {
        const user = AuthManager.getUser();
        if (user) {
            document.getElementById('email').value = user.email || '';
            // يفترض أن الكود يعتمد على user.firstName و user.lastName
            // إذا كان الكائن user يحتوي على حقول مختلفة، يجب تعديل هذا الجزء
            // سأفترض هنا أن الاسم الكامل مخزن في user.name
            
            const fullName = user.name || user.fullName || '';
            const [firstName, ...lastNameParts] = fullName.split(' ');
            
            document.getElementById('firstName').value = firstName || '';
            document.getElementById('lastName').value = lastNameParts.join(' ') || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('address').value = user.address || '';
        }
    },
    
    // 🏆 عرض ملخص الطلب
    displayOrderSummary(cart) {
        const orderSummaryDiv = document.querySelector('.checkout-order-summary');
        
        // إذا لم يكن لديكِ Div لملخص الطلب في checkout.html، يجب إضافته!
        // سأقوم هنا بإنشاء هيكل Order Summary المشابه لصفحة السلة
        if (!orderSummaryDiv) {
             const paymentSection = document.querySelector('.info-payment-section');
             if (paymentSection) {
                 const summaryHTML = `
                    <div class="checkout-order-summary order-summary-box">
                        <h3>Your Order</h3>
                        <div id="checkout-item-list"></div>
                        <hr>
                        <div class="summary-line"><span>Subtotal:</span><span class="subtotal-value-checkout">$0.00 EGP</span></div>
                        <div class="summary-line"><span>Shipping:</span><span class="shipping-value-checkout">$20.00 EGP</span></div>
                        <hr>
                        <div class="summary-line total-final"><span>Total to Pay:</span><span class="total-final-value-checkout">$20.00 EGP</span></div>
                    </div>
                 `;
                 paymentSection.insertAdjacentHTML('afterend', summaryHTML);
            }
        }
        
        let subtotal = 0;
        const itemListContainer = document.getElementById('checkout-item-list');
        if (!itemListContainer) return;

        itemListContainer.innerHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'checkout-item';
            itemDiv.innerHTML = `
                <div class="item-details">
                    <img src="${item.image || 'images/default-product.jpg'}" alt="${item.name}" class="checkout-item-image">
                    <span>${item.name} x ${item.quantity}</span>
                </div>
                <span class="item-price">${itemTotal.toFixed(2)} EGP</span>
            `;
            itemListContainer.appendChild(itemDiv);
        });
        
        // تحديث الإجماليات
        this.updateCheckoutTotals(subtotal);
    },

    // 🏆 تحديث قيم الإجماليات
    updateCheckoutTotals(subtotal) {
        const shipping = 20.00;
        const discount = 0.00; // يمكن تطبيق كوبونات هنا
        const finalTotal = subtotal - discount + shipping;

        const format = (value) => `${value.toFixed(2)} EGP`;

        // استخدام الكلاسات المخصصة لصفحة Checkout
        const updateElementText = (selector, text) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = text;
        };

        updateElementText('.subtotal-value-checkout', format(subtotal));
        updateElementText('.shipping-value-checkout', format(shipping));
        updateElementText('.total-final-value-checkout', format(finalTotal));
    },
    
    // 🏆 تفعيل خاصية التبديل بين الدفع بالبطاقة والنقد
    // 🏆 تفعيل خاصية التبديل بين الدفع بالبطاقة والنقد
bindPaymentToggle() {
    const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
    const cardDetails = document.getElementById('creditCardDetails');
    const codMessage = document.getElementById('cashOnDeliveryMessage');
    
    // 🚨 جلب جميع حقول الإدخال داخل قسم البطاقة 🚨
    const cardInputs = cardDetails.querySelectorAll('input'); // هذا هو السطر الجديد

    paymentMethods.forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                cardDetails.style.display = 'block';
                codMessage.style.display = 'none';
                
                // 🏆 عند اختيار البطاقة: اجعل الحقول مطلوبة 🏆
                cardInputs.forEach(input => input.setAttribute('required', 'required')); 
                
            } else { // cash_on_delivery
                cardDetails.style.display = 'none';
                codMessage.style.display = 'block';
                
                // 🏆 عند اختيار الدفع النقدي: اجعل الحقول غير مطلوبة 🏆
                cardInputs.forEach(input => input.removeAttribute('required'));
            }
        });
    });
    
    // 💡 عند تحميل الصفحة أول مرة، نفذ الدالة يدوياً للتحقق من الحالة الافتراضية
    // ابحث عن الراديو المختار افتراضياً (يفترض أنه البطاقة) وقم بتنفيذ logic
    document.querySelector('input[name="payment_method"]:checked')?.dispatchEvent(new Event('change'));
},

    // 🏆 معالجة نموذج تأكيد الطلب
    // داخل الكائن CheckoutManager

bindFormSubmit() {
    console.log("STEP 1: Attempting to bind checkoutForm."); // ⬅️ خطوة 1: هل تبدأ الدالة؟
    
    const form = document.getElementById('checkoutForm');
    
    if (!form) {
        console.error("ERROR: checkoutForm element not found in the DOM."); // ⬅️ خطوة 2: هل النموذج موجود؟
        return;
    }

    form.addEventListener('submit', async (e) => {
        console.log("STEP 3: Submit event received."); // ⬅️ خطوة 3: هل تم الضغط على زر الإرسال؟
        e.preventDefault();
        
        // 🚨 عطل هذا الكود مؤقتاً لتجنب أي أخطاء متعلقة بالـ required fields 🚨
        // if (!form.checkValidity()) { 
        //     return;
        // }
        
        const orderBtn = document.getElementById('confirmOrderBtn');
        const originalText = orderBtn.textContent;
        // ملاحظة: تم إزالة استخراج 'selectedPayment' لأنه قد يسبب أخطاء إذا لم يكن موجوداً
        
        orderBtn.textContent = 'Processing...';
        orderBtn.disabled = true;

        const USE_API_SUBMISSION = false;

        try {
            if (USE_API_SUBMISSION) {
                // ... كود الـ API (المعطل) ...
            } else {
                // 🏆 منطق التجاوز المؤقت (Mocking) 🏆
                await new Promise(resolve => setTimeout(resolve, 500)); 
                Utils.saveCart([]); 
                
                console.log("STEP 4: Redirecting to order_confirmation.html"); // ⬅️ خطوة 4: هل وصل الكود إلى هنا؟
                window.location.href = 'order_confirmation.html'; 
            }
            
        } catch (error) {
            console.error('Order Submission Error:', error);
            alert('Network error or server error occurred during order submission.');
        } finally {
            orderBtn.textContent = originalText;
            orderBtn.disabled = false;
        }
    });
},
    
    // 🏆 دالة مساعدة لجمع البيانات
    collectFormData(paymentMethod) {
        const user = AuthManager.getUser();
        
        return {
            shippingAddress: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
            },
            paymentMethod: paymentMethod,
            // يتم جلب العناصر والإجمالي من الـ API في الـ Backend
            cartItems: CartManager.getCart(), 
            totalPrice: CartManager.getCartTotal(),
            userId: user?._id || user?.userId || 'guest_checkout'
        };
    }
};
    // ================== PAGES ==================

    // 🏠 Home
    if (path.endsWith("index.html") || path === "/" || path.endsWith("/index.html")) {
        HomePageManager?.init();
        setupDiseaseLinks();

        setTimeout(() => {
            RecommendationManager?.showHomeRecommendations();
        }, 1500);
    }

    // 📦 Products
    else if (path.includes("search-results.html")) {
        SearchManager?.initProductDisplay();
    }

    // 🛒 Cart
    else if (path.includes("shopping_cart.html")) {
        CartManager?.displayCart();

        document.querySelector(".checkout-btn")
            ?.addEventListener("click", () => {
                window.location.href = "checkout.html";
            });
            // 🏆 إضافة ربط زر مسح السلة
        document.getElementById("clear-cart")
            ?.addEventListener("click", () => {
                CartManager?.clearCart();
            });
    }
// 🏆 Checkout
    else if (path.includes("checkout.html")) {
        CheckoutManager?.init();
    }
    // 🔐 Login
    else if (path.includes("login.html")) {
        LoginManager?.init();
    }

    // 📝 Register
    else if (path.includes("register.html")) {
        RegisterManager?.init();
    }

    // 👤 User Profile
    else if (path.includes("user.html")) {
        setupModalListeners(
            'openProfileModalBtn',
            'profileModal',
            ['profileModalClose', 'cancelProfileBtn']
        );

        // ⭐ المهم
        if (typeof UserProfileManager !== 'undefined') {
            UserProfileManager.init();
        }
    }

    // 👮 Admin
    else if (path.includes("admin.html")) {
        setupModalListeners(
            'adminPage-openProfileModalBtn',
            'adminPage-profileModal',
            ['adminPage-profileModalClose', 'adminPage-cancelProfileBtn']
        );
    }

    // 👨‍⚕️ Staff
    else if (path.includes("staff.html")) {
        setupModalListeners(
            'openProfileModalBtn',
            'profileModal',
            ['profileModalClose', 'cancelProfileBtn']
        );
    }

    // 🏥 Hospitals
    else if (path.includes("hospital.html")) {
        HospitalManager?.init();
    }

    // 🧮 Cart count
    Utils?.updateCartCount();

});
