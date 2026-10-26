document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Mobile menu
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    document.querySelectorAll('.nav-links a').forEach(link =>
        link.addEventListener('click', () => navLinks.classList.remove('active'))
    );

    // Scroll progress bar
    const progress = document.createElement('div');
    progress.id = 'progress';
    document.body.prepend(progress);

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-links a');

    const onScroll = () => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
        header.classList.toggle('scrolled', y > 40);

        let current = 'hero';
        sections.forEach(s => { if (y >= s.offsetTop - 140) current = s.id; });
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Reveal-on-scroll (cards only, not the marquee)
    const targets = document.querySelectorAll(
        '.section-title, .about-text, .stat-card, .skill-category, .project-card, .contact-info, .contact-form'
    );
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        targets.forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = (i % 4) * 80 + 'ms';
            io.observe(el);
        });
    }

    // Certificates page: click to enlarge
    const grid = document.querySelector('.cert-grid');
    if (grid) {
        const box = document.createElement('div');
        box.className = 'lightbox';
        box.innerHTML = '<img alt="">';
        document.body.appendChild(box);
        grid.addEventListener('click', (e) => {
            const img = e.target.closest('.cert-grid-card')?.querySelector('img');
            if (img) { box.firstChild.src = img.src; box.classList.add('open'); }
        });
        box.addEventListener('click', () => box.classList.remove('open'));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') box.classList.remove('open'); });
    }

    // Contact form -> Formspree
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const original = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Sending...';

            try {
                const res = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (res.ok) {
                    formMessage.style.color = '#22c55e';
                    formMessage.textContent = 'Thank you! Your message has been sent successfully.';
                    contactForm.reset();
                } else {
                    throw new Error('Request failed');
                }
            } catch (err) {
                formMessage.style.color = '#ef4444';
                formMessage.textContent = 'Oops! Something went wrong. Please try again or email me directly.';
            } finally {
                btn.disabled = false;
                btn.textContent = original;
                setTimeout(() => { formMessage.textContent = ''; }, 6000);
            }
        });
    }
});
