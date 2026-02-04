// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe project cards for staggered reveal on scroll
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    // Reset initial state for scroll-triggered animation
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
});

// Add parallax effect to project images on scroll
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const images = document.querySelectorAll('.project-image');
    
    images.forEach(image => {
        const card = image.closest('.project-card');
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.top + cardRect.height / 2;
        const windowCenter = window.innerHeight / 2;
        const offset = (cardCenter - windowCenter) * 0.05;
        
        image.style.transform = `translateY(${offset}px) scale(1)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// Newspaper print effect on hover
const projectCardElements = document.querySelectorAll('.project-card');

projectCardElements.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Add reading time estimator (classic newspaper feature)
function calculateReadingTime() {
    const text = document.querySelector('.intro-section').innerText;
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
}

// Optional: Add reading time to page (can be uncommented if desired)
// const readingTime = calculateReadingTime();
// console.log(`Estimated reading time: ${readingTime} minute${readingTime > 1 ? 's' : ''}`);

// Add "ink spread" effect on project card clicks
projectCardElements.forEach(card => {
    card.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(196, 30, 58, 0.3)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.pointerEvents = 'none';
        
        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';
        
        this.style.position = 'relative';
        this.appendChild(ripple);
        
        // Animate ripple
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(20)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        });
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add typewriter effect to newspaper title (runs once on page load)
function typewriterEffect() {
    const title = document.querySelector('.newspaper-title');
    if (!title) return;
    
    const originalText = title.textContent;
    title.textContent = '';
    title.style.opacity = '1';
    
    let index = 0;
    const speed = 80;
    
    function type() {
        if (index < originalText.length) {
            title.textContent += originalText.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    // Start typewriter after initial delay
    setTimeout(type, 800);
}

// Optional: Uncomment to enable typewriter effect
// typewriterEffect();

// Add vintage newspaper texture overlay (subtle)
function addNewsprint() {
    const wrapper = document.querySelector('.newspaper-wrapper');
    if (!wrapper) return;
    
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = '0.03';
    overlay.style.zIndex = '1000';
    overlay.style.backgroundImage = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
    
    document.body.appendChild(overlay);
}

// Add newsprint texture
addNewsprint();

// Print-friendly version
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// Add current date to dateline (dynamically)
function updateDateline() {
    const dateline = document.querySelector('.dateline');
    if (!dateline) return;
    
    const options = { year: 'numeric', month: 'long' };
    const currentDate = new Date().toLocaleDateString('en-US', options);
    
    // Keep the original text but could update with current date if preferred
    // dateline.textContent = `Tokyo, Japan · ${currentDate} · Digital Edition`;
}

updateDateline();

// Add accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels to interactive elements
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.setAttribute('role', 'article');
        card.setAttribute('tabindex', '0');
        
        // Add keyboard navigation
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    // Add focus styles for keyboard navigation
    const focusableElements = document.querySelectorAll('a, .project-card');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #c41e3a';
            this.style.outlineOffset = '4px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
});

console.log('Portfolio loaded successfully - Classic newspaper edition');