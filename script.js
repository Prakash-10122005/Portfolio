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

    // Contact form (unchanged behaviour)
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name && email && message) {
                formMessage.style.color = '#22c55e';
                formMessage.textContent = 'Thank you! Your message has been sent successfully.';
                contactForm.reset();
                setTimeout(() => { formMessage.textContent = ''; }, 5000);
            } else {
                formMessage.style.color = '#ef4444';
                formMessage.textContent = 'Please fill in all fields before submitting.';
            }
        });
    }
});
