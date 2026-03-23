// ===== 3GP.AI Main JavaScript =====

document.addEventListener('DOMContentLoaded', () => {

    // ===== NAVBAR SCROLL =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ===== MOBILE MENU =====
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // ===== CURSOR DOT =====
    const cursorDot = document.getElementById('cursorDot');
    let mouseX = 0, mouseY = 0, dotX = 0, dotY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
    });
    function animateCursor() {
        dotX += (mouseX - dotX) * 0.15;
        dotY += (mouseY - dotY) * 0.15;
        cursorDot.style.left = dotX - 4 + 'px';
        cursorDot.style.top = dotY - 4 + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(el => {
            const text = el.textContent;
            const match = text.match(/^([\d.]+)/);
            if (!match) return;
            const target = parseFloat(match[1]);
            const suffix = text.replace(match[1], '');
            const duration = 2000;
            const start = performance.now();
            const isFloat = text.includes('.');

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                const current = isFloat
                    ? (target * eased).toFixed(text.split('.')[1]?.match(/\d+/)?.[0]?.length || 2)
                    : Math.floor(target * eased);
                el.textContent = current + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) statsObserver.observe(statsGrid);

    // ===== PARALLAX FLOAT CARDS =====
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        document.querySelectorAll('.transform-float-card').forEach((card, i) => {
            const speed = [0.02, -0.015, 0.01][i] || 0.01;
            const base = card.style.transform.match(/rotate\([^)]+\)/)?.[0] || '';
            card.style.transform = `${base} translateY(${scrollY * speed}px)`;
        });
    });

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.form-submit');
            const successEl = document.getElementById('formSuccess');
            const errorEl = document.getElementById('formError');
            const spinner = contactForm.querySelector('.spinner');

            // Reset states
            successEl.classList.remove('show');
            errorEl.classList.remove('show');
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';
            if (spinner) spinner.style.display = 'block';

            const formData = {
                name: contactForm.querySelector('[name="name"]').value.trim(),
                email: contactForm.querySelector('[name="email"]').value.trim(),
                company: contactForm.querySelector('[name="company"]')?.value.trim() || '',
                phone: contactForm.querySelector('[name="phone"]')?.value.trim() || '',
                product: contactForm.querySelector('[name="product"]')?.value || '',
                message: contactForm.querySelector('[name="message"]').value.trim(),
                _gotcha: contactForm.querySelector('[name="_gotcha"]')?.value || '',
            };

            try {
                // Using Formspree for static hosting (replace YOUR_FORM_ID with actual Formspree form ID)
                // Sign up free at https://formspree.io — create a form and copy the ID
                const FORMSPREE_ID = 'xgonjnrk';
                const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                const data = await response.json();

                if (data.success) {
                    successEl.textContent = data.message;
                    successEl.classList.add('show');
                    contactForm.reset();
                } else {
                    errorEl.textContent = data.errors ? data.errors.join(', ') : data.message;
                    errorEl.classList.add('show');
                }
            } catch (err) {
                errorEl.textContent = 'Network error. Please email us at hello@3gp.ai';
                errorEl.classList.add('show');
            } finally {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                if (spinner) spinner.style.display = 'none';
            }
        });
    }
});
