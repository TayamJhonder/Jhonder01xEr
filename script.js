/* =====================================================
   SCRIPT.JS — Jhonder Tayam Portfolio
   =====================================================
   1. Certificate Modal
   2. Mobile Menu
   3. Pixel Dispersion Animation (DESKTOP ONLY)
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {

    /* =====================================================
       1. CERTIFICATE MODAL
       ===================================================== */
    const certCards = document.querySelectorAll('.cert-card.clickable');
    const modal = document.getElementById('certModal');
    const modalOverlay = document.getElementById('certModalOverlay');
    const modalClose = document.getElementById('certModalClose');
    const modalImage = document.getElementById('certModalImage');
    const modalId = document.getElementById('certModalId');
    const modalPlatform = document.getElementById('certModalPlatform');
    const modalTitle = document.getElementById('certModalTitle');
    const modalIssuer = document.getElementById('certModalIssuer');
    const modalDesc = document.getElementById('certModalDesc');

    if (certCards.length > 0 && modal) {
        certCards.forEach(card => {
            card.addEventListener('click', function() {
                const image = this.getAttribute('data-image');
                const title = this.getAttribute('data-title');
                const issuer = this.getAttribute('data-issuer');
                const desc = this.getAttribute('data-desc');
                const id = this.querySelector('.cert-id').textContent;
                const platform = this.querySelector('.cert-platform').textContent;

                modalImage.src = image;
                modalImage.alt = title;
                modalId.textContent = id;
                modalPlatform.textContent = platform;
                modalTitle.textContent = title;
                modalIssuer.textContent = issuer;
                modalDesc.textContent = desc;

                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    /* =====================================================
       2. MOBILE MENU
       ===================================================== */
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        if (mobileClose) {
            mobileClose.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* =====================================================
       3. PIXEL DISPERSION ANIMATION (DESKTOP ONLY)
       =====================================================
       - Bawat pixel ng image ay nag-spread out mula sa gitna
       - Tapos unti-unting nag-a-assemble pabalik sa tamang posisyon
       - May glitch effect habang nag-a-assemble
       - SA MOBILE: walang animation, static image agad
       ===================================================== */
    const canvas = document.getElementById('particleCanvas');
    const profileImage = document.getElementById('profileImage');

    if (!canvas || !profileImage) return;

    // ===== Check if mobile — kung mobile, huwag mag-animate =====
    function isMobile() {
        return window.matchMedia('(max-width: 768px)').matches;
    }

    // ===== Sa mobile, static image lang =====
    if (isMobile()) {
        profileImage.style.opacity = '1';
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');

    // ===== Configuration =====
    const PIXEL_SIZE = 3;
    const GAP = 0.5;
    const STEP = PIXEL_SIZE + GAP;
    const DISPERSION_DURATION = 1200;   // Tagal ng dispersion (spread out)
    const ASSEMBLY_DURATION = 2000;     // Tagal ng assembly (pabalik)
    const GLITCH_DURATION = 600;        // Tagal ng glitch effect

    // ===== State =====
    let pixels = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let animationStartTime = 0;
    let animationComplete = false;
    let animationFrameId = null;

    // ===== Easing =====
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // ===== Initialize =====
    function initAnimation() {
        const rect = profileImage.getBoundingClientRect();
        canvasWidth = rect.width;
        canvasHeight = rect.height;

        if (canvasWidth === 0 || canvasHeight === 0) {
            setTimeout(initAnimation, 100);
            return;
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = canvasWidth + 'px';
        canvas.style.height = canvasHeight + 'px';

        // Offscreen canvas para sa image sampling
        const offscreen = document.createElement('canvas');
        offscreen.width = canvasWidth;
        offscreen.height = canvasHeight;
        const offCtx = offscreen.getContext('2d');
        offCtx.drawImage(profileImage, 0, 0, canvasWidth, canvasHeight);

        const imageData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight);
        const data = imageData.data;

        pixels = [];

        // Sample pixels — marami at maliit
        for (let y = 0; y < canvasHeight; y += STEP) {
            for (let x = 0; x < canvasWidth; x += STEP) {
                const index = (y * canvasWidth + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                const a = data[index + 3];

                if (a > 50) {
                    // Random dispersion position — spread out mula sa target
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 100 + Math.random() * 300;
                    const dispersionX = x + Math.cos(angle) * distance;
                    const dispersionY = y + Math.sin(angle) * distance;

                    pixels.push({
                        x: x,
                        y: y,
                        targetX: x,
                        targetY: y,
                        dispersionX: dispersionX,
                        dispersionY: dispersionY,
                        r: r,
                        g: g,
                        b: b,
                        a: a / 255,
                        delay: Math.random() * 400,
                        glitchSeed: Math.random()
                    });
                }
            }
        }

        // Itago yung actual image
        profileImage.style.opacity = '0';

        animationStartTime = performance.now();
        animationComplete = false;

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(animate);
    }

    // ===== Animation Loop =====
    function animate(currentTime) {
        if (animationComplete) return;

        const elapsed = currentTime - animationStartTime;
        const totalDuration = DISPERSION_DURATION + ASSEMBLY_DURATION;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        let allSettled = true;

        pixels.forEach(p => {
            const localElapsed = Math.max(elapsed - p.delay, 0);

            // Phase 1: Dispersion (spread out) — 0 to 1
            const dispersionProgress = Math.min(localElapsed / DISPERSION_DURATION, 1);

            // Phase 2: Assembly (pabalik sa target) — 0 to 1
            const assemblyElapsed = Math.max(localElapsed - DISPERSION_DURATION, 0);
            const assemblyProgress = Math.min(assemblyElapsed / ASSEMBLY_DURATION, 1);

            if (assemblyProgress < 1) allSettled = false;

            let drawX, drawY, alpha;

            if (dispersionProgress < 1) {
                // ===== Phase 1: Dispersion =====
                const eased = easeOutCubic(dispersionProgress);
                drawX = p.targetX + (p.dispersionX - p.targetX) * eased;
                drawY = p.targetY + (p.dispersionY - p.targetY) * eased;
                alpha = p.a * (1 - eased * 0.7); // Nag-fa-fade habang nag-spread
            } else {
                // ===== Phase 2: Assembly =====
                const eased = easeOutCubic(assemblyProgress);
                drawX = p.dispersionX + (p.targetX - p.dispersionX) * eased;
                drawY = p.dispersionY + (p.targetY - p.dispersionY) * eased;
                alpha = p.a * (0.3 + eased * 0.7);
            }

            // ===== Glitch effect habang nag-a-assemble =====
            const isAssembling = dispersionProgress >= 1 && assemblyProgress < 1;
            if (isAssembling) {
                const glitchIntensity = (1 - assemblyProgress) * 0.8;
                if (p.glitchSeed > 0.85) {
                    drawX += (Math.random() - 0.5) * 20 * glitchIntensity;
                }
                if (p.glitchSeed > 0.92) {
                    drawY += (Math.random() - 0.5) * 12 * glitchIntensity;
                }
            }

            // Draw pixel
            ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha})`;
            ctx.fillRect(
                Math.floor(drawX),
                Math.floor(drawY),
                PIXEL_SIZE,
                PIXEL_SIZE
            );

            // Red glitch overlay
            if (isAssembling && p.glitchSeed > 0.95) {
                const glitchAlpha = (1 - assemblyProgress) * 0.5;
                ctx.fillStyle = `rgba(217, 65, 65, ${glitchAlpha})`;
                ctx.fillRect(
                    Math.floor(drawX - 1),
                    Math.floor(drawY),
                    PIXEL_SIZE,
                    PIXEL_SIZE
                );
            }
        });

        // ===== Check if complete =====
        if (allSettled && elapsed > totalDuration) {
            animationComplete = true;
            profileImage.style.opacity = '1';

            setTimeout(() => {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            }, 200);
            return;
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    // ===== Start kapag loaded na yung image =====
    if (profileImage.complete && profileImage.naturalWidth > 0) {
        setTimeout(initAnimation, 200);
    } else {
        profileImage.addEventListener('load', function() {
            setTimeout(initAnimation, 200);
        });
    }

    // ===== Handle Window Resize =====
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Kung naging mobile, i-reset
            if (isMobile()) {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                profileImage.style.opacity = '1';
                canvas.style.display = 'none';
                return;
            }

            // Kung desktop, i-restart
            canvas.style.display = 'block';
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            animationComplete = false;
            profileImage.style.opacity = '0';
            initAnimation();
        }, 300);
    });

});