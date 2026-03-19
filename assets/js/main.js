/**
 * Bitcoin Ubuntu - Main JavaScript
 */

// ========================================
// CONFIGURATION
// ========================================

const CONFIG = {
    powbotStatsUrl: 'https://bitcoinubuntu.github.io/powbot-stats/stats.json',
    typingSpeed: 60,
    taglines: [
        'Study Bitcoin.',
        'Peer-to-Peer.',
        'Stay humble, stack sats.',
        'Freedom money.',
        'Not your keys, not your coins.',
        'Africa\'s Bitcoin revolution.',
        'Don\'t trust, verify.',
        'Education is key.',
        'Run your own node.',
        'Grassroots Bitcoin adoption.',
        'Fix the money, fix the world.',
        'Free Bitcoin education.',
        'Sound money for all.',
        'Orange-pilling the continent.',
        'Tick tock, next block.',
    ]
};

// Merchant data
const MERCHANTS = [
    { name: 'Bethel Farm', icon: '🌾', url: 'https://bethelfarmproject.wixsite.com/project' },
    { name: 'Bokmakiri Books', icon: '📚', url: 'https://facebook.com/bokmakiribooks/' },
    { name: 'Eco Treehouse', icon: '🌳', url: 'https://instagram.com/ecotreehouse/' },
    { name: 'Equine Encounters', icon: '🐴', url: 'https://equineencounters.co.za' },
    { name: 'Hermitage Horses', icon: '🐎', url: 'https://facebook.com/hermitagehorses/' },
    { name: 'Kathy Adams Bodywork', icon: '💆', url: 'https://facebook.com/katherine.adams.3114/' },
    { name: 'Khula Farms', icon: '🥬', url: 'https://facebook.com/khulafarms' },
    { name: 'M&S Vintage', icon: '🏺', url: 'https://btcmap.org/merchant/node:12312191621' },
    { name: 'Omweg Farm', icon: '🚜', url: 'https://omweg.co.za' },
    { name: "Sarah's Bakeshop", icon: '🥐', url: 'https://btcmap.org/merchant/node:12843895316' },
    { name: "Steve's Computers", icon: '💻', url: 'https://btcmap.org/merchant/node:2581584388' },
    { name: 'Lab21', icon: '🎨', url: 'mailto:studio21design@pm.me' },
    { name: 'Swellendam Boxing Gym', icon: '🥊', url: 'https://facebook.com/people/Swellendam-Boxing-Gym/61553003015655/' },
    { name: 'Swellies Soccer Club', icon: '⚽', url: 'https://wa.me/27813026857' },
    { name: 'Wellness Clinic', icon: '🏥', url: 'https://btcmap.org/merchant/node:11780142651' },
    { name: 'Wild@Heart', icon: '🦁', url: 'https://instagram.com/wild_at_heart_za' },
    { name: 'Wiskol Extra Maths', icon: '📐', url: 'https://btcmap.org/merchant/node:11518287448' },
    { name: 'Wolfkloof Boerdery', icon: '🐄', url: 'https://facebook.com/wolfkloof' },
];

// ========================================
// TYPING ANIMATION
// ========================================

class TypeWriter {
    constructor(element, words, speed = 60) {
        this.element = element;
        this.words = words;
        this.speed = speed;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
    }

    type() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.element.textContent = this.words[0];
            return;
        }

        const currentWord = this.words[this.wordIndex];

        if (this.isDeleting) {
            this.charIndex--;
            this.element.textContent = currentWord.substring(0, this.charIndex);
        } else {
            this.charIndex++;
            this.element.textContent = currentWord.substring(0, this.charIndex);
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        // Word complete
        if (!this.isDeleting && this.charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(() => this.type(), typeSpeed);
    }

    start() {
        this.type();
    }
}

// ========================================
// POWBOT STATS
// ========================================

