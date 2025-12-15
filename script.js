document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Home Section Cursor Effect
    const homeSection = document.querySelector('.home');
    if (homeSection) {
        const glow = document.createElement('div');
        glow.classList.add('home-glow');
        homeSection.appendChild(glow);

        homeSection.addEventListener('mousemove', (e) => {
            const rect = homeSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
            glow.style.opacity = '1';
        });

        homeSection.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });
    }
});
