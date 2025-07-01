 // ===== INICIALIZACIÓN AL CARGAR LA PÁGINA =====
        document.addEventListener('DOMContentLoaded', function() {
            initializeAnimations();
            createFloatingParticles();
            initializeSmoothScrolling();
            initializeIntersectionObserver();
            initializeLazyLoading();
            initializeLightbox();
            loadSavedTheme();
        });

        // ===== SISTEMA DE LAZY LOADING PARA IMÁGENES =====
        function initializeLazyLoading() {
            // Configuración del Intersection Observer para lazy loading
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const spinner = img.parentElement.querySelector('.loading-spinner');

                        // Cargar la imagen
                        img.onload = function() {
                            img.classList.add('loaded');
                            if (spinner) spinner.style.display = 'none';
                        };

                        img.onerror = function() {
                            // Si falla la carga, mostrar placeholder
                            img.style.display = 'none';
                            const placeholder = document.createElement('div');
                            placeholder.className = 'post-image-placeholder';
                            placeholder.innerHTML = '🖼️';
                            img.parentElement.appendChild(placeholder);
                            if (spinner) spinner.style.display = 'none';
                        };
                        // Start loading the image by setting its src
                        const actualSrc = img.getAttribute('src');
                        if (actualSrc) {
                            img.src = actualSrc; // Reassign src to trigger load
                        }


                        // Dejar de observar esta imagen
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            // Observar todas las imágenes lazy
            document.querySelectorAll('.lazy-image').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // ===== SISTEMA LIGHTBOX PARA AMPLIAR IMÁGENES =====
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');

        function openLightbox(src, alt) {
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        function initializeLightbox() {
            // Agregar event listeners a todas las imágenes clicables
            document.querySelectorAll('.post-image img, .gallery-item img').forEach(img => {
                img.addEventListener('click', function() {
                    openLightbox(this.src, this.alt);
                });
            });

            // Cerrar lightbox al hacer click fuera de la imagen
            lightbox.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeLightbox();
                }
            });

            // Cerrar lightbox con tecla Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    closeLightbox();
                }
            });
        }

        // ===== FUNCIONES ADICIONALES PARA ANIMACIONES Y UI =====

        // Función para inicializar animaciones con Intersection Observer (fade-in-up)
        function initializeAnimations() {
            const elements = document.querySelectorAll('.fade-in-up');
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '0px',
                threshold: 0.1
            });

            elements.forEach(element => {
                observer.observe(element);
            });
        }

        // Crear partículas flotantes en el fondo
        function createFloatingParticles() {
            const backgroundAnimation = document.querySelector('.background-animation');
            const numParticles = 30; // Number of particles

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

        // Smooth scrolling para enlaces de navegación
        function initializeSmoothScrolling() {
            document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();

                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    const headerOffset = document.querySelector('.header').offsetHeight; // Get fixed header height
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                });
            });
        }

        // Intersection Observer para resaltar el enlace de navegación activo
        function initializeIntersectionObserver() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(link => {
                            link.classList.remove('active'); // Remove active from all
                            if (link.getAttribute('href') === `#${entry.target.id}`) {
                                link.classList.add('active'); // Add active to current section's link
                            }
                        });
                    }
                });
            }, {
                rootMargin: '-50% 0px -50% 0px' // Adjust to trigger when section is roughly in the middle
            });

            sections.forEach(section => {
                observer.observe(section);
            });
        }


        // Toggle Dark/Light Mode
        function toggleTheme() {
            const body = document.body;
            const isDarkMode = body.classList.contains('dark-mode');

            if (isDarkMode) {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                document.querySelector('.dark-mode-toggle').textContent = '☀️';
            } else {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                document.querySelector('.dark-mode-toggle').textContent = '🌙';
            }
        }

        // Load saved theme from localStorage
        function loadSavedTheme() {
            const savedTheme = localStorage.getItem('theme');
            const body = document.body;
            const toggleButton = document.querySelector('.dark-mode-toggle');

            if (savedTheme) {
                body.classList.add(savedTheme + '-mode');
                if (savedTheme === 'light') {
                    toggleButton.textContent = '☀️';
                } else {
                    toggleButton.textContent = '🌙';
                }
            } else {
                // Default to dark mode if no preference is saved
                body.classList.add('dark-mode');
                toggleButton.textContent = '🌙';
            }
        }

        // Handle Contact Form Submission
        function handleContactFormSubmit(event) {
            event.preventDefault(); // Prevent default form submission

            const form = event.target;
            const name = form.name.value;
            const email = form.email.value;
            const subject = form.subject.value;
            const message = form.message.value;

            // In a real application, you would send this data to a backend server
            // For now, we'll just log it and give a success message.
            console.log("Formulario de contacto enviado:");
            console.log(`Nombre: ${name}`);
            console.log(`Email: ${email}`);
            console.log(`Asunto: ${subject}`);
            console.log(`Mensaje: ${message}`);

            alert("¡Mensaje enviado con éxito! Te responderé pronto.");
            form.reset(); // Clear the form
        }
