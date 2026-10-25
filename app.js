'use strict';

/* =============================================
   INFRASYS LIMITED — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. PRELOADER
    // =========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Hide after CSS animation completes (~1.8s fill + small buffer)
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Trigger entrance animations after preloader hides
                document.body.style.overflow = '';
            }, 300);
        });
        // Fallback: force hide after 3.5s no matter what
        setTimeout(() => preloader.classList.add('hidden'), 3500);
        document.body.style.overflow = 'hidden';
    }

    // =========================================
    // 2. DARK / LIGHT THEME TOGGLE
    // =========================================
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Apply saved theme immediately (before paint to avoid flash)
    const savedTheme = localStorage.getItem('infrasys-theme') || 'light';
    htmlEl.setAttribute('data-theme', savedTheme);

    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('infrasys-theme', theme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme');
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // =========================================
    // 3. DYNAMIC COPYRIGHT YEAR
    // =========================================
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // =========================================
    // 4. FLOATING GLASSMORPHIC NAVBAR WITH AUTO-HIDE
    // =========================================
    const header = document.getElementById('header');
    let lastScrollY = 0;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Hide/Show header based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down - hide header
            header.classList.add('header-hidden');
            header.classList.remove('header-visible');
        } else {
            // Scrolling up - show header
            header.classList.remove('header-hidden');
            header.classList.add('header-visible');
        }

        lastScrollY = currentScrollY;

        // Scrolled state
        if (currentScrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active nav link highlighting
        updateActiveNavLink();

        // Back to top button
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            if (currentScrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Active nav link on scroll
    // Only runs on index.html (single-page anchor navigation).
    // On all other pages the server-side `active` class on the correct
    // nav link must never be overwritten by scroll position.
    function updateActiveNavLink() {
        // Check if any nav link points to an in-page anchor (href="#...")
        // If none exist, this is a multi-page context — do nothing.
        const navLinks = document.querySelectorAll('.nav-link');
        const hasAnchorLinks = Array.from(navLinks).some(l => {
            const href = l.getAttribute('href') || '';
            return href.startsWith('#') && href.length > 1;
        });
        if (!hasAnchorLinks) return;

        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // =========================================
    // 4. MOBILE MENU
    // =========================================
    const hamburger = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const mobileClose = document.getElementById('mobile-menu-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

    function openMobileMenu() {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', openMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });


    // =========================================
    // 5. PARTICLE CANVAS ANIMATION
    // =========================================
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.2 + 0.4;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.55 + 0.1;
                this.maxOpacity = this.opacity;
                this.life = 0;
                this.maxLife = Math.random() * 300 + 200;
                // Colour: white or orange tint
                this.isOrange = Math.random() < 0.15;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life++;

                // Fade in/out over lifetime
                const halfLife = this.maxLife / 2;
                if (this.life < halfLife) {
                    this.opacity = this.maxOpacity * (this.life / halfLife);
                } else {
                    this.opacity = this.maxOpacity * (1 - (this.life - halfLife) / halfLife);
                }

                if (this.life >= this.maxLife) this.reset();

                // Wrap edges
                if (this.x < -5) this.x = canvas.width + 5;
                if (this.x > canvas.width + 5) this.x = -5;
                if (this.y < -5) this.y = canvas.height + 5;
                if (this.y > canvas.height + 5) this.y = -5;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.isOrange
                    ? `rgba(255, 107, 0, ${this.opacity})`
                    : `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Connection lines between nearby particles
        function drawConnections() {
            const maxDist = 130;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
        }

        function initParticles() {
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 9000), 110);
            particles = Array.from({ length: count }, () => new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawConnections();
            particles.forEach(p => { p.update(); p.draw(); });
            animationId = requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        initParticles();
        animateParticles();

        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
            initParticles();
        });
        resizeObserver.observe(canvas);
    }

    // =========================================
    // 6. TYPED TEXT EFFECT (HERO)
    // =========================================
    const typedEl = document.getElementById('typed-text');
    if (typedEl) {
        const phrases = [
            'Digital Infrastructure',
            'Cloud Architecture',
            'Enterprise Networks',
            'Data Center Solutions',
            'Smart Technology'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingTimeout;

        function typeText() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
                charIndex--;
            } else {
                typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
                charIndex++;
            }

            let delay = isDeleting ? 45 : 80;

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Pause at end of word
                delay = 2200;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 400;
            }

            typingTimeout = setTimeout(typeText, delay);
        }

        // Start after preloader (slight delay)
        setTimeout(typeText, 1800);
    }


    // =========================================
    // 7. SCROLL REVEAL — INTERSECTION OBSERVER
    // =========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // =========================================
    // 8. STATS COUNTER ANIMATION
    // =========================================
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.round(easedProgress * target);

            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.stat-number');
                // Stagger the counter starts
                numbers.forEach((num, i) => {
                    setTimeout(() => animateCounter(num), i * 120);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    const statsSection = document.getElementById('stats');
    if (statsSection) statsObserver.observe(statsSection);

    // =========================================
    // 9. TESTIMONIALS SLIDER
    // =========================================
    const track = document.getElementById('testimonials-track');
    const dotsContainer = document.getElementById('testimonials-dots');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    if (track && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        let autoSlideTimer;

        // Build dots
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) {
            currentIndex = (index + cards.length) % cards.length;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update dots
            dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });

            resetAutoSlide();
        }

        function nextSlide() { goToSlide(currentIndex + 1); }
        function prevSlide() { goToSlide(currentIndex - 1); }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto-advance every 5 seconds
        function startAutoSlide() {
            autoSlideTimer = setInterval(nextSlide, 5000);
        }
        function resetAutoSlide() {
            clearInterval(autoSlideTimer);
            startAutoSlide();
        }

        startAutoSlide();

        // Pause on hover
        const sliderWrapper = track.closest('.testimonials-slider');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
            sliderWrapper.addEventListener('mouseleave', startAutoSlide);
        }

        // Touch / swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
            }
        }, { passive: true });
    }


    // =========================================
    // 10. SMOOTH SCROLL FOR ANCHOR LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = header ? header.offsetHeight + 16 : 90;
            const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        });
    });

    // =========================================
    // 11. BACK TO TOP BUTTON
    // =========================================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================
    // 12. CONTACT FORM — SUBMIT WITH VALIDATION
    // =========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Real-time input validation feedback
        const requiredInputs = contactForm.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) validateField(input);
            });
        });

        function validateField(field) {
            const wrapper = field.closest('.form-group');
            const errorEl = wrapper.querySelector('.field-error');

            field.classList.remove('error');
            if (errorEl) errorEl.remove();

            if (!field.value.trim()) {
                showFieldError(field, wrapper, 'This field is required.');
                return false;
            }
            if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                showFieldError(field, wrapper, 'Please enter a valid email address.');
                return false;
            }
            return true;
        }

        function showFieldError(field, wrapper, message) {
            field.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'field-error';
            errorEl.textContent = message;
            errorEl.style.cssText = 'display:block;color:#ef4444;font-size:0.78rem;margin-top:6px;font-weight:600;';
            wrapper.appendChild(errorEl);
        }

        contactForm.addEventListener('submit', async (e) => {
            // Validate all required fields first
            let isValid = true;
            requiredInputs.forEach(input => {
                if (!validateField(input)) isValid = false;
            });
            if (!isValid) {
                e.preventDefault();
                return;
            }

            const submitBtn = contactForm.querySelector('.form-submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.style.opacity = '0.75';

            e.preventDefault();

            const name    = contactForm.querySelector('[name="name"]')?.value    || '';
            const email   = contactForm.querySelector('[name="email"]')?.value   || '';
            const phone   = contactForm.querySelector('[name="phone"]')?.value   || '';
            const company = contactForm.querySelector('[name="company"]')?.value || '';
            const service = contactForm.querySelector('[name="service"]')?.value || '';
            const message = contactForm.querySelector('[name="message"]')?.value || '';

            try {
                // POST to our own Node.js backend — no third party
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, company, service, message })
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    showFormSuccess(contactForm);
                } else {
                    throw new Error(data.error || 'Server error');
                }
            } catch (err) {
                // Fallback: open mail client pre-filled
                const subject = encodeURIComponent('Website Enquiry from ' + name);
                const body = encodeURIComponent(
                    'Name: ' + name + '\nEmail: ' + email +
                    '\nPhone: ' + (phone || 'Not provided') +
                    '\nCompany: ' + (company || 'Not provided') +
                    '\nService: ' + (service || 'Not specified') +
                    '\n\nMessage:\n' + message
                );
                window.location.href = 'mailto:info@infrasys.tech?subject=' + subject + '&body=' + body;
                showFormSuccess(contactForm, true);
            }
        });

        function showFormSuccess(form, isFallback = false) {
            form.innerHTML = `
                <div class="form-success">
                    <div class="form-success-icon">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <h3 style="font-family:var(--font-heading);font-size:1.6rem;color:var(--secondary-blue);margin-bottom:12px;">
                        ${isFallback ? 'Opening Your Email App...' : 'Message Sent Successfully!'}
                    </h3>
                    <p style="color:var(--text-muted);font-size:0.97rem;line-height:1.7;max-width:380px;margin:0 auto;">
                        ${isFallback
                            ? 'Your email app should open with the message pre-filled. If it doesn\'t, <a href="mailto:info@infrasys.tech" style="color:var(--primary-orange);font-weight:600;">click here</a>.'
                            : 'Thank you for reaching out. Our team will get back to you within 1 business day at <strong>' + (form.querySelector ? '' : '') + '</strong>.'
                        }
                    </p>
                    <p style="margin-top:16px;font-size:0.85rem;color:var(--text-muted);">Or call us: <a href="tel:+911244959639" style="color:var(--primary-orange);font-weight:600;">+91 124 4959639</a></p>
                </div>
            `;
        }
    }

    // =========================================
    // 13. NEWSLETTER FORM
    // =========================================
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('.newsletter-input');
            const btn = newsletterForm.querySelector('.newsletter-btn');

            if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                input.style.borderColor = '#ef4444';
                setTimeout(() => { input.style.borderColor = ''; }, 2000);
                return;
            }

            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            btn.style.background = '#10b981';
            input.value = '';
            input.placeholder = 'You\'re subscribed!';

            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
                btn.style.background = '';
                input.placeholder = 'Your email address';
            }, 4000);
        });
    }


    // =========================================
    // 14. PARALLAX — HERO BACKGROUND
    // =========================================
    const hero = document.querySelector('.hero');
    if (hero && window.matchMedia('(min-width: 768px)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                hero.style.backgroundPositionY = `calc(50% + ${scrolled * 0.25}px)`;
            }
        }, { passive: true });
    }

    // =========================================
    // 15. CURSOR GLOW EFFECT (desktop only)
    // =========================================
    if (window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) {
        const cursorGlow = document.createElement('div');
        cursorGlow.id = 'cursor-glow';
        cursorGlow.style.cssText = `
            position: fixed;
            width: 320px;
            height: 320px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            background: radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursorGlow);

        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        let glowVisible = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!glowVisible) {
                cursorGlow.style.opacity = '1';
                glowVisible = true;
            }
        });
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
            glowVisible = false;
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // =========================================
    // 16. INDUSTRY CARD — SHOW DESCRIPTION ON HOVER
    //     (handled via CSS :hover in styles.css,
    //      but add smooth height transition via JS)
    // =========================================
    const industryCards = document.querySelectorAll('.industry-card');
    industryCards.forEach(card => {
        const desc = card.querySelector('.industry-desc');
        if (!desc) return;

        card.addEventListener('mouseenter', () => {
            desc.style.display = 'block';
            desc.style.maxHeight = '0';
            desc.style.overflow = 'hidden';
            desc.style.transition = 'max-height 0.35s ease, opacity 0.35s ease';
            desc.style.opacity = '0';
            requestAnimationFrame(() => {
                desc.style.maxHeight = '60px';
                desc.style.opacity = '1';
            });
        });

        card.addEventListener('mouseleave', () => {
            desc.style.maxHeight = '0';
            desc.style.opacity = '0';
            setTimeout(() => { desc.style.display = 'none'; }, 350);
        });
    });

    // =========================================
    // 17. CARD MAGNETIC HOVER EFFECT
    //     (subtle 3D tilt on why/service cards)
    // =========================================
    if (window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) {
        const tiltCards = document.querySelectorAll('.why-card, .service-card, .team-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotateX = ((y - cy) / cy) * -6;
                const rotateY = ((x - cx) / cx) * 6;
                card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                card.style.transition = 'transform 0.1s ease';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        });
    }

}); // end DOMContentLoaded

// =========================================
// GSAP SCROLL TRIGGER ANIMATIONS
// =========================================
(function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // ── Hero section entrance
    const heroTitle = document.querySelector('.hero-title');
    const heroDesc = document.querySelector('.hero-desc');
    const heroActions = document.querySelector('.hero-actions');
    const heroBadges = document.querySelector('.hero-badges');
    const heroTag = document.querySelector('.hero-tag');

    if (heroTag) {
        gsap.fromTo(heroTag,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 }
        );
    }
    if (heroTitle) {
        gsap.fromTo(heroTitle,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.5 }
        );
    }
    if (heroDesc) {
        gsap.fromTo(heroDesc,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.75 }
        );
    }
    if (heroActions) {
        gsap.fromTo(heroActions,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.95 }
        );
    }
    if (heroBadges) {
        gsap.fromTo(heroBadges,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 1.1 }
        );
    }

    // ── Stats bar — counter cells stagger
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length) {
        gsap.fromTo(statItems,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.stats-card',
                    start: 'top 85%',
                    once: true
                }
            }
        );
    }

    // ── Section titles — slide up on scroll
    gsap.utils.toArray('.section-title').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 35 },
            {
                opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true }
            }
        );
    });

    // ── Why / Service / Work cards — stagger on scroll
    gsap.utils.toArray('.why-grid, .services-grid, .work-grid').forEach(grid => {
        const cards = grid.querySelectorAll(':scope > *');
        gsap.fromTo(cards,
            { opacity: 0, y: 45 },
            {
                opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
                stagger: 0.1,
                scrollTrigger: { trigger: grid, start: 'top 85%', once: true }
            }
        );
    });

    // ── Team cards — scale in
    gsap.utils.toArray('.team-card, .team-card-sm').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)',
                delay: (i % 4) * 0.1,
                scrollTrigger: { trigger: card, start: 'top 88%', once: true }
            }
        );
    });

    // ── Industry cards — stagger scale
    const industryGrid = document.querySelector('.industries-grid');
    if (industryGrid) {
        gsap.fromTo(industryGrid.querySelectorAll('.industry-card'),
            { opacity: 0, scale: 0.88, y: 20 },
            {
                opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)',
                stagger: 0.07,
                scrollTrigger: { trigger: industryGrid, start: 'top 85%', once: true }
            }
        );
    }

    // ── About section — left/right reveal
    const aboutContent = document.querySelector('.about-content');
    const aboutVisual = document.querySelector('.about-visual');
    if (aboutContent) {
        gsap.fromTo(aboutContent,
            { opacity: 0, x: -50 },
            {
                opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: aboutContent, start: 'top 82%', once: true }
            }
        );
    }
    if (aboutVisual) {
        gsap.fromTo(aboutVisual,
            { opacity: 0, x: 50, filter: 'blur(12px)' },
            {
                opacity: 1, x: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: aboutVisual, start: 'top 82%', once: true }
            }
        );
    }

    // ── CTA section — scale bounce
    const ctaContainer = document.querySelector('.cta-container');
    if (ctaContainer) {
        gsap.fromTo(ctaContainer,
            { opacity: 0, scale: 0.92, y: 30 },
            {
                opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.3)',
                scrollTrigger: { trigger: ctaContainer, start: 'top 85%', once: true }
            }
        );
    }

    // ── Values boxes — slide left
    gsap.utils.toArray('.value-box').forEach((box, i) => {
        gsap.fromTo(box,
            { opacity: 0, x: 50 },
            {
                opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
                delay: i * 0.15,
                scrollTrigger: { trigger: box, start: 'top 88%', once: true }
            }
        );
    });

    // ── Footer — fade up
    const footer = document.querySelector('.footer');
    if (footer) {
        gsap.fromTo(footer.querySelector('.footer-grid'),
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: footer, start: 'top 95%', once: true }
            }
        );
    }

    // ── Page hero (inner pages) — slide up
    const pageHeroContent = document.querySelector('.page-hero-content');
    if (pageHeroContent) {
        gsap.fromTo(pageHeroContent,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 }
        );
    }

    // ── Partner cards stagger
    const partnerCards = document.querySelectorAll('.partner-card');
    if (partnerCards.length) {
        gsap.fromTo(partnerCards,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 0.55, ease: 'power3.out',
                stagger: 0.08,
                scrollTrigger: { trigger: '.partners-grid', start: 'top 85%', once: true }
            }
        );
    }

    // ── Article / press / case cards
    gsap.utils.toArray('.article-card, .press-card, .case-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
                delay: (i % 3) * 0.1,
                scrollTrigger: { trigger: card, start: 'top 88%', once: true }
            }
        );
    });

})();

// =========================================
// 18. SITE SEARCH — LIVE FILTER ENGINE
// =========================================
(function initSearch() {

    // Full index of all pages and sections on this website
    const SEARCH_INDEX = [
        // Pages
        { title: 'Home', desc: 'Infrasys Limited — Transforming Through Technology', url: 'index.html', icon: 'fa-house', tags: 'home main infrasys' },
        { title: 'About Us', desc: 'Our story, mission, values and founding since 2016', url: 'about.html', icon: 'fa-circle-info', tags: 'about company story mission vision gurgaon founded 2016' },
        { title: 'Our Solutions', desc: 'ERP, AI, Cybersecurity, Cloud, Data Analytics services', url: 'services.html', icon: 'fa-briefcase', tags: 'services solutions what we do capabilities' },
        { title: 'Industries We Serve', desc: 'Energy, Banking, Telecom, Manufacturing, Healthcare and more', url: 'industries.html', icon: 'fa-building', tags: 'industries sectors energy banking finance healthcare manufacturing telecom logistics government' },
        { title: 'Our Team', desc: 'Meet Suraj Jaiswal and our leadership team', url: 'team.html', icon: 'fa-users', tags: 'team leadership suraj jaiswal vice president people experts' },
        { title: 'How We Work', desc: 'Our 4-phase methodology — Discover, Design, Implement, Optimize', url: 'process.html', icon: 'fa-diagram-project', tags: 'process how we work methodology discover design implement optimize' },
        { title: 'Insights & Blog', desc: 'Articles, case studies, whitepapers and press coverage', url: 'insights.html', icon: 'fa-newspaper', tags: 'insights blog articles case studies press news whitepaper' },
        { title: 'Events & Webinars', desc: 'Upcoming and past events, workshops and webinars', url: 'events.html', icon: 'fa-calendar', tags: 'events webinars workshops conferences register' },
        { title: 'Technology Partners', desc: 'SAP, Oracle, Microsoft, AWS, Google Cloud partnerships', url: 'partners.html', icon: 'fa-handshake', tags: 'partners sap oracle microsoft azure aws google cloud cisco frappe erpnext ibm salesforce' },
        { title: 'Careers', desc: 'Open jobs — ERPNext Developer, Interns, Business Analyst', url: 'careers.html', icon: 'fa-user-tie', tags: 'careers jobs hiring erpnext developer intern business analyst gurgaon mumbai remote' },
        { title: 'Contact Us', desc: '+91 124 4959639 — info@infrasys.tech — Gurgaon HQ', url: 'contact.html', icon: 'fa-phone', tags: 'contact phone email address location gurgaon get in touch' },
        { title: 'Privacy Policy', desc: 'How we collect, use and protect your personal data', url: 'privacy-policy.html', icon: 'fa-shield-halved', tags: 'privacy policy data gdpr dpdp personal information' },
        { title: 'Terms of Service', desc: 'Legal terms governing use of our website and services', url: 'terms.html', icon: 'fa-file-contract', tags: 'terms service legal agreement contract' },
        { title: 'Compliance', desc: 'GDPR, ISO 27001, DPDP Act, anti-bribery framework', url: 'compliance.html', icon: 'fa-scale-balanced', tags: 'compliance gdpr iso 27001 dpdp act regulatory framework security' },

        // Services
        { title: 'ERP & Enterprise Applications', desc: 'SAP S/4HANA, Oracle Fusion, Microsoft Dynamics, ERPNext', url: 'services.html', icon: 'fa-layer-group', tags: 'erp sap oracle microsoft dynamics erpnext enterprise applications implementation' },
        { title: 'Artificial Intelligence & ML', desc: 'AI automation, machine learning, intelligent process optimization', url: 'services.html', icon: 'fa-brain', tags: 'artificial intelligence machine learning ai ml automation nlp llm' },
        { title: 'Cybersecurity & Data Risk', desc: 'Security assessments, compliance, threat detection', url: 'services.html', icon: 'fa-shield-halved', tags: 'cybersecurity security risk vapt zero trust compliance data protection' },
        { title: 'Data Analytics & BI', desc: 'Data lakes, BI dashboards, real-time pipelines', url: 'services.html', icon: 'fa-chart-column', tags: 'data analytics business intelligence bi dashboard power bi python bigquery' },
        { title: 'Cloud & Digital Transformation', desc: 'AWS, Azure, GCP cloud migrations and modernization', url: 'services.html', icon: 'fa-cloud', tags: 'cloud aws azure google gcp migration digital transformation microservices kubernetes' },
        { title: 'Business Consulting & Managed Services', desc: 'Strategic advisory and ongoing managed services', url: 'services.html', icon: 'fa-chess', tags: 'consulting managed services strategy advisory programme management' },

        // Contact details
        { title: 'Phone: +91 124 4959639', desc: 'Call our Gurgaon office', url: 'contact.html', icon: 'fa-phone', tags: 'phone call hotline +91 124 4959639' },
        { title: 'Email: info@infrasys.tech', desc: 'Send us an email', url: 'contact.html', icon: 'fa-envelope', tags: 'email info@infrasys.tech contact' },
        { title: 'Office: Spaze Itech Park, Gurgaon', desc: 'Sector 49, Gurugram, Haryana 122018', url: 'contact.html', icon: 'fa-location-dot', tags: 'office address location spaze itech park gurgaon gurugram haryana' },

        // Jobs
        { title: 'Job: ERPNext Developer', desc: '1 opening · Full-time · Gurgaon · <3 years exp', url: 'careers.html', icon: 'fa-code', tags: 'erpnext developer python frappe job opening gurgaon' },
        { title: 'Job: Software Development Intern', desc: '2 openings · 6 months · Gurgaon NCR colleges', url: 'careers.html', icon: 'fa-graduation-cap', tags: 'intern internship software developer student btech gurgaon ncr' },
        { title: 'Job: Business Analyst', desc: '1 opening · Remote · Mumbai-based', url: 'careers.html', icon: 'fa-chart-bar', tags: 'business analyst remote mumbai erp sap oracle requirements' },

        // Industries
        { title: 'Energy & Utilities', desc: 'SCADA, smart grid, OT security', url: 'industries.html', icon: 'fa-bolt', tags: 'energy utilities scada smart grid ot security iec 62443' },
        { title: 'Banking & Finance', desc: 'ERP, compliance, fintech platforms', url: 'industries.html', icon: 'fa-landmark', tags: 'banking finance fintech erp compliance fraud detection' },
        { title: 'Healthcare', desc: 'HIPAA-compliant health data platforms and HIS/EMR', url: 'industries.html', icon: 'fa-hospital', tags: 'healthcare hipaa his emr clinical health data' },
        { title: 'Manufacturing', desc: 'Industry 4.0, IoT integration, MES/ERP', url: 'industries.html', icon: 'fa-industry', tags: 'manufacturing industry 4.0 iot mes erp ot it convergence' },
        { title: 'Telecom & Fiber', desc: 'Network ring design, 5G readiness, edge DC', url: 'industries.html', icon: 'fa-tower-broadcast', tags: 'telecom fiber 5g network noc edge data center' },
        { title: 'Logistics & Transit', desc: 'Fleet telemetry, supply chain digitization', url: 'industries.html', icon: 'fa-truck-fast', tags: 'logistics transit fleet telematics supply chain wms' },
        { title: 'Government & Public Sector', desc: 'Digital governance and smart cities', url: 'industries.html', icon: 'fa-building-flag', tags: 'government public sector smart city digital governance' },
    ];

    function runSearch(query) {
        const q = query.trim().toLowerCase();
        if (!q) return null; // null = show default quick links

        return SEARCH_INDEX.filter(item => {
            return (
                item.title.toLowerCase().includes(q) ||
                item.desc.toLowerCase().includes(q) ||
                item.tags.toLowerCase().includes(q)
            );
        }).slice(0, 8); // max 8 results
    }

    function renderResults(results, container, query) {
        container.innerHTML = '';

        if (results === null) {
            // Show default quick links
            container.innerHTML = `
                <p class="search-hint">Quick Links</p>
                <div class="search-quick-links" id="search-results-list">
                    <a href="services.html" class="search-ql"><i class="fa-solid fa-layer-group"></i> ERP Solutions</a>
                    <a href="services.html" class="search-ql"><i class="fa-solid fa-brain"></i> AI &amp; ML</a>
                    <a href="services.html" class="search-ql"><i class="fa-solid fa-shield-halved"></i> Cybersecurity</a>
                    <a href="industries.html" class="search-ql"><i class="fa-solid fa-building"></i> Industries</a>
                    <a href="insights.html" class="search-ql"><i class="fa-solid fa-newspaper"></i> Insights</a>
                    <a href="events.html" class="search-ql"><i class="fa-solid fa-calendar"></i> Events</a>
                    <a href="careers.html" class="search-ql"><i class="fa-solid fa-briefcase"></i> Careers</a>
                    <a href="contact.html" class="search-ql"><i class="fa-solid fa-phone"></i> Contact</a>
                </div>`;
            return;
        }

        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-no-results">
                    <i class="fa-solid fa-magnifying-glass" style="font-size:2rem;color:rgba(255,255,255,0.2);margin-bottom:12px;display:block;"></i>
                    <p style="color:rgba(255,255,255,0.5);font-size:0.95rem;">No results found for "<strong style="color:rgba(255,255,255,0.8);">${query}</strong>"</p>
                    <p style="color:rgba(255,255,255,0.3);font-size:0.82rem;margin-top:6px;">Try: ERP, SAP, cloud, cybersecurity, careers, contact...</p>
                </div>`;
            return;
        }

        const countEl = document.createElement('p');
        countEl.className = 'search-hint';
        countEl.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`;
        container.appendChild(countEl);

        const list = document.createElement('div');
        list.className = 'search-results-list';
        list.id = 'search-results-list';

        results.forEach(item => {
            const q = query.toLowerCase();
            const highlight = (text) => {
                const idx = text.toLowerCase().indexOf(q);
                if (idx === -1) return text;
                return text.slice(0, idx) + '<mark>' + text.slice(idx, idx + q.length) + '</mark>' + text.slice(idx + q.length);
            };

            const a = document.createElement('a');
            a.href = item.url;
            a.className = 'search-result-item';
            a.innerHTML = `
                <div class="sri-icon"><i class="fa-solid ${item.icon}"></i></div>
                <div class="sri-text">
                    <div class="sri-title">${highlight(item.title)}</div>
                    <div class="sri-desc">${highlight(item.desc)}</div>
                </div>
                <i class="fa-solid fa-arrow-right sri-arrow"></i>`;
            list.appendChild(a);
        });

        container.appendChild(list);
    }

    // Initialize on every page load
    function initSearchOnPage() {
        const searchInput = document.getElementById('search-input');
        const searchOverlay = document.getElementById('search-overlay');
        const searchToggle = document.getElementById('search-toggle');
        const searchClose = document.getElementById('search-close');

        if (!searchInput || !searchOverlay) return;

        const suggestionsContainer = searchOverlay.querySelector('.search-suggestions');
        if (!suggestionsContainer) return;

        // Show default on load
        renderResults(null, suggestionsContainer, '');

        // Live filtering
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const q = searchInput.value;
                const results = runSearch(q);
                renderResults(results, suggestionsContainer, q);
            }, 180);
        });

        // Open
        if (searchToggle) {
            searchToggle.addEventListener('click', () => {
                searchOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
                setTimeout(() => searchInput.focus(), 200);
                // Reset to default when opened
                searchInput.value = '';
                renderResults(null, suggestionsContainer, '');
            });
        }

        // Close
        function closeSearch() {
            searchOverlay.classList.remove('open');
            document.body.style.overflow = '';
            searchInput.value = '';
            renderResults(null, suggestionsContainer, '');
        }

        if (searchClose) searchClose.addEventListener('click', closeSearch);
        searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('open')) closeSearch();
        });
    }

    // Run immediately (DOM may already be ready via DOMContentLoaded above)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearchOnPage);
    } else {
        initSearchOnPage();
    }

})();

// =========================================
// 19. GLOBAL CSS INJECTIONS
// =========================================
(function injectGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Input error state */
        .form-input.error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 4px rgba(239,68,68,0.1) !important;
        }

        /* Smooth industry desc on non-hover state */
        .industry-desc {
            display: none;
            overflow: hidden;
        }

        /* Prevent layout shift during preload */
        body.loading { overflow: hidden; }
    `;
    document.head.appendChild(style);
})();
