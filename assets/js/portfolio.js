/**
 * Portfolio Management System
 * Handles portfolio filtering, image galleries, modals, and project details
 */

class PortfolioManager {
    constructor() {
        this.portfolioGrid = null;
        this.filterButtons = [];
        this.portfolioItems = [];
        this.currentFilter = 'all';
        this.modal = null;
        this.galleryModal = null;
        this.currentImageIndex = 0;
        this.currentGalleryImages = [];
        
        // Portfolio data
        this.portfolioData = this.initializePortfolioData();
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupPortfolio();
            });
        } else {
            this.setupPortfolio();
        }
    }

    setupPortfolio() {
        this.cacheElements();
        this.bindEvents();
        this.setupIntersectionObserver();
        this.initializeFilters();
        this.setupModals();
        this.setupKeyboardNavigation();
    }

    cacheElements() {
        this.portfolioGrid = document.getElementById('portfolio-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.modal = document.getElementById('portfolio-modal');
        this.galleryModal = document.getElementById('gallery-modal');
        this.loadMoreBtn = document.getElementById('load-more-portfolio');
    }

    bindEvents() {
        // Filter button events
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = btn.dataset.filter;
                this.filterPortfolio(filter);
                this.setActiveFilter(btn);
            });
        });

        // Portfolio item click events
        this.portfolioItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = this.getProjectId(item);
                this.openProjectModal(projectId);
            });
        });

        // Load more button
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProjects();
            });
        }

        // Modal events
        this.setupModalEvents();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    setupModalEvents() {
        // Close modal events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
            if (e.target.classList.contains('modal-close')) {
                this.closeModal();
            }
            if (e.target.classList.contains('gallery-close')) {
                this.closeImageGallery();
            }
        });

        // Gallery navigation
        const prevBtn = document.querySelector('.gallery-nav.prev');
        const nextBtn = document.querySelector('.gallery-nav.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousImage());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextImage());
        }
    }

    initializePortfolioData() {
        return {
            'residential-1': {
                title: 'Modern 3BHK Apartment',
                category: 'residential',
                location: 'Salt Lake, Kolkata',
                budget: '₹8.5L',
                duration: '45 Days',
                year: '2024',
                description: 'A contemporary design project that seamlessly blends modern aesthetics with traditional Bengali elements. This 3BHK apartment features an open-plan living area, modular kitchen, and custom storage solutions.',
                client: 'Mr. & Mrs. Sharma',
                area: '1200 sq ft',
                features: [
                    'Open-plan living and dining area',
                    'Modular kitchen with breakfast counter',
                    'Master bedroom with walk-in closet',
                    'Custom storage throughout',
                    'Premium lighting design',
                    'Smart home automation'
                ],
                images: [
                    'assets/images/portfolio/residential-1/img1.jpg',
                    'assets/images/portfolio/residential-1/img2.jpg',
                    'assets/images/portfolio/residential-1/img3.jpg',
                    'assets/images/portfolio/residential-1/img4.jpg',
                    'assets/images/portfolio/residential-1/img5.jpg'
                ],
                beforeAfter: [
                    {
                        before: 'assets/images/portfolio/residential-1/before1.jpg',
                        after: 'assets/images/portfolio/residential-1/after1.jpg'
                    }
                ]
            },
            'commercial-1': {
                title: 'Corporate Office',
                category: 'commercial',
                location: 'Park Street, Kolkata',
                budget: '₹15L',
                duration: '60 Days',
                year: '2024',
                description: 'Professional workspace design for a growing tech company. The design focuses on creating collaborative spaces while maintaining productivity and brand identity.',
                client: 'TechCorp Solutions',
                area: '3000 sq ft',
                features: [
                    'Open workspace with flexible seating',
                    'Executive cabins with glass partitions',
                    'Modern conference rooms',
                    'Employee break areas',
                    'Reception and waiting area',
                    'Branded interior elements'
                ],
                images: [
                    'assets/images/portfolio/commercial-1/img1.jpg',
                    'assets/images/portfolio/commercial-1/img2.jpg',
                    'assets/images/portfolio/commercial-1/img3.jpg',
                    'assets/images/portfolio/commercial-1/img4.jpg'
                ]
            },
            'retail-1': {
                title: 'Fashion Boutique',
                category: 'retail',
                location: 'Gariahat, Kolkata',
                budget: '₹6L',
                duration: '30 Days',
                year: '2024',
                description: 'Elegant retail space design for a high-end fashion boutique. Custom display units, strategic lighting, and luxurious finishes create an premium shopping experience.',
                client: 'Elegant Fashion House',
                area: '800 sq ft',
                features: [
                    'Custom display counters',
                    'Strategic product lighting',
                    'Fitting rooms with premium finishes',
                    'POS counter design',
                    'Storage optimization',
                    'Brand-focused color scheme'
                ],
                images: [
                    'assets/images/portfolio/retail-1/img1.jpg',
                    'assets/images/portfolio/retail-1/img2.jpg',
                    'assets/images/portfolio/retail-1/img3.jpg'
                ]
            }
        };
    }

    filterPortfolio(filter) {
        this.currentFilter = filter;
        
        this.portfolioItems.forEach(item => {
            const itemCategories = item.dataset.category.split(' ');
            const shouldShow = filter === 'all' || itemCategories.includes(filter);
            
            if (shouldShow) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });

        // Update URL without page reload
        const url = new URL(window.location);
        if (filter === 'all') {
            url.searchParams.delete('filter');
        } else {
            url.searchParams.set('filter', filter);
        }
        window.history.replaceState({}, '', url);

        // Track filter usage
        this.trackFilterUsage(filter);
    }

    setActiveFilter(activeButton) {
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    initializeFilters() {
        // Check URL for initial filter
        const urlParams = new URLSearchParams(window.location.search);
        const initialFilter = urlParams.get('filter') || 'all';
        
        if (initialFilter !== 'all') {
            const filterButton = document.querySelector(`[data-filter="${initialFilter}"]`);
            if (filterButton) {
                this.filterPortfolio(initialFilter);
                this.setActiveFilter(filterButton);
            }
        }
    }

    getProjectId(item) {
        // Extract project ID from the portfolio item
        const img = item.querySelector('img');
        if (img && img.src) {
            const match = img.src.match(/portfolio\/([^\/]+)/);
            return match ? match[1] : null;
        }
        return null;
    }

    openProjectModal(projectId) {
        const project = this.portfolioData[projectId];
        if (!project) return;

        this.populateModal(project);
        this.showModal();
        
        // Track modal open
        this.trackModalOpen(projectId);
    }

    populateModal(project) {
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (modalTitle) {
            modalTitle.textContent = project.title;
        }
        
        if (modalBody) {
            modalBody.innerHTML = this.generateModalContent(project);
        }
    }

    generateModalContent(project) {
        return `
            <div class="project-details">
                <div class="project-header">
                    <div class="project-image">
                        <img src="${project.images[0]}" alt="${project.title}" loading="lazy">
                    </div>
                    <div class="project-info">
                        <div class="project-meta">
                            <div class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${project.location}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-calendar"></i>
                                <span>${project.year}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-rupee-sign"></i>
                                <span>${project.budget}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${project.duration}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-ruler"></i>
                                <span>${project.area}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-user"></i>
                                <span>${project.client}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="project-description">
                    <h4>Project Overview</h4>
                    <p>${project.description}</p>
                </div>
                
                <div class="project-features">
                    <h4>Key Features</h4>
                    <ul>
                        ${project.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="project-gallery">
                    <h4>Project Gallery</h4>
                    <div class="modal-gallery">
                        ${project.images.map((img, index) => `
                            <div class="gallery-thumb" onclick="openImageGallery('${Object.keys(this.portfolioData).find(key => this.portfolioData[key] === project)}', ${index})">
                                <img src="${img}" alt="${project.title} - Image ${index + 1}" loading="lazy">
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="project-actions">
                    <button class="btn btn-primary" onclick="window.location.href='#contact'">
                        <i class="fas fa-phone"></i>
                        Start Similar Project
                    </button>
                    <button class="btn btn-outline" onclick="shareProject('${project.title}')">
                        <i class="fas fa-share-alt"></i>
                        Share Project
                    </button>
                </div>
            </div>
        `;
    }

    showModal() {
        if (this.modal) {
            this.modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Animate modal
            setTimeout(() => {
                this.modal.classList.add('active');
            }, 10);
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            
            setTimeout(() => {
                this.modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }

    openImageGallery(projectId, startIndex = 0) {
        const project = this.portfolioData[projectId];
        if (!project) return;

        this.currentGalleryImages = project.images;
        this.currentImageIndex = startIndex;
        
        this.showImageGallery();
        this.updateGalleryImage();
        this.updateGalleryThumbnails();
    }

    showImageGallery() {
        if (this.galleryModal) {
            this.galleryModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeImageGallery() {
        if (this.galleryModal) {
            this.galleryModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    updateGalleryImage() {
        const galleryImage = document.getElementById('gallery-image');
        if (galleryImage && this.currentGalleryImages[this.currentImageIndex]) {
            galleryImage.src = this.currentGalleryImages[this.currentImageIndex];
            galleryImage.alt = `Gallery image ${this.currentImageIndex + 1}`;
        }
    }

    updateGalleryThumbnails() {
        const thumbnailContainer = document.getElementById('gallery-thumbnails');
        if (!thumbnailContainer) return;

        thumbnailContainer.innerHTML = this.currentGalleryImages.map((img, index) => `
            <img src="${img}" 
                 alt="Thumbnail ${index + 1}" 
                 class="gallery-thumbnail ${index === this.currentImageIndex ? 'active' : ''}"
                 onclick="setGalleryImage(${index})"
                 loading="lazy">
        `).join('');
    }

    previousImage() {
        this.currentImageIndex = this.currentImageIndex > 0 
            ? this.currentImageIndex - 1 
            : this.currentGalleryImages.length - 1;
        
        this.updateGalleryImage();
        this.updateGalleryThumbnails();
    }

    nextImage() {
        this.currentImageIndex = this.currentImageIndex < this.currentGalleryImages.length - 1 
            ? this.currentImageIndex + 1 
            : 0;
        
        this.updateGalleryImage();
        this.updateGalleryThumbnails();
    }

    setGalleryImage(index) {
        this.currentImageIndex = index;
        this.updateGalleryImage();
        this.updateGalleryThumbnails();
    }

    handleKeyboardNavigation(e) {
        if (this.galleryModal && this.galleryModal.style.display === 'flex') {
            switch (e.key) {
                case 'Escape':
                    this.closeImageGallery();
                    break;
                case 'ArrowLeft':
                    this.previousImage();
                    break;
                case 'ArrowRight':
                    this.nextImage();
                    break;
            }
        }
        
        if (this.modal && this.modal.style.display === 'flex') {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        }
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation hints
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('portfolio-item') && e.key === 'Enter') {
                e.target.click();
            }
        });
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);

        this.portfolioItems.forEach(item => {
            observer.observe(item);
        });
    }

    loadMoreProjects() {
        // Simulate loading more projects
        this.loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        this.loadMoreBtn.disabled = true;

        setTimeout(() => {
            // In a real application, this would fetch more data
            this.addMoreProjects();
            
            this.loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Projects';
            this.loadMoreBtn.disabled = false;
        }, 1500);
    }

    addMoreProjects() {
        // This would typically load from an API
        const additionalProjects = [
            {
                id: 'residential-3',
                title: 'Luxury Penthouse',
                category: 'residential',
                location: 'New Town, Kolkata',
                budget: '₹18L',
                duration: '90 Days',
                image: 'assets/images/portfolio/residential-3.jpg'
            },
            {
                id: 'commercial-3',
                title: 'Modern Clinic',
                category: 'commercial',
                location: 'Sector V, Kolkata',
                budget: '₹12L',
                duration: '50 Days',
                image: 'assets/images/portfolio/commercial-3.jpg'
            }
        ];

        additionalProjects.forEach(project => {
            this.addProjectToGrid(project);
        });
    }

    addProjectToGrid(project) {
        const projectHTML = `
            <div class="portfolio-item" data-category="${project.category}">
                <div class="portfolio-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                    <div class="portfolio-overlay">
                        <div class="portfolio-content">
                            <h4>${project.title}</h4>
                            <p>Premium interior design with modern aesthetics</p>
                            <div class="portfolio-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${project.location}</span>
                                <span><i class="fas fa-calendar"></i> 2024</span>
                            </div>
                            <div class="portfolio-actions">
                                <button class="btn btn-sm btn-outline" onclick="openPortfolioModal('${project.id}')">
                                    <i class="fas fa-eye"></i> View Details
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="openImageGallery('${project.id}')">
                                    <i class="fas fa-images"></i> Gallery
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="portfolio-info">
                    <h4>${project.title}</h4>
                    <p>${project.budget} • ${project.duration} • ${project.location.split(',')[0]}</p>
                </div>
            </div>
        `;

        if (this.portfolioGrid) {
            this.portfolioGrid.insertAdjacentHTML('beforeend', projectHTML);
            
            // Re-cache elements
            this.portfolioItems = document.querySelectorAll('.portfolio-item');
            
            // Apply current filter
            if (this.currentFilter !== 'all') {
                this.filterPortfolio(this.currentFilter);
            }
        }
    }

    // Analytics and tracking methods
    trackFilterUsage(filter) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'portfolio_filter', {
                'filter_type': filter,
                'event_category': 'portfolio'
            });
        }
    }

    trackModalOpen(projectId) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'portfolio_view', {
                'project_id': projectId,
                'event_category': 'portfolio'
            });
        }
    }

    // Search functionality
    setupPortfolioSearch() {
        const searchInput = document.getElementById('portfolio-search');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchPortfolio(e.target.value);
            }, 300);
        });
    }

    searchPortfolio(query) {
        const normalizedQuery = query.toLowerCase().trim();
        
        this.portfolioItems.forEach(item => {
            const title = item.querySelector('h4')?.textContent.toLowerCase() || '';
            const description = item.querySelector('p')?.textContent.toLowerCase() || '';
            const location = item.querySelector('.portfolio-meta span')?.textContent.toLowerCase() || '';
            
            const matches = title.includes(normalizedQuery) || 
                          description.includes(normalizedQuery) || 
                          location.includes(normalizedQuery);
            
            item.style.display = matches ? 'block' : 'none';
        });
    }

    // Share functionality
    shareProject(projectTitle) {
        if (navigator.share) {
            navigator.share({
                title: `${projectTitle} - Interior Design Project`,
                text: `Check out this amazing interior design project: ${projectTitle}`,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback to copy link
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link copied to clipboard!');
            }).catch(() => {
                this.showNotification('Unable to share. Please copy the URL manually.');
            });
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Lazy loading for images
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Public methods for external use
    getCurrentFilter() {
        return this.currentFilter;
    }

    filterByCategory(category) {
        const filterButton = document.querySelector(`[data-filter="${category}"]`);
        if (filterButton) {
            this.filterPortfolio(category);
            this.setActiveFilter(filterButton);
        }
    }

    openProject(projectId) {
        this.openProjectModal(projectId);
    }

    getPortfolioStats() {
        const stats = {
            total: this.portfolioItems.length,
            residential: document.querySelectorAll('[data-category*="residential"]').length,
            commercial: document.querySelectorAll('[data-category*="commercial"]').length,
            retail: document.querySelectorAll('[data-category*="retail"]').length,
            renovation: document.querySelectorAll('[data-category*="renovation"]').length
        };
        return stats;
    }
}

// Global functions for HTML onclick handlers
window.openPortfolioModal = function(projectId) {
    portfolioManager.openProjectModal(projectId);
};

window.closePortfolioModal = function() {
    portfolioManager.closeModal();
};

window.openImageGallery = function(projectId, startIndex = 0) {
    portfolioManager.openImageGallery(projectId, startIndex);
};

window.closeImageGallery = function() {
    portfolioManager.closeImageGallery();
};

window.previousImage = function() {
    portfolioManager.previousImage();
};

window.nextImage = function() {
    portfolioManager.nextImage();
};

window.setGalleryImage = function(index) {
    portfolioManager.setGalleryImage(index);
};

window.shareProject = function(projectTitle) {
    portfolioManager.shareProject(projectTitle);
};

// CSS for notifications and additional effects
const portfolioCSS = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .portfolio-item.visible {
        animation: fadeInUp 0.6s ease-out;
    }
    
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal.active {
        opacity: 1;
    }
    
    .modal-content {
        position: relative;
        background: var(--bg-primary);
        margin: 2% auto;
        padding: 0;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        border-radius: var(--radius-lg);
        transform: scale(0.8);
        transition: transform 0.3s ease;
    }
    
    .modal.active .modal-content {
        transform: scale(1);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--border-color);
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary);
        cursor: pointer;
        padding: var(--spacing-xs);
        border-radius: 50%;
        transition: all var(--transition-fast);
    }
    
    .modal-close:hover {
        background: var(--bg-secondary);
        color: var(--primary-color);
    }
    
    .gallery-modal-content {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .gallery-container {
        position: relative;
        max-width: 90%;
        max-height: 80%;
    }
    
    #gallery-image {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        border-radius: var(--radius-md);
    }
    
    .gallery-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        padding: var(--spacing-md);
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all var(--transition-fast);
    }
    
    .gallery-nav:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: translateY(-50%) scale(1.1);
    }
    
    .gallery-nav.prev {
        left: -60px;
    }
    
    .gallery-nav.next {
        right: -60px;
    }
    
    .gallery-thumbnails {
        display: flex;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-lg);
        overflow-x: auto;
        padding: var(--spacing-sm);
    }
    
    .gallery-thumbnail {
        width: 80px;
        height: 60px;
        object-fit: cover;
        border-radius: var(--radius-sm);
        cursor: pointer;
        border: 2px solid transparent;
        transition: all var(--transition-fast);
    }
    
    .gallery-thumbnail:hover,
    .gallery-thumbnail.active {
        border-color: var(--primary-color);
        transform: scale(1.1);
    }
    
    .project-meta {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-sm);
        margin: var(--spacing-lg) 0;
    }
    
    .meta-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        color: var(--text-secondary);
    }
    
    .meta-item i {
        color: var(--primary-color);
        width: 16px;
    }
    
    .modal-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: var(--spacing-sm);
        margin-top: var(--spacing-md);
    }
    
    .gallery-thumb {
        aspect-ratio: 4/3;
        overflow: hidden;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: transform var(--transition-fast);
    }
    
    .gallery-thumb:hover {
        transform: scale(1.05);
    }
    
    .gallery-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
            margin: 5% auto;
        }
        
        .gallery-nav.prev {
            left: -40px;
        }
        
        .gallery-nav.next {
            right: -40px;
        }
        
        .project-meta {
            grid-template-columns: 1fr;
        }
        
        .modal-gallery {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        }
    }
`;

// Inject portfolio CSS
const style = document.createElement('style');
style.textContent = portfolioCSS;
document.head.appendChild(style);

// Initialize portfolio manager
const portfolioManager = new PortfolioManager();

// Export for global access
window.PortfolioManager = portfolioManager;

// Utility functions
window.filterPortfolio = (category) => portfolioManager.filterByCategory(category);
window.getPortfolioStats = () => portfolioManager.getPortfolioStats();

console.log('🖼️ Portfolio Manager initialized successfully');