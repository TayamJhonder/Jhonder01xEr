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

        const ctx = canvas.getContext('2d');
        const DPR = Math.min(2, window.devicePixelRatio || 1);

        const START_DELAY = 10;
        const ASSEMBLE_DURATION = 3800;
        const SAMPLE_STEP = 3;

        let particles = [];
        let imgRect = { x: 0, y: 0, w: 0, h: 0 };

        let state = {
            running: false,
            phaseStart: 0,
            progress: 0,
            finished: false,
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
            resizeCanvas();
            computeImageRect();

            const activeImg = getActiveImage();
            if (!activeImg || activeImg.naturalWidth === 0) {
                setTimeout(start, 100);
                return;
            }

            activeImg.style.transition = 'opacity 0.2s ease-out';
            activeImg.style.opacity = '0';

            initParticles(activeImg);

            setTimeout(function() {
                state.running = true;
                state.phaseStart = performance.now();
                animate();
            }, START_DELAY);
        }

        function initParticles(img) {
            const iw = img.naturalWidth;
            const ih = img.naturalHeight;

            const off = document.createElement('canvas');
            off.width = iw;
            off.height = ih;
            const offCtx = off.getContext('2d', { willReadFrequently: true });
            offCtx.drawImage(img, 0, 0, iw, ih);

            let data;
            try {
                data = offCtx.getImageData(0, 0, iw, ih).data;
            } catch (e) {
                data = null;
            }

            particles = [];

            const scaleX = imgRect.w / iw;
            const scaleY = imgRect.h / ih;
            const particleSize = Math.max(1.5, SAMPLE_STEP * scaleX * 1.4);

            const cx = imgRect.x + imgRect.w / 2;
            const cy = imgRect.y + imgRect.h / 2;

            const screenW = canvas.clientWidth || window.innerWidth;
            const screenH = canvas.clientHeight || window.innerHeight;
            const screenDiag = Math.sqrt(screenW * screenW + screenH * screenH);

            const minDist = screenDiag * 0.65;
            const maxDist = screenDiag * 0.95;

            if (!data) return;

            for (let y = 0; y < ih; y += SAMPLE_STEP) {
                for (let x = 0; x < iw; x += SAMPLE_STEP) {
                    const idx = (y * iw + x) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    const a = data[idx + 3];

                    if (a < 20) continue;

                    const tx = imgRect.x + x * scaleX + (SAMPLE_STEP * scaleX) / 2;
                    const ty = imgRect.y + y * scaleY + (SAMPLE_STEP * scaleY) / 2;

                    let dirX = tx - cx;
                    let dirY = ty - cy;
                    const dirLen = Math.sqrt(dirX * dirX + dirY * dirY) + 0.001;
                    dirX /= dirLen;
                    dirY /= dirLen;

                    const angleVar = (Math.random() - 0.5) * 1.0;
                    const cosA = Math.cos(angleVar);
                    const sinA = Math.sin(angleVar);
                    const fdx = dirX * cosA - dirY * sinA;
                    const fdy = dirX * sinA + dirY * cosA;

                    const distFromCenter = minDist + Math.random() * (maxDist - minDist);

                    const sx = cx + fdx * distFromCenter;
                    const sy = cy + fdy * distFromCenter;

                    const alpha = a / 255;
                    const colorString = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';

                    particles.push({
                        sx: sx,
                        sy: sy,
                        tx: tx,
                        ty: ty,
                        x: sx,
                        y: sy,
                        color: colorString,
                        size: particleSize,
                        delay: Math.random() * 0.4,
                        duration: 0.55 + Math.random() * 0.4,
                        startAngle: (Math.random() - 0.5) * Math.PI * 2,
                        swirlAmp: 15 + Math.random() * 40,
                        swirlPhase: Math.random() * Math.PI * 2,
                        curveX: (Math.random() - 0.5) * 120,
                        curveY: (Math.random() - 0.5) * 120
                    });
                }
            }

            state.activeImg = img;
        }

        function animate() {
            if (!state.running) return;

            const now = performance.now();
            const elapsed = now - state.phaseStart;
            state.progress = Math.min(1, elapsed / ASSEMBLE_DURATION);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            updateParticles();
            drawParticles();

            if (state.progress >= 1 && !state.finished) {
                state.finished = true;
                state.running = false;

                if (state.activeImg) {
                    state.activeImg.style.opacity = '1';
                }

                setTimeout(function() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }, 250);

                return;
            }

            requestAnimationFrame(animate);
        }

        function updateParticles() {
            const t = state.progress;
            const len = particles.length;

            for (let i = 0; i < len; i++) {
                const p = particles[i];

                let localT = (t - p.delay) / p.duration;
                if (localT < 0) localT = 0;
                else if (localT > 1) localT = 1;

                const ease = 1 - Math.pow(1 - localT, 5);

                let px = p.sx * (1 - ease) + p.tx * ease;
                let py = p.sy * (1 - ease) + p.ty * ease;

                const curveFactor = Math.sin(localT * Math.PI);
                px += p.curveX * curveFactor * (1 - ease);
                py += p.curveY * curveFactor * (1 - ease);

                const swirlFade = (1 - localT) * (1 - localT);
                px += Math.sin(localT * Math.PI * 2 + p.swirlPhase) * p.swirlAmp * swirlFade;
                py += Math.cos(localT * Math.PI * 2 + p.swirlPhase) * p.swirlAmp * 0.5 * swirlFade;

                p.x = px;
                p.y = py;
                p.angle = p.startAngle * (1 - ease);
            }
        }

        function drawParticles() {
            const len = particles.length;
            const W = canvas.clientWidth || window.innerWidth;
            const H = canvas.clientHeight || window.innerHeight;

            for (let i = 0; i < len; i++) {
                const p = particles[i];

                if (p.x < -100 || p.x > W + 100 || p.y < -100 || p.y > H + 100) continue;

                if (Math.abs(p.angle) < 0.05) {
                    ctx.fillStyle = p.color;
                    const half = p.size / 2;
                    ctx.fillRect(p.x - half, p.y - half, p.size, p.size);
                } else {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.angle);
                    ctx.strokeStyle = p.color;
                    ctx.lineWidth = p.size;
                    ctx.lineCap = 'round';
                    const lineLen = p.size * 2.8;
                    ctx.beginPath();
                    ctx.moveTo(-lineLen / 2, 0);
                    ctx.lineTo(lineLen / 2, 0);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }

        function waitAndStart() {
            const activeImg = getActiveImage();
            if (!activeImg) return;

            if (activeImg.complete && activeImg.naturalWidth > 0) {
                start();
            } else {
                activeImg.addEventListener('load', start, { once: true });
                activeImg.addEventListener('error', function() {
                    console.warn('⚠️ Hindi ma-load ang profile image');
                }, { once: true });
            }
        }

        let resizeTimeout;
        window.addEventListener('resize', function() {
            if (state.finished) return;
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                resizeCanvas();
                computeImageRect();
            }, 250);
        });

        waitAndStart();

    })();

});