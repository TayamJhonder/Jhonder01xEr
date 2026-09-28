/* =====================================================
   SCRIPT.JS — Jhonder Tayam Portfolio
   =====================================================
   1. Certificate Modal
   2. Mobile Menu
   3. Methodology Tab Switcher
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

});