async function fetchPowBotStats() {
    try {
        const response = await fetch(CONFIG.powbotStatsUrl + '?t=' + Date.now());
        if (!response.ok) throw new Error('Failed to fetch stats');
        const stats = await response.json();
        return stats;
    } catch (error) {
        console.error('Error fetching PoWBoT stats:', error);
        return null;
    }
}

// Hero stats are now static - no need to update from API

function updateLiveStats(stats) {
    if (!stats) return;

    const approvedEl = document.getElementById('live-approved');
    const projectsEl = document.getElementById('live-projects');
    const merchantsEl = document.getElementById('live-merchants');

    if (approvedEl) {
        approvedEl.textContent = formatNumber(stats.reviewer?.approved || 0);
    }
    if (projectsEl) {
        projectsEl.textContent = stats.top_projects?.length || 0;
    }
    if (merchantsEl) {
        merchantsEl.textContent = stats.top_merchants?.length || 0;
    }
}

function updateCountryTags(stats) {
    if (!stats || !stats.countries) return;

    const container = document.getElementById('country-tags');
    if (!container) return;

    container.innerHTML = stats.countries.map(c => `
        <span class="country-tag">
            <span class="country-flag">${c.flag}</span>
            <span class="country-name">${c.country}</span>
            ${c.count > 1 ? `<span class="country-count">(${c.count})</span>` : ''}
        </span>
    `).join('');
}

// ========================================
// MERCHANT GRID
// ========================================

function renderMerchantGrid() {
    const container = document.getElementById('merchant-grid');
    if (!container) return;

    container.innerHTML = MERCHANTS.map(merchant => `
        <a href="${merchant.url}" target="_blank" rel="noopener" class="merchant-item">
            <span class="merchant-icon">${merchant.icon}</span>
            <span class="merchant-name">${merchant.name}</span>
        </a>
    `).join('');
}

// ========================================
// MOBILE NAVIGATION
// ========================================

function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('active');
    });

    // Close menu when clicking a link
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('active');
        });
    });
}

function initMobileFooter() {
    const toggle = document.querySelector('.footer-toggle');
    const links = document.querySelector('.footer-links');

    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('active');
    });

    // Close menu when clicking a link
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('active');
        });
    });
}

// ========================================
// SMOOTH SCROLL
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// BLINK WIDGET
// ========================================

// Blink Pay Button widget is initialized via inline script in index.html

// ========================================
// UTILITIES
// ========================================

function formatNumber(num) {
    return num.toLocaleString();
}

// ========================================
// INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
    // Mobile navigation
    initMobileNav();

    // Mobile footer
    initMobileFooter();

    // Smooth scroll
    initSmoothScroll();

    // Parallax effect
    initParallax();

    // Typing animation
    const typedElement = document.getElementById('typed-tagline');
    if (typedElement) {
        const typeWriter = new TypeWriter(typedElement, CONFIG.taglines, CONFIG.typingSpeed);
        typeWriter.start();
    }

    // Render merchant grid
    renderMerchantGrid();

    // Fetch and display PoWBoT stats (for PoWBoT section only)
    const stats = await fetchPowBotStats();
    if (stats) {
        updateLiveStats(stats);
        updateCountryTags(stats);
    }
});

// ========================================
// PARALLAX EFFECT
// ========================================

function initParallax() {
    const parallaxBanners = document.querySelectorAll('.quote-banner[data-parallax]');

    if (!parallaxBanners.length) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function updateParallax() {
        parallaxBanners.forEach(banner => {
            const bg = banner.querySelector('.quote-banner-bg');
            if (!bg) return;

            const rect = banner.getBoundingClientRect();
            const speed = parseFloat(banner.dataset.parallax) || 0.4;

            // Only apply effect when banner is in viewport
            if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                const yPos = (rect.top - window.innerHeight / 2) * speed;
                bg.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    // Use requestAnimationFrame for smooth performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial update
    updateParallax();
}

// ========================================
// ACTIVE NAV HIGHLIGHTING
// ========================================

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navHeight = document.querySelector('.nav')?.offsetHeight || 0;

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
