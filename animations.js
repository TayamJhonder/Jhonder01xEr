/* =====================================================
   ANIMATIONS.JS — PREMIUM GSAP Scroll & Hover Effects
   Full Motion + Typing Text Animations
   ===================================================== */

window.addEventListener('load', function() {
    
    // Add 'loaded' class for safety fallback
    document.body.classList.add('loaded');

    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    /* =====================================================
       UTILITY: Word-by-Word Typewriter Effect
       ===================================================== */
    function applyTypewriter(element, triggerEl, startPos) {
        if (!element) return;
        
        const originalHTML = element.innerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHTML;
        
        function wrapWords(node) {
            if (node.nodeType === 3) {
                const words = node.textContent.split(/(\s+)/);
                const fragment = document.createDocumentFragment();
                
                words.forEach(function(word) {
                    if (word.trim() !== '') {
                        const span = document.createElement('span');
                        span.textContent = word;
                        span.className = 'typewriter-word';
                        span.style.opacity = '0';
                        span.style.display = 'inline-block';
                        fragment.appendChild(span);
                    } else {
                        fragment.appendChild(document.createTextNode(word));
                    }
                });
                
                node.parentNode.replaceChild(fragment, node);
            } else if (node.nodeType === 1) {
                Array.from(node.childNodes).forEach(wrapWords);
            }
        }
        
        Array.from(tempDiv.childNodes).forEach(wrapWords);
        element.innerHTML = tempDiv.innerHTML;
        
        var words = element.querySelectorAll('.typewriter-word');
        gsap.set(words, { opacity: 0, y: 12, filter: 'blur(4px)' });
        
        ScrollTrigger.create({
            trigger: triggerEl || element,
            start: startPos || 'top 85%',
            once: true,
            onEnter: function() {
                element.classList.add('typing-active');
                gsap.to(words, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 0.25,
                    stagger: 0.04,
                    ease: 'power2.out',
                    onComplete: function() {
                        element.classList.remove('typing-active');
                    }
                });
            }
        });
    }

    /* =====================================================
       UTILITY: Animated Number Counter
       ===================================================== */
    function animateCounter(element, endValue, duration) {
        var obj = { val: 0 };
        var suffix = '';
        var numStr = endValue.toString();
        
        // Handle suffixes like "10+" or "154"
        if (numStr.indexOf('+') !== -1) {
            suffix = '+';
            numStr = numStr.replace('+', '');
        }
        
        var target = parseInt(numStr, 10);
        if (isNaN(target)) return;
        
        gsap.to(obj, {
            val: target,
            duration: duration || 2,
            ease: 'power2.out',
            onUpdate: function() {
                element.textContent = Math.floor(obj.val) + suffix;
            }
        });
    }

    /* =====================================================
       1. HERO SECTION — Cinematic Staggered Entrance
       ===================================================== */
    var heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    heroTimeline
        // Giant text slides up with slight scale
        .from('.giant-text', { 
            y: 120, 
            opacity: 0, 
            scale: 0.95,
            duration: 1.4,
            ease: 'expo.out'
        })
        // Stats slide in from left with stagger
        .from('.stats-left .stat-item', { 
            x: -60, 
            opacity: 0, 
            stagger: 0.25, 
            duration: 0.9,
            ease: 'back.out(1.2)'
        }, '-=0.9')
        // Profile image scales up dramatically
        .from('.profile-image-container', { 
            scale: 0.7, 
            opacity: 0, 
            duration: 1.2,
            ease: 'elastic.out(1, 0.5)'
        }, '-=0.7')
        // Info right slides in from right
        .from('.info-right > *', { 
            x: 80, 
            opacity: 0, 
            stagger: 0.12, 
            duration: 0.7,
            ease: 'power3.out'
        }, '-=0.8')
        // Greeting slides up
        .from('.greeting-bottom h1', { 
            y: 60, 
            opacity: 0, 
            duration: 0.9,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.greeting-bottom p', { 
            y: 40, 
            opacity: 0, 
            duration: 0.7,
            ease: 'power3.out'
        }, '-=0.5')
        // CTA button bounces in
        .from('.cta-btn', { 
            scale: 0.5, 
            opacity: 0, 
            duration: 0.8,
            ease: 'elastic.out(1, 0.4)'
        }, '-=0.3')
        // Scroll indicator fades up
        .from('.scroll-indicator', { 
            opacity: 0, 
            y: 30, 
            duration: 0.6 
        }, '-=0.2');

    // Animate stat numbers with counter effect
    var statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(function(num) {
        var originalText = num.textContent.trim();
        num.textContent = '0';
        
        ScrollTrigger.create({
            trigger: num,
            start: 'top 90%',
            once: true,
            onEnter: function() {
                animateCounter(num, originalText, 2.5);
            }
        });
    });

    /* =====================================================
       2. NAVBAR — Smooth Entrance
       ===================================================== */
    gsap.from('.navbar', {
        y: -100,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    /* =====================================================
       3. ABOUT SECTION — Premium Reveals
       ===================================================== */
    // Section header slides from left
    gsap.from('.about-header', { 
        scrollTrigger: { trigger: '.about-section', start: 'top 80%' }, 
        x: -100, 
        opacity: 0, 
        duration: 1.2,
        ease: 'power3.out'
    });

    // Section indicator number
    gsap.from('.about-header .section-indicator', { 
        scrollTrigger: { trigger: '.about-section', start: 'top 80%' }, 
        x: 60, 
        opacity: 0, 
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out'
    });

    // About graphic image slides in with rotation
    gsap.from('.about-graphic img', { 
        scrollTrigger: { trigger: '.about-section', start: 'top 70%' }, 
        x: -120, 
        rotation: -8,
        opacity: 0, 
        duration: 1.4,
        ease: 'power3.out'
    });

    // About text — typewriter effect
    var aboutTypewriter = document.getElementById('about-typewriter');
    if (aboutTypewriter) {
        applyTypewriter(aboutTypewriter, '.about-section', 'top 75%');
    }

    /* =====================================================
       4. METHODOLOGY SECTION — Dramatic Entrances
       ===================================================== */
    // Top label slides in
    gsap.from('.method-top-label', {
        scrollTrigger: { trigger: '.method-section', start: 'top 85%' },
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Title with split effect
    gsap.from('.method-title', { 
        scrollTrigger: { trigger: '.method-section', start: 'top 80%' }, 
        y: 100, 
        opacity: 0, 
        duration: 1.2,
        ease: 'expo.out'
    });

    // Step buttons stagger
    gsap.from('.step-btn', {
        scrollTrigger: { trigger: '.method-section', start: 'top 75%' },
        scale: 0,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: 'back.out(2)'
    });

    // Method cards with 3D flip entrance
    gsap.from('.method-card.card-left', { 
        scrollTrigger: { trigger: '.method-section', start: 'top 60%' }, 
        x: -80, 
        rotationY: 15,
        opacity: 0, 
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.method-card.card-right', { 
        scrollTrigger: { trigger: '.method-section', start: 'top 60%' }, 
        x: 80, 
        rotationY: -15,
        opacity: 0, 
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    });

    // Method portrait zooms in
    gsap.from('.method-portrait img', { 
        scrollTrigger: { trigger: '.method-section', start: 'top 60%' }, 
        scale: 0.6, 
        opacity: 0, 
        duration: 1.2,
        ease: 'elastic.out(1, 0.6)'
    });

    // Method card texts — typewriter effect on each visible card-text
    var methodCardTexts = document.querySelectorAll('.method-panel.active .card-text');
    methodCardTexts.forEach(function(el) {
        applyTypewriter(el, '.method-section', 'top 55%');
    });

    // Method subheader elements
    gsap.from('.method-subheader .subheader-left > *', {
        scrollTrigger: { trigger: '.method-section', start: 'top 70%' },
        x: -40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
    });

    gsap.from('.method-subheader .subheader-right > *', {
        scrollTrigger: { trigger: '.method-section', start: 'top 70%' },
        x: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
    });

    // Method footer slides up
    gsap.from('.method-footer', {
        scrollTrigger: { trigger: '.method-section', start: 'top 40%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    /* =====================================================
       5. PROJECTS SECTION — Staggered Grid Reveal
       ===================================================== */
    // Projects header
    gsap.from('.projects-header', {
        scrollTrigger: { trigger: '.projects-section', start: 'top 85%' },
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Project cards with staggered diagonal reveal
    var projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(function(card, i) {
        var direction = i % 2 === 0 ? -1 : 1;
        gsap.from(card, { 
            scrollTrigger: { trigger: card, start: 'top 88%' }, 
            y: 80, 
            x: 30 * direction,
            rotationZ: 2 * direction,
            opacity: 0, 
            duration: 0.9,
            delay: (i % 3) * 0.1,
            ease: 'power3.out'
        });
    });

    // Project card internal elements stagger
    projectCards.forEach(function(card) {
        gsap.from(card.querySelectorAll('.project-num, .project-lang, .project-title, .project-desc, .project-tags span'), {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            y: 20,
            opacity: 0,
            stagger: 0.05,
            duration: 0.5,
            delay: 0.3,
            ease: 'power2.out'
        });
    });

    /* =====================================================
       6. SKILLS SECTION — Arsenal Deployment Effect
       ===================================================== */
    // Top label
    gsap.from('.skills-top-label', {
        scrollTrigger: { trigger: '.skills-section', start: 'top 85%' },
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Title with dramatic entrance
    gsap.from('.skills-title', { 
        scrollTrigger: { trigger: '.skills-section', start: 'top 80%' }, 
        y: 100, 
        scale: 0.9,
        opacity: 0, 
        duration: 1.2,
        ease: 'expo.out'
    });

    // Skills description — typewriter effect
    var skillsDesc = document.querySelector('.skills-description p');
    if (skillsDesc) {
        applyTypewriter(skillsDesc, '.skills-section', 'top 75%');
    }

    // Capabilities header
    gsap.from('.skills-capabilities-header', {
        scrollTrigger: { trigger: '.skills-section', start: 'top 70%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Skill columns slide in from different directions
    var skillColumns = document.querySelectorAll('.skill-column');
    skillColumns.forEach(function(col, i) {
        gsap.from(col, { 
            scrollTrigger: { trigger: col, start: 'top 85%' }, 
            y: 80, 
            x: (i - 1) * 40,
            opacity: 0, 
            duration: 1,
            ease: 'power3.out'
        });

        // Individual skill items cascade in
        var items = col.querySelectorAll('.skill-item');
        items.forEach(function(item, j) {
            gsap.from(item, {
                scrollTrigger: { trigger: col, start: 'top 80%' },
                x: -40,
                opacity: 0,
                duration: 0.5,
                delay: 0.4 + j * 0.08,
                ease: 'power2.out'
            });
        });
    });

    // Skills footer
    gsap.from('.skills-footer', {
        scrollTrigger: { trigger: '.skills-section', start: 'bottom 90%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    /* =====================================================
       7. PARCOURS (ACADEMIC) SECTION — Timeline Cascade
       ===================================================== */
    // Top label
    gsap.from('.parcours-top-label', {
        scrollTrigger: { trigger: '.parcours-section', start: 'top 85%' },
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Title
    gsap.from('.parcours-title', {
        scrollTrigger: { trigger: '.parcours-section', start: 'top 80%' },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out'
    });

    // Description — typewriter
    var parcoursDesc = document.querySelector('.parcours-description p');
    if (parcoursDesc) {
        applyTypewriter(parcoursDesc, '.parcours-section', 'top 75%');
    }

    // School header
    gsap.from('.parcours-school-header', {
        scrollTrigger: { trigger: '.parcours-section', start: 'top 70%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Year blocks cascade from left with line connector effect
    var yearBlocks = document.querySelectorAll('.parcours-year');
    yearBlocks.forEach(function(year, i) {
        // Year header
        gsap.from(year.querySelector('.year-header'), {
            scrollTrigger: { trigger: year, start: 'top 85%' },
            x: -80,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out'
        });

        // Year description — typewriter
        var yearDesc = year.querySelector('.year-desc');
        if (yearDesc) {
            applyTypewriter(yearDesc, year, 'top 80%');
        }

        // Subject items cascade
        var subjects = year.querySelectorAll('.subject-item');
        subjects.forEach(function(subj, j) {
            gsap.from(subj, {
                scrollTrigger: { trigger: year, start: 'top 75%' },
                x: -50,
                opacity: 0,
                duration: 0.5,
                delay: 0.5 + j * 0.08,
                ease: 'power2.out'
            });
        });
    });

    /* =====================================================
       8. EVENTS SECTION — News Feed Entrance
       ===================================================== */
    // Top label
    gsap.from('.events-top-label', {
        scrollTrigger: { trigger: '.events-section', start: 'top 85%' },
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Title
    gsap.from('.events-title', {
        scrollTrigger: { trigger: '.events-section', start: 'top 80%' },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out'
    });

    // Author info slide in
    gsap.from('.events-description', {
        scrollTrigger: { trigger: '.events-section', start: 'top 75%' },
        x: -60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
    });

    // Subtitle and caption
    gsap.from('.events-subtitle', {
        scrollTrigger: { trigger: '.events-section', start: 'top 70%' },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
    });

    // Events caption — typewriter
    var eventsCaption = document.querySelector('.events-caption');
    if (eventsCaption) {
        applyTypewriter(eventsCaption, '.events-section', 'top 68%');
    }

    // Event items slide in from alternating sides
    var eventItems = document.querySelectorAll('.event-item');
    eventItems.forEach(function(item, i) {
        gsap.from(item, { 
            scrollTrigger: { trigger: item, start: 'top 90%' }, 
            x: i % 2 === 0 ? -60 : 60,
            y: 20,
            opacity: 0, 
            duration: 0.7,
            ease: 'power3.out'
        });

        // Event tags stagger
        var tags = item.querySelectorAll('.event-tag');
        gsap.from(tags, {
            scrollTrigger: { trigger: item, start: 'top 88%' },
            scale: 0,
            opacity: 0,
            stagger: 0.08,
            duration: 0.4,
            delay: 0.3,
            ease: 'back.out(2)'
        });
    });

    // Events footer
    gsap.from('.events-footer', {
        scrollTrigger: { trigger: '.events-section', start: 'bottom 90%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    /* =====================================================
       9. COMMIT SECTION — Data Dashboard Effect
       ===================================================== */
    // Top label
    gsap.from('.commit-top-label', {
        scrollTrigger: { trigger: '.commit-section', start: 'top 85%' },
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Title
    gsap.from('.commit-title', {
        scrollTrigger: { trigger: '.commit-section', start: 'top 80%' },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out'
    });

    // Description — typewriter
    var commitDesc = document.querySelector('.commit-description p');
    if (commitDesc) {
        applyTypewriter(commitDesc, '.commit-section', 'top 75%');
    }

    // Commit stats with counter animation
    var commitStats = document.querySelectorAll('.commit-stat');
    commitStats.forEach(function(stat, i) {
        gsap.from(stat, { 
            scrollTrigger: { trigger: stat, start: 'top 88%' }, 
            y: 60, 
            scale: 0.8,
            opacity: 0, 
            duration: 0.8,
            delay: i * 0.15,
            ease: 'back.out(1.5)'
        });

        // Animate the commit stat numbers
        var numEl = stat.querySelector('.commit-stat-number');
        if (numEl) {
            var originalVal = numEl.textContent.trim();
            numEl.textContent = '0';
            ScrollTrigger.create({
                trigger: stat,
                start: 'top 88%',
                once: true,
                onEnter: function() {
                    animateCounter(numEl, originalVal, 2);
                }
            });
        }
    });

    // Graph header
    gsap.from('.commit-graph-header', {
        scrollTrigger: { trigger: '.commit-section', start: 'top 65%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Contribution graph wrapper with dramatic reveal
    gsap.from('.commit-graph-wrapper', { 
        scrollTrigger: { trigger: '.commit-section', start: 'top 60%' }, 
        y: 80, 
        scaleY: 0.8,
        opacity: 0, 
        duration: 1.2,
        ease: 'power3.out'
    });

    // Graph squares cascade animation
    var graphRows = document.querySelectorAll('.graph-row');
    graphRows.forEach(function(row, i) {
        var squares = row.querySelectorAll('.gq');
        gsap.from(squares, {
            scrollTrigger: { trigger: '.commit-graph-wrapper', start: 'top 70%' },
            scale: 0,
            opacity: 0,
            stagger: 0.01,
            duration: 0.3,
            delay: i * 0.1,
            ease: 'back.out(1.5)'
        });
    });

    // Total contributions counter
    var totalNum = document.querySelector('.total-number');
    if (totalNum) {
        var totalVal = totalNum.textContent.trim();
        totalNum.textContent = '0';
        ScrollTrigger.create({
            trigger: '.commit-total',
            start: 'top 88%',
            once: true,
            onEnter: function() {
                animateCounter(totalNum, totalVal, 2.5);
            }
        });
    }

    // Commit buttons
    gsap.from('.commit-buttons', {
        scrollTrigger: { trigger: '.commit-section', start: 'bottom 95%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    /* =====================================================
       10. CERTIFICATIONS SECTION — Card Gallery
       ===================================================== */
    // Top label
    gsap.from('.certs-top-label', {
        scrollTrigger: { trigger: '.certs-section', start: 'top 85%' },
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Title
    gsap.from('.certs-title', {
        scrollTrigger: { trigger: '.certs-section', start: 'top 80%' },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out'
    });

    // Description — typewriter
    var certsDesc = document.querySelector('.certs-description p');
    if (certsDesc) {
        applyTypewriter(certsDesc, '.certs-section', 'top 75%');
    }

    // Registry header
    gsap.from('.certs-registry-header', {
        scrollTrigger: { trigger: '.certs-section', start: 'top 70%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Cert cards with staggered 3D entrance
    var certCards = document.querySelectorAll('.cert-card');
    certCards.forEach(function(card, i) {
        gsap.from(card, { 
            scrollTrigger: { trigger: card, start: 'top 90%' }, 
            y: 80, 
            rotationX: 15,
            opacity: 0, 
            duration: 0.9,
            delay: (i % 4) * 0.1,
            ease: 'power3.out',
            transformPerspective: 800
        });
    });

    // View more button
    gsap.from('.certs-view-more', {
        scrollTrigger: { trigger: '.certs-section', start: 'bottom 95%' },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
    });

    /* =====================================================
       11. CONTACT SECTION — Final Reveal
       ===================================================== */
    // Top label
    gsap.from('.contact-top-label', {
        scrollTrigger: { trigger: '.contact-section', start: 'top 85%' },
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Title with dramatic scale
    gsap.from('.contact-title', {
        scrollTrigger: { trigger: '.contact-section', start: 'top 80%' },
        y: 100,
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out'
    });

    // Contact caption — typewriter
    var contactCaption = document.querySelector('.contact-caption');
    if (contactCaption) {
        applyTypewriter(contactCaption, '.contact-section', 'top 75%');
    }

    // Contact links cascade with slide and stagger
    var contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(function(link, i) {
        gsap.from(link, { 
            scrollTrigger: { trigger: link, start: 'top 92%' }, 
            x: -80,
            opacity: 0, 
            duration: 0.8,
            delay: i * 0.12,
            ease: 'power3.out'
        });
    });

    // Contact footer
    gsap.from('.contact-footer', {
        scrollTrigger: { trigger: '.contact-section', start: 'bottom 95%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    /* =====================================================
       12. SECTION DECORATIVE ELEMENTS — Red dots & lines
       ===================================================== */
    // Red line vertical elements
    var redLines = document.querySelectorAll('.red-line-vertical');
    redLines.forEach(function(line) {
        gsap.from(line, {
            scrollTrigger: { trigger: line, start: 'top 85%' },
            scaleY: 0,
            transformOrigin: 'top center',
            duration: 0.8,
            ease: 'power3.out'
        });
    });

    /* =====================================================
       13. 3D TILT ON PROJECT CARDS (Premium Hover)
       ===================================================== */
    projectCards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / 12;
            var rotateY = (centerX - x) / 12;
            
            gsap.to(card, { 
                rotateX: rotateX, 
                rotateY: rotateY, 
                transformPerspective: 1000, 
                scale: 1.03,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                duration: 0.4, 
                ease: 'power2.out' 
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(card, { 
                rotateX: 0, 
                rotateY: 0, 
                scale: 1,
                boxShadow: 'none',
                duration: 0.6, 
                ease: 'elastic.out(1, 0.4)' 
            });
        });
    });

    /* =====================================================
       14. 3D TILT ON CERT CARDS
       ===================================================== */
    certCards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / 15;
            var rotateY = (centerX - x) / 15;
            
            gsap.to(card, { 
                rotateX: rotateX, 
                rotateY: rotateY, 
                transformPerspective: 800,
                scale: 1.05,
                duration: 0.4, 
                ease: 'power2.out' 
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(card, { 
                rotateX: 0, 
                rotateY: 0, 
                scale: 1,
                duration: 0.6, 
                ease: 'elastic.out(1, 0.4)' 
            });
        });
    });

    /* =====================================================
       15. MAGNETIC BUTTONS (Premium Hover)
       ===================================================== */
    var magneticButtons = document.querySelectorAll('.cta-btn, .engage-btn, .commit-btn-solid, .commit-btn-outline, .view-more-btn');
    magneticButtons.forEach(function(btn) {
        btn.addEventListener('mousemove', function(e) {
            var rect = btn.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: 'power2.out' });
        });
        
        btn.addEventListener('mouseleave', function() {
            gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
        });
    });

    /* =====================================================
       16. PARALLAX EFFECTS
       ===================================================== */
    // Hero profile parallax
    gsap.to('.profile-image-container', {
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1 },
        y: 120,
        ease: 'none'
    });

    // Giant text parallax (moves slower for depth)
    gsap.to('.giant-text', {
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1 },
        y: -60,
        ease: 'none'
    });

    // Stats parallax
    gsap.to('.stats-left', {
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1 },
        y: -40,
        ease: 'none'
    });

    // Info right parallax
    gsap.to('.info-right', {
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1 },
        y: -30,
        ease: 'none'
    });

    // About graphic parallax
    gsap.to('.about-graphic img', {
        scrollTrigger: { trigger: '.about-section', start: 'top bottom', end: 'bottom top', scrub: 1 },
        y: -40,
        ease: 'none'
    });

    // Decorative shapes
    gsap.to('.bg-shapes', {
        y: -20, duration: 3, repeat: -1, yoyo: true, ease: 'power1.inOut'
    });

    /* =====================================================
       17. SMOOTH SCROLL FOR NAVIGATION LINKS
       ===================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            
            if (href === '#' || href === '') return;
            
            var target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                var headerOffset = 80;
                var elementPosition = target.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* =====================================================
       18. GSAP TITLE SHINE EFFECT
       ===================================================== */
    var sectionTitles = document.querySelectorAll('.about-title, .method-title, .skills-title, .parcours-title, .events-title, .commit-title, .certs-title, .contact-title');
    
    sectionTitles.forEach(function(title) {
        gsap.fromTo(title, 
            { backgroundPosition: '100% 50%' },
            {
                backgroundPosition: '0% 50%',
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    /* =====================================================
       19. HOVER GLOW ON SKILL ITEMS
       ===================================================== */
    var skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            gsap.to(item, {
                x: 8,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(item.querySelector('.skill-name'), {
                color: '#d94141',
                duration: 0.3
            });
        });
        
        item.addEventListener('mouseleave', function() {
            gsap.to(item, {
                x: 0,
                duration: 0.4,
                ease: 'elastic.out(1, 0.5)'
            });
            gsap.to(item.querySelector('.skill-name'), {
                color: '',
                duration: 0.3
            });
        });
    });

    /* =====================================================
       20. HOVER EFFECT ON EVENT ITEMS
       ===================================================== */
    eventItems.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            gsap.to(item, {
                x: 12,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', function() {
            gsap.to(item, {
                x: 0,
                scale: 1,
                duration: 0.4,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });

    /* =====================================================
       21. HOVER EFFECT ON CONTACT LINKS
       ===================================================== */
    contactLinks.forEach(function(link) {
        link.addEventListener('mouseenter', function() {
            gsap.to(link, {
                x: 10,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(link.querySelector('.contact-arrow'), {
                x: 5,
                rotation: 45,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        link.addEventListener('mouseleave', function() {
            gsap.to(link, {
                x: 0,
                scale: 1,
                duration: 0.4,
                ease: 'elastic.out(1, 0.5)'
            });
            gsap.to(link.querySelector('.contact-arrow'), {
                x: 0,
                rotation: 0,
                duration: 0.4,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });

    /* =====================================================
       22. SCROLL PROGRESS INDICATOR (Red line at top)
       ===================================================== */
    var progressBar = document.createElement('div');
    progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#d94141,#ff6b6b);z-index:9999;width:0%;transition:none;pointer-events:none;';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

});
