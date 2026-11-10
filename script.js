/* =====================================================
   SCRIPT.JS — Jhonder Tayam Portfolio
   =====================================================
   1. Certificate Modal
   2. Mobile Menu
   3. Methodology Tab Switcher
   4. Iron Filings Effect (Fullscreen - Profile Picture)
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {

    /* =====================================================
       0. MOTION CONTROLS
       ===================================================== */
    (function initMotionControls() {
        const trigger = document.getElementById('motionControlsTrigger');
        const panel = document.getElementById('motionControlsPanel');
        const speedInput = document.getElementById('autoScrollSpeed');
        const speedOutput = document.getElementById('autoScrollSpeedValue');
        if (!trigger || !panel || !speedInput || !speedOutput) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            panel.querySelectorAll('[data-motion-toggle]').forEach(function(button) {
                button.setAttribute('aria-pressed', 'false');
                button.querySelector('.motion-toggle-state').textContent = 'OFF';
            });
        }

        trigger.addEventListener('click', function() {
            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', String(!expanded));
            panel.hidden = expanded;
        });

        panel.querySelectorAll('[data-motion-toggle]').forEach(function(button) {
            button.addEventListener('click', function() {
                const enabled = button.getAttribute('aria-pressed') !== 'true';
                button.setAttribute('aria-pressed', String(enabled));
                button.querySelector('.motion-toggle-state').textContent = enabled ? 'ON' : 'OFF';
                window.dispatchEvent(new CustomEvent(
                    button.dataset.motionToggle === 'swarm' ? 'swarm-setting-change' : 'auto-scroll-setting-change',
                    { detail: { enabled: enabled } }
                ));
            });
        });

        speedInput.addEventListener('input', function() {
            const speed = Number(speedInput.value);
            speedOutput.value = speed + ' px/s';
            speedOutput.textContent = speed + ' px/s';
            window.dispatchEvent(new CustomEvent('auto-scroll-speed-change', {
                detail: { speed: speed }
            }));
        });

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
                trigger.setAttribute('aria-expanded', 'false');
                panel.hidden = true;
                trigger.focus();
            }
        });

        document.addEventListener('pointerdown', function(event) {
            if (!event.target.closest('#motionControls') && trigger.getAttribute('aria-expanded') === 'true') {
                trigger.setAttribute('aria-expanded', 'false');
                panel.hidden = true;
            }
        });
    })();

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
       3. METHODOLOGY TAB SWITCHER
       ===================================================== */
    const stepBtns = document.querySelectorAll('.step-btn');
    const methodPanels = document.querySelectorAll('.method-panel');

    if (stepBtns.length > 0 && methodPanels.length > 0) {
        stepBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetStep = this.getAttribute('data-step');

                stepBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                methodPanels.forEach(panel => panel.classList.remove('active'));

                const targetPanel = document.querySelector(`.method-panel[data-panel="${targetStep}"]`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    }

    /* =====================================================
       4. IRON FILINGS EFFECT (Naka-attach sa Hero Section)
       ===================================================== */

    (function initIronFilings() {
        const canvas = document.getElementById('ironFilingsCanvas');
        const imgDesktop = document.getElementById('profileImgDesktop');
        const imgMobile = document.getElementById('profileImgMobile');

        if (!canvas) return;

        function getActiveImage() {
            if (window.innerWidth <= 768) {
                return (imgMobile && imgMobile.complete && imgMobile.naturalWidth > 0)
                    ? imgMobile
                    : imgDesktop;
            } else {
                return (imgDesktop && imgDesktop.complete && imgDesktop.naturalWidth > 0)
                    ? imgDesktop
                    : imgMobile;
            }
        }

        const ctx = canvas.getContext('2d', { desynchronized: true });
        const DPR = Math.min(1.25, window.devicePixelRatio || 1);

        const START_DELAY = 350;
        const ASSEMBLE_DURATION = 5200;
        const SCATTER_DURATION = 0.26;
        const PROFILE_SHAPE_PROGRESS = 0.76;
        const IMAGE_REVEAL_PROGRESS = 0.9;
        const MAX_PARTICLES = 2600;
        const WEB_NODE_RADIUS = 2;

        let particles = [];
        let loadingNodes = [];
        let loadingLinks = [];
        let loadingFrame = 0;
        let imgRect = { x: 0, y: 0, w: 0, h: 0 };

        let state = {
            running: false,
            loadingAnimation: false,
            starting: false,
            phaseStart: 0,
            progress: 0,
            finished: false,
            imageRevealStarted: false,
            activeImg: null
        };

        function resizeCanvas() {
            const parent = canvas.parentElement;
            const W = parent ? parent.clientWidth : window.innerWidth;
            const H = parent ? parent.clientHeight : window.innerHeight;

            canvas.width = W * DPR;
            canvas.height = H * DPR;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(DPR, DPR);
        }

        function clearCanvas() {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }

        function createLoadingWeb() {
            const width = canvas.clientWidth || window.innerWidth;
            const height = canvas.clientHeight || window.innerHeight;
            const nodeCount = Math.min(900, Math.max(540, Math.round(width * height / 1200)));

            loadingNodes = [];
            loadingLinks = [];

            for (let i = 0; i < nodeCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.45 + Math.random() * 0.75;
                loadingNodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    targetX: null,
                    targetY: null,
                    sourceX: null,
                    sourceY: null,
                    phase: Math.random() * Math.PI * 2
                });
            }

            const linkedPairs = new Set();
            for (let i = 0; i < loadingNodes.length; i++) {
                const node = loadingNodes[i];
                const nearest = [];

                for (let j = 0; j < i; j++) {
                    const other = loadingNodes[j];
                    const distance = Math.hypot(other.x - node.x, other.y - node.y);
                    if (distance < 150) nearest.push({ index: j, distance: distance });
                }

                nearest.sort(function(a, b) {
                    return a.distance - b.distance;
                });

                for (let j = 0; j < Math.min(2, nearest.length); j++) {
                    const otherIndex = nearest[j].index;
                    const key = otherIndex + ':' + i;
                    if (linkedPairs.has(key)) continue;
                    linkedPairs.add(key);
                    loadingLinks.push({
                        a: otherIndex,
                        b: i,
                        opacity: Math.max(0.12, 0.48 * (1 - nearest[j].distance / 150))
                    });
                }
            }
        }

        function animateLoadingWeb() {
            if (!state.loadingAnimation) return;
            if (!document.hidden) {
                clearCanvas();
                drawLoadingWeb();
            }

            loadingFrame = requestAnimationFrame(animateLoadingWeb);
        }

        function drawLoadingWeb() {
            const width = canvas.clientWidth || window.innerWidth;
            const height = canvas.clientHeight || window.innerHeight;

            for (let i = 0; i < loadingNodes.length; i++) {
                const node = loadingNodes[i];
                if (state.running && node.targetX !== null) {
                    if (state.progress < SCATTER_DURATION) {
                        const scatter = state.progress / SCATTER_DURATION;
                        node.x = node.sourceX + node.vx * scatter * 78;
                        node.y = node.sourceY + node.vy * scatter * 78;
                    } else {
                        const gather = Math.min(1, (state.progress - SCATTER_DURATION) / (PROFILE_SHAPE_PROGRESS - SCATTER_DURATION));
                        const eased = 1 - Math.pow(1 - gather, 3);
                        const scatterX = node.sourceX + node.vx * 78;
                        const scatterY = node.sourceY + node.vy * 78;
                        const drift = Math.sin(gather * Math.PI * 3 + node.phase) * 18 * (1 - eased);
                        node.x = scatterX + (node.targetX - scatterX) * eased + drift;
                        node.y = scatterY + (node.targetY - scatterY) * eased - drift * 0.55;
                    }
                } else {
                    node.x += node.vx;
                    node.y += node.vy;
                    if (node.x < 0 || node.x > width) {
                        node.vx *= -1;
                        node.x = Math.max(0, Math.min(width, node.x));
                    }
                    if (node.y < 0 || node.y > height) {
                        node.vy *= -1;
                        node.y = Math.max(0, Math.min(height, node.y));
                    }
                }
            }

            const lineBuckets = [[], [], [], []];
            for (let i = 0; i < loadingLinks.length; i++) {
                const link = loadingLinks[i];
                const bucket = Math.min(3, Math.floor(link.opacity * 4));
                lineBuckets[bucket].push(link);
            }

            for (let bucket = 0; bucket < lineBuckets.length; bucket++) {
                if (!lineBuckets[bucket].length) continue;
                ctx.beginPath();
                for (let i = 0; i < lineBuckets[bucket].length; i++) {
                    const link = lineBuckets[bucket][i];
                    const a = loadingNodes[link.a];
                    const b = loadingNodes[link.b];
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                }
                ctx.strokeStyle = 'rgba(38, 42, 48, ' + ((bucket + 1) * 0.12) + ')';
                ctx.lineWidth = 1.25;
                ctx.stroke();
            }

            ctx.beginPath();
            for (let i = 0; i < loadingNodes.length; i++) {
                const node = loadingNodes[i];
                ctx.moveTo(node.x + WEB_NODE_RADIUS, node.y);
                ctx.arc(node.x, node.y, WEB_NODE_RADIUS, 0, Math.PI * 2);
            }
            ctx.fillStyle = '#111';
            ctx.fill();
        }

        function prepareLoadingTargets() {
            if (!particles.length) return;

            for (let i = 0; i < loadingNodes.length; i++) {
                const node = loadingNodes[i];
                const targetIndex = Math.min(particles.length - 1, Math.floor((i + 0.5) * particles.length / loadingNodes.length));
                const target = particles[targetIndex];
                node.sourceX = node.x;
                node.sourceY = node.y;
                node.targetX = target.tx;
                node.targetY = target.ty;
            }
        }

        function stopLoadingWeb(clear = true) {
            state.loadingAnimation = false;
            cancelAnimationFrame(loadingFrame);
            if (clear) {
                loadingNodes.length = 0;
                loadingLinks.length = 0;
                clearCanvas();
            }
        }

        function startLoadingWeb() {
            canvas.style.visibility = 'visible';
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            resizeCanvas();
            createLoadingWeb();
            state.loadingAnimation = true;
            loadingFrame = requestAnimationFrame(animateLoadingWeb);
        }

        function computeImageRect() {
            const activeImg = getActiveImage();
            if (!activeImg) return;

            const canvasRect = canvas.getBoundingClientRect();
            const imgRectRaw = activeImg.getBoundingClientRect();

            imgRect.x = imgRectRaw.left - canvasRect.left;
            imgRect.y = imgRectRaw.top - canvasRect.top;
            imgRect.w = imgRectRaw.width;
            imgRect.h = imgRectRaw.height;
        }

        function start() {
            if (state.starting || state.finished) return;
            resizeCanvas();
            computeImageRect();

            const activeImg = getActiveImage();
            if (!activeImg || !activeImg.complete || activeImg.naturalWidth === 0) return;

            state.starting = true;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                stopLoadingWeb();
                activeImg.style.opacity = '1';
                canvas.style.visibility = 'hidden';
                state.finished = true;
                window.dispatchEvent(new Event('profile-assembly-complete'));
                return;
            }

            activeImg.style.transition = 'opacity 0.2s ease-out';
            activeImg.style.opacity = '0';

            initParticles(activeImg, function() {
                if (state.finished) return;
                setTimeout(function() {
                    prepareLoadingTargets();
                    stopLoadingWeb(false);
                    state.running = true;
                    state.phaseStart = performance.now();
                    window.dispatchEvent(new Event('profile-assembly-start'));
                    animate();
                }, START_DELAY);
            });
        }

        function initParticles(img, onComplete) {
            const iw = img.naturalWidth;
            const ih = img.naturalHeight;
            const sampleScale = Math.min(1, Math.sqrt(MAX_PARTICLES / (iw * ih)));
            const sampleWidth = Math.max(1, Math.floor(iw * sampleScale));
            const sampleHeight = Math.max(1, Math.floor(ih * sampleScale));

            const off = document.createElement('canvas');
            off.width = sampleWidth;
            off.height = sampleHeight;
            const offCtx = off.getContext('2d', { willReadFrequently: true });
            offCtx.drawImage(img, 0, 0, sampleWidth, sampleHeight);

            let data;
            try {
                data = offCtx.getImageData(0, 0, sampleWidth, sampleHeight).data;
            } catch (e) {
                console.warn('Could not read profile image pixels for particle animation.', e);
                stopLoadingWeb();
                img.style.transition = 'none';
                img.style.opacity = '1';
                canvas.style.visibility = 'hidden';
                state.finished = true;
                window.dispatchEvent(new Event('profile-assembly-complete'));
                return;
            }

            particles = [];
            const scaleX = imgRect.w / sampleWidth;
            const scaleY = imgRect.h / sampleHeight;
            const screenW = canvas.clientWidth || window.innerWidth;
            const screenH = canvas.clientHeight || window.innerHeight;

            let sampleY = 0;
            const rowsPerBatch = Math.max(1, Math.floor(350 / sampleWidth));

            function processBatch() {
                const batchEndY = Math.min(sampleHeight, sampleY + rowsPerBatch);
                for (; sampleY < batchEndY; sampleY++) {
                    for (let x = 0; x < sampleWidth; x++) {
                        const idx = (sampleY * sampleWidth + x) * 4;
                        const a = data[idx + 3];

                        if (a < 20) continue;

                        const tx = imgRect.x + (x + 0.5) * scaleX;
                        const ty = imgRect.y + (sampleY + 0.5) * scaleY;

                        const sx = Math.random() * screenW;
                        const sy = Math.random() * screenH;
                        const bendX = (Math.random() - 0.5) * 200;
                        const bendY = (Math.random() - 0.5) * 200;

                        const particle = {
                            sx: sx,
                            sy: sy,
                            tx: tx,
                            ty: ty,
                            x: sx,
                            y: sy,
                            delay: Math.random() * 0.08,
                            duration: 0.82 + Math.random() * 0.06,
                            swirlAmp: 20 + Math.random() * 36,
                            swirlPhase: Math.random() * Math.PI * 2,
                            curveX: bendX,
                            curveY: bendY,
                            driftX: 8 + Math.random() * 16,
                            driftY: 8 + Math.random() * 16,
                            localT: 0,
                            phase: Math.random() * Math.PI * 2
                        };
                        particles.push(particle);
                    }
                }

                if (sampleY < sampleHeight) {
                    requestAnimationFrame(processBatch);
                    return;
                }

                state.activeImg = img;
                onComplete();
            }

            processBatch();
        }

        function animate() {
            if (!state.running) return;

            const now = performance.now();
            const elapsed = now - state.phaseStart;
            state.progress = Math.min(1, elapsed / ASSEMBLE_DURATION);

            if (state.progress >= IMAGE_REVEAL_PROGRESS && !state.imageRevealStarted && state.activeImg) {
                state.imageRevealStarted = true;
                state.activeImg.style.transition = 'opacity 0.65s ease-out';
                state.activeImg.style.opacity = '1';
            }

            if (state.progress >= 1 && !state.finished) {
                state.finished = true;
                state.running = false;

                if (state.activeImg) {
                    state.activeImg.style.transition = 'none';
                    state.activeImg.style.opacity = '1';
                }

                clearCanvas();
                loadingNodes.length = 0;
                loadingLinks.length = 0;
                particles.length = 0;
                canvas.style.visibility = 'hidden';
                window.dispatchEvent(new Event('profile-assembly-complete'));

                return;
            }

            clearCanvas();
            drawLoadingWeb();
            updateParticles();
            requestAnimationFrame(animate);
        }

        function updateParticles() {
            const t = state.progress;
            const len = particles.length;
            const gatherProgress = Math.max(0, Math.min(1, (t - SCATTER_DURATION) / (1 - SCATTER_DURATION)));

            for (let i = 0; i < len; i++) {
                const p = particles[i];

                let localT = (gatherProgress - p.delay) / p.duration;
                localT = Math.max(0, Math.min(1, localT));
                p.localT = localT;

                const ease = 1 - Math.pow(1 - localT, 4);

                let px = p.sx * (1 - ease) + p.tx * ease;
                let py = p.sy * (1 - ease) + p.ty * ease;

                const curveFactor = Math.sin(localT * Math.PI);
                px += p.curveX * curveFactor * (1 - ease);
                py += p.curveY * curveFactor * (1 - ease);

                const swirlFade = Math.pow(1 - localT, 1.4);
                const swirlAngle = localT * Math.PI * 2.4 + p.swirlPhase;
                px += Math.sin(swirlAngle) * p.swirlAmp * swirlFade;
                py += Math.cos(swirlAngle) * p.swirlAmp * 0.65 * swirlFade;

                if (t < SCATTER_DURATION) {
                    const drift = t * 9 + p.phase;
                    p.x = p.sx + Math.sin(drift) * p.driftX;
                    p.y = p.sy + Math.cos(drift * 0.83) * p.driftY;
                } else {
                    p.x = px;
                    p.y = py;
                }
            }
        }

        function drawEnergyPulse() {
            const cx = imgRect.x + imgRect.w / 2;
            const cy = imgRect.y + imgRect.h / 2;
            const baseRadius = Math.max(imgRect.w, imgRect.h) * 0.28;
            const maxRadius = Math.hypot(canvas.clientWidth, canvas.clientHeight) * 0.58;
            const pulses = [0.02, 0.2];

            for (let i = 0; i < pulses.length; i++) {
                const pulseProgress = (state.progress - pulses[i]) / 0.38;
                if (pulseProgress <= 0 || pulseProgress >= 1) continue;

                const eased = 1 - Math.pow(1 - pulseProgress, 3);
                const radius = baseRadius + (maxRadius - baseRadius) * eased;
                const alpha = Math.sin(pulseProgress * Math.PI) * 0.24;

                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, ' + alpha + ')';
                ctx.lineWidth = 2.5 * (1 - pulseProgress) + 0.5;
                ctx.stroke();
            }

            const chargeProgress = (state.progress - 0.16) / 0.54;
            if (chargeProgress > 0 && chargeProgress < 1) {
                const radius = baseRadius * (1.25 + chargeProgress * 0.22);
                ctx.beginPath();
                ctx.setLineDash([12, 16]);
                ctx.lineDashOffset = -state.progress * 180;
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, ' + Math.sin(chargeProgress * Math.PI) * 0.3 + ')';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        function waitAndStart() {
            let assemblyScheduled = false;

            function scheduleAssembly() {
                if (document.readyState !== 'complete' || state.starting || state.finished || assemblyScheduled) return;

                const activeImg = getActiveImage();
                if (!activeImg || !activeImg.complete || activeImg.naturalWidth === 0) return;

                assemblyScheduled = true;
                window.setTimeout(function() {
                    assemblyScheduled = false;
                    start();
                }, START_DELAY);
            }

            [imgDesktop, imgMobile].forEach(function(img) {
                if (!img) return;
                img.style.opacity = '0';
                img.addEventListener('load', scheduleAssembly);
                img.addEventListener('error', function() {
                    console.warn('⚠️ Hindi ma-load ang profile image');
                    scheduleAssembly();
                });
            });

            window.addEventListener('load', scheduleAssembly, { once: true });
            scheduleAssembly();
        }

        let resizeTimeout;
        window.addEventListener('resize', function() {
            if (state.finished) return;
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                resizeCanvas();
                if (state.loadingAnimation) {
                    createLoadingWeb();
                } else {
                    computeImageRect();
                }
            }, 250);
        });

        startLoadingWeb();
        waitAndStart();

    })();
    
    /* =====================================================
       5. PROFESSIONAL SCROLL & UI ENHANCEMENTS
       ===================================================== */
    (function initUIEnhancements() {
        const navbar = document.getElementById('navbar');

        // Scroll listener for Navbar
        function handleScroll() {
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;

            if (navbar) {
                if (scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    })();

    /* =====================================================
       6. SLOW, REVERSING AUTO-SCROLL
       ===================================================== */
    (function initAutoScroll() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        let maxSpeed = 210;
        const ACCELERATION = 180;
        const RESUME_DELAY = 6000;
        let direction = 1;
        let paused = false;
        let enabled = !prefersReducedMotion.matches;
        let lastFrame = 0;
        let velocity = 0;
        let started = false;
        let scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        let resumeTimer;

        function pauseForInteraction(event) {
            if (event && event.target.closest && event.target.closest('#motionControls')) return;
            paused = true;
            document.documentElement.classList.remove('auto-scroll-running');
            lastFrame = 0;
            velocity = 0;
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            clearTimeout(resumeTimer);
            resumeTimer = setTimeout(function() {
                scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                paused = false;
                if (enabled) document.documentElement.classList.add('auto-scroll-running');
            }, RESUME_DELAY);
        }

        function animateScroll(timestamp) {
            if (!lastFrame) lastFrame = timestamp;
            const elapsed = Math.min((timestamp - lastFrame) / 1000, 0.05);
            lastFrame = timestamp;

            if (enabled && !paused && !document.hidden) {
                const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
                const distanceToEnd = direction > 0 ? maxScroll - scrollPosition : scrollPosition;
                const brakingSpeed = Math.sqrt(Math.max(0, distanceToEnd * 2 * ACCELERATION));
                const desiredVelocity = direction * Math.min(maxSpeed, brakingSpeed);
                const maxVelocityChange = ACCELERATION * elapsed;
                velocity += Math.max(-maxVelocityChange, Math.min(maxVelocityChange, desiredVelocity - velocity));
                scrollPosition += velocity * elapsed;

                if (distanceToEnd <= 0.5 && Math.abs(velocity) <= maxVelocityChange) {
                    scrollPosition = direction > 0 ? maxScroll : 0;
                    direction *= -1;
                    velocity = 0;
                }

                window.scrollTo({ top: scrollPosition, behavior: 'instant' });
            }

            requestAnimationFrame(animateScroll);
        }

        function setEnabled(nextEnabled) {
            enabled = nextEnabled;
            clearTimeout(resumeTimer);
            paused = false;
            velocity = 0;
            lastFrame = 0;
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            if (enabled && started) {
                document.documentElement.classList.add('auto-scroll-running');
            } else {
                document.documentElement.classList.remove('auto-scroll-running');
            }
        }

        function startAutoScroll() {
            if (started) return;
            started = true;
            if (enabled) document.documentElement.classList.add('auto-scroll-running');
            lastFrame = 0;
            velocity = 0;
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            requestAnimationFrame(animateScroll);
        }

        window.addEventListener('auto-scroll-setting-change', function(event) {
            setEnabled(Boolean(event.detail.enabled));
        });
        window.addEventListener('auto-scroll-speed-change', function(event) {
            const requestedSpeed = Number(event.detail.speed);
            if (Number.isFinite(requestedSpeed)) maxSpeed = Math.max(80, Math.min(320, requestedSpeed));
        });
        window.addEventListener('wheel', pauseForInteraction, { passive: true });
        window.addEventListener('touchstart', pauseForInteraction, { passive: true });
        window.addEventListener('pointerdown', pauseForInteraction, { passive: true });
        window.addEventListener('keydown', pauseForInteraction);
        window.addEventListener('profile-assembly-complete', startAutoScroll, { once: true });
    })();

});