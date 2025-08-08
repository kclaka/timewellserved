/**
 * Time Well Served - Main JavaScript
 * Handles interactivity and animations for the website
 */

document.addEventListener('DOMContentLoaded', function() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Header scroll effect
    const header = document.querySelector('.header');
    const scrollThreshold = 50;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Toggle menu icon
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
                // Hide sticky CTA when menu is open (mobile)
                const sticky = document.querySelector('.sticky-cta');
                if (sticky) sticky.classList.add('hidden');
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                // Recompute sticky CTA visibility when menu closes
                if (typeof updateStickyVisibility === 'function') updateStickyVisibility();
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (mainNav.classList.contains('active')) {
                mobileMenuToggle.click();
            }
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Form submission
    const demoForm = document.getElementById('demo-form');
    
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate API call
            setTimeout(() => {
                console.log('Form submitted:', formDataObj);
                
                // Reset form
                demoForm.reset();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.textContent = 'Thank you! We will contact you soon about your demo.';
                successMessage.style.color = 'var(--success)';
                successMessage.style.padding = 'var(--spacing-md)';
                successMessage.style.marginTop = 'var(--spacing-md)';
                successMessage.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                successMessage.style.borderRadius = 'var(--radius-md)';
                
                demoForm.appendChild(successMessage);
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }, 1500);
        });
    }
    
    // Add animation on scroll
    const animatedElements = document.querySelectorAll('.feature, .feature-card, .advanced-feature, .impact-item, .contact-card');
    
    const animateOnScroll = function() {
        if (prefersReducedMotion) {
            animatedElements.forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'none';
            });
            return;
        }
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    animatedElements.forEach(element => {
        if (prefersReducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.style.transition = 'none';
        } else {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'all 0.5s ease';
        }
    });
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Hero parallax effect
    const heroImg = document.querySelector('.hero-image img');
    function parallaxHero() {
        if (!heroImg || prefersReducedMotion) return;
        const y = window.scrollY;
        const translate = Math.min(y * 0.06, 30); // cap at 30px
        heroImg.style.transform = `perspective(1000px) rotateY(-5deg) translateY(${translate}px)`;
    }
    if (!prefersReducedMotion) {
        window.addEventListener('scroll', parallaxHero, { passive: true });
        parallaxHero();
    }

    // Sticky mobile CTA visibility
    const stickyCta = document.querySelector('.sticky-cta');
    const contactSection = document.getElementById('contact');

    function updateStickyVisibility() {
        if (!stickyCta) return;
        const isDesktop = window.matchMedia('(min-width: 768px)').matches;
        if (isDesktop) {
            stickyCta.classList.add('hidden');
            return;
        }
        // Hide if contact section intersecting viewport by at least 25%
        if (contactSection) {
            const rect = contactSection.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;
            const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
            const ratio = visible / Math.min(vh, rect.height || vh);
            if (ratio > 0.25) {
                stickyCta.classList.add('hidden');
                return;
            }
        }
        // Hide if nav menu open
        if (mainNav && mainNav.classList.contains('active')) {
            stickyCta.classList.add('hidden');
        } else {
            stickyCta.classList.remove('hidden');
        }
    }

    window.addEventListener('scroll', updateStickyVisibility, { passive: true });
    window.addEventListener('resize', updateStickyVisibility);
    updateStickyVisibility();

    // =========================
    // Demo Modal
    // =========================
    const demoModal = document.getElementById('demo-modal');
    const openDemoBtns = document.querySelectorAll('.open-demo');

    function openModal() {
        if (!demoModal) return;
        demoModal.classList.add('open');
        demoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const sticky = document.querySelector('.sticky-cta');
        if (sticky) sticky.classList.add('hidden');
    }

    function closeModal() {
        if (!demoModal) return;
        demoModal.classList.remove('open');
        demoModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        updateStickyVisibility();
    }

    openDemoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (demoModal) {
        demoModal.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('[data-close="modal"], .modal-backdrop')) {
                closeModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && demoModal.classList.contains('open')) closeModal();
        });
    }

    // Quick demo form submission UX
    const quickForm = document.getElementById('demo-quick-form');
    if (quickForm) {
        quickForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = quickForm.querySelector('button[type="submit"]');
            const original = submitBtn.textContent;
            const loadingText = submitBtn.getAttribute('data-loading') || 'Sending...';
            submitBtn.disabled = true;
            submitBtn.textContent = loadingText;
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = original;
                // lightweight success toast inside modal
                const note = document.createElement('div');
                note.textContent = 'Thanks! We will reach out shortly.';
                note.style.marginTop = '0.75rem';
                note.style.color = 'var(--success)';
                quickForm.appendChild(note);
                setTimeout(() => {
                    closeModal();
                    note.remove();
                    quickForm.reset();
                }, 1200);
            }, 1200);
        });
    }

    // =========================
    // Testimonials Slider
    // =========================
    const slider = document.querySelector('.testimonial-slider');
    const slides = slider ? Array.from(slider.querySelectorAll('.slide')) : [];
    const dots = slider ? Array.from(slider.querySelectorAll('.dot')) : [];
    const prevBtn = slider ? slider.querySelector('.prev') : null;
    const nextBtn = slider ? slider.querySelector('.next') : null;
    let current = 0;
    let autoTimer = null;

    function showSlide(index) {
        if (!slides.length) return;
        current = (index + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle('active', i === current));
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === current);
            d.setAttribute('aria-selected', i === current ? 'true' : 'false');
        });
    }

    function nextSlide() { showSlide(current + 1); }
    function prevSlide() { showSlide(current - 1); }

    function startAuto() {
        if (prefersReducedMotion) return; // don't auto-rotate
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(nextSlide, 6000);
    }
    function stopAuto() { if (autoTimer) clearInterval(autoTimer); }

    if (slider && slides.length) {
        showSlide(0);
        startAuto();
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAuto(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAuto(); });
        dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); startAuto(); }));
        slider.addEventListener('mouseenter', stopAuto);
        slider.addEventListener('mouseleave', startAuto);
    }
});
