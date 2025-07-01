
        document.addEventListener('DOMContentLoaded', function() {
            initializeAnimations();
            createFloatingParticles();
            initializeSmoothScrolling();
            initializeIntersectionObserver();
            initializeLazyLoading();
            initializeLightbox();
            loadSavedTheme();
        });

        function initializeLazyLoading() {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.classList.contains('loaded')) {
                            observer.unobserve(img);
                            return;
                        }
                        const spinner = img.parentElement.querySelector('.loading-spinner');
                        img.onload = function() {
                            img.classList.add('loaded');
                            if (spinner) spinner.style.display = 'none';
                        };
                        img.onerror = function() {
                            img.style.display = 'none';
                            const placeholder = document.createElement('div');
                            placeholder.className = 'post-image-placeholder';
                            placeholder.innerHTML = '🖼️';
                            img.parentElement.appendChild(placeholder);
                            if (spinner) spinner.style.display = 'none';
                        };
                        const actualSrc = img.getAttribute('src');
                        if (actualSrc) img.src = actualSrc;
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '50px' });
            document.querySelectorAll('.lazy-image').forEach(img => {
                imageObserver.observe(img);
            });
        }

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');

        function openLightbox(src, alt) {
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function initializeLightbox() {
            document.querySelectorAll('.post-image img, .gallery-item img').forEach(img => {
                img.addEventListener('click', function() {
                    openLightbox(this.src, this.alt);
                });
            });
            lightbox.addEventListener('click', function(e) {
                if (e.target === this) closeLightbox();
            });
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
            });
        }

        function initializeAnimations() {
            const elements = document.querySelectorAll('.fade-in-up');
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            elements.forEach(el => observer.observe(el));
        }

        function createFloatingParticles() {
            const backgroundAnimation = document.querySelector('.background-animation');
            const numParticles = 30;
            for (let i = 0; i < numParticles; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                particle.style.animationDuration = `${5 + Math.random() * 5}s`;
                particle.style.opacity = `${0.3 + Math.random() * 0.7}`;
                backgroundAnimation.appendChild(particle);
            }
        }

        function initializeSmoothScrolling() {
            document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    const headerOffset = document.querySelector('.header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                });
            });
        }

        function initializeIntersectionObserver() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${entry.target.id}`) link.classList.add('active');
                        });
                    }
                });
            }, { rootMargin: '-50% 0px -50% 0px' });
            sections.forEach(section => observer.observe(section));
        }

        function toggleTheme() {
            const body = document.body;
            const isDarkMode = body.classList.contains('dark-mode');
            const toggleButton = document.querySelector('.dark-mode-toggle');
            if (isDarkMode) {
                body.classList.replace('dark-mode', 'light-mode');
                localStorage.setItem('theme', 'light');
                toggleButton.textContent = '☀️';
            } else {
                body.classList.replace('light-mode', 'dark-mode');
                localStorage.setItem('theme', 'dark');
                toggleButton.textContent = '🌙';
            }
        }

        function loadSavedTheme() {
            const savedTheme = localStorage.getItem('theme');
            const body = document.body;
            const toggleButton = document.querySelector('.dark-mode-toggle');
            if (savedTheme) {
                body.classList.add(`${savedTheme}-mode`);
                toggleButton.textContent = savedTheme === 'light' ? '☀️' : '🌙';
            } else {
                body.classList.add('dark-mode');
                toggleButton.textContent = '🌙';
            }
        }

        document.getElementById('contactForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = document.getElementById('submitBtn');
        const messageDiv = document.getElementById('message');
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        try {
            const response = await fetch('https://formspree.io/f/xgvydpnn', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(form)
            });
            
            if (response.ok) {
                messageDiv.innerHTML = '¡Mensaje enviado correctamente!';
                messageDiv.style.color = 'green';
                form.reset();
            } else {
                throw new Error('Error');
            }
        } catch (error) {
            messageDiv.innerHTML = 'Error al enviar. Intenta nuevamente.';
            messageDiv.style.color = 'red';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Mensaje';
            messageDiv.style.display = 'block';
        }
        });