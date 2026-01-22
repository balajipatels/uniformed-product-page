/**
 * Main JavaScript File for Uniform Landing Page
 * Contains all interactive functionality and event handlers
 */

(function() {
    'use strict';

    // ==========================================
    // DOM Content Loaded Event
    // ==========================================
    document.addEventListener('DOMContentLoaded', function() {
        initializeNavigation();
        initializeCarousel();
        initializeQuoteForm();
        initializeEnquiryButtons();
        initializeSmoothScroll();
        initializeScrollAnimations();
        initializeWhatsAppButton();
    });

    // ==========================================
    // Navigation Functions
    // ==========================================
    function initializeNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        // Add shadow to navbar on scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.boxShadow = 'none';
            }
        });

        // Close mobile menu when clicking on nav links
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            });
        });

        // Active link highlighting
        window.addEventListener('scroll', function() {
            highlightActiveNavLink();
        });
    }

    function highlightActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ==========================================
    // Carousel Functions
    // ==========================================
    function initializeCarousel() {
        const carousel = document.querySelector('#heroCarousel');
        
        if (carousel) {
            // Initialize Bootstrap carousel with custom options
            const bsCarousel = new bootstrap.Carousel(carousel, {
                interval: 5000,
                wrap: true,
                touch: true
            });

            // Add pause on hover
            carousel.addEventListener('mouseenter', function() {
                bsCarousel.pause();
            });

            carousel.addEventListener('mouseleave', function() {
                bsCarousel.cycle();
            });

            // Animate carousel captions
            carousel.addEventListener('slide.bs.carousel', function(event) {
                const activeCaption = event.relatedTarget.querySelector('.carousel-caption-custom');
                if (activeCaption) {
                    animateCarouselCaption(activeCaption);
                }
            });
        }
    }

    function animateCarouselCaption(caption) {
        const elements = caption.querySelectorAll('h1, p, .btn');
        elements.forEach(function(element, index) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(function() {
                element.style.transition = 'all 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // ==========================================
    // Quote Form Functions
    // ==========================================
    function initializeQuoteForm() {
        const quoteForm = document.getElementById('quoteForm');
        
        if (quoteForm) {
            quoteForm.addEventListener('submit', function(event) {
                event.preventDefault();
                handleQuoteFormSubmission(quoteForm);
            });

            // Add input validation feedback
            const inputs = quoteForm.querySelectorAll('input, select, textarea');
            inputs.forEach(function(input) {
                input.addEventListener('blur', function() {
                    validateFormField(input);
                });
            });
        }
    }

    function handleQuoteFormSubmission(form) {
        // Get form data
        const formData = new FormData(form);
        const formDataObj = {};
        
        formData.forEach(function(value, key) {
            formDataObj[key] = value;
        });

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

        // Simulate form submission (replace with actual API call)
        setTimeout(function() {
            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;

            // Show success message
            showNotification('Thank you! Your quote request has been submitted successfully. We will contact you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Optional: Redirect to WhatsApp
            const whatsappMessage = encodeURIComponent('Hi! I just submitted a quote request through your website. Looking forward to hearing from you!');
            setTimeout(function() {
                const confirmWhatsApp = confirm('Would you like to connect with us on WhatsApp for faster response?');
                if (confirmWhatsApp) {
                    window.open('https://wa.me/1234567890?text=' + whatsappMessage, '_blank');
                }
            }, 1000);
        }, 2000);
    }

    function validateFormField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
        } else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
        } else if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
        } else if (field.value.trim()) {
            field.classList.add('is-valid');
            field.classList.remove('is-invalid');
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    // ==========================================
    // Enquiry Button Functions
    // ==========================================
    function initializeEnquiryButtons() {
        const enquiryButtons = document.querySelectorAll('.btn-enquiry');
        
        enquiryButtons.forEach(function(button) {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                handleEnquiryClick(button);
            });
        });
    }

    function handleEnquiryClick(button) {
        const productCard = button.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.price-new').textContent;
        
        // Create WhatsApp message
        const message = encodeURIComponent(
            `Hi! I'm interested in ${productTitle} priced at ${productPrice}. Can you provide more details?`
        );
        
        // Scroll to quote form or open WhatsApp
        const userChoice = confirm(`Interested in ${productTitle}?\n\nClick OK to fill the quote form, or Cancel to contact us directly on WhatsApp.`);
        
        if (userChoice) {
            // Scroll to quote form
            const quoteSection = document.getElementById('quote');
            if (quoteSection) {
                quoteSection.scrollIntoView({ behavior: 'smooth' });
                
                // Pre-fill product type in form
                setTimeout(function() {
                    const productSelect = document.querySelector('#quoteForm select');
                    if (productSelect) {
                        const options = productSelect.querySelectorAll('option');
                        options.forEach(function(option) {
                            if (option.textContent.includes(productTitle.split(' ')[0])) {
                                option.selected = true;
                            }
                        });
                    }
                }, 500);
            }
        } else {
            // Open WhatsApp
            window.open('https://wa.me/1234567890?text=' + message, '_blank');
        }
    }

    // ==========================================
    // Smooth Scroll Functions
    // ==========================================
    function initializeSmoothScroll() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(function(link) {
            link.addEventListener('click', function(event) {
                const targetId = this.getAttribute('href');
                
                if (targetId === '#' || targetId === '') {
                    return;
                }
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    event.preventDefault();
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==========================================
    // Scroll Animations
    // ==========================================
    function initializeScrollAnimations() {
        const animateElements = document.querySelectorAll(
            '.feature-card, .product-card, .contact-card, .about-content'
        );
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(function() {
                        entry.target.style.transition = 'all 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animateElements.forEach(function(element) {
            observer.observe(element);
        });
    }

    // ==========================================
    // WhatsApp Button Functions
    // ==========================================
    function initializeWhatsAppButton() {
        const whatsappFloat = document.querySelector('.whatsapp-float');
        
        if (whatsappFloat) {
            // Add pulse animation
            setInterval(function() {
                whatsappFloat.style.animation = 'none';
                setTimeout(function() {
                    whatsappFloat.style.animation = 'pulse 2s ease-in-out';
                }, 10);
            }, 5000);
            
            // Track WhatsApp button clicks
            whatsappFloat.addEventListener('click', function() {
                console.log('WhatsApp button clicked');
                // Add analytics tracking here if needed
            });
        }
    }

    // ==========================================
    // Notification Functions
    // ==========================================
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification-toast`;
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        notification.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
        notification.style.animation = 'slideInRight 0.5s ease';
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-check-circle-fill me-2" style="font-size: 24px;"></i>
                <div>${message}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(function() {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(function() {
                notification.remove();
            }, 500);
        }, 5000);
    }

    // ==========================================
    // Utility Functions
    // ==========================================
    
    // Add custom CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
    `;
    document.head.appendChild(style);

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            console.log('Window resized');
            // Add any resize-specific functionality here
        }, 250);
    });

    // Back to top button functionality
    function createBackToTopButton() {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
        backToTop.className = 'back-to-top';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(backToTop);
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        backToTop.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        backToTop.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
    
    createBackToTopButton();

    // Console message
    console.log('%c🎨 Uniform Landing Page Loaded Successfully! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
    
})();