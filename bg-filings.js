/* =====================================================
   BG-FILINGS.JS — Background Image Grid Marquee
   ===================================================== */

(function initBackgroundMarquee() {
    const container = document.getElementById('bgMarqueeContainer');
    if (!container) return;

    const LOGO_SRC = 'logo.png';
    const ROWS = 7;
    const ITEMS_PER_ROW = 25;
    const DURATION = 120;

    container.innerHTML = '';

    for (let r = 0; r < ROWS; r++) {
        const row = document.createElement('div');
        row.className = 'bg-marquee-row ' + (r % 2 === 0 ? 'left-to-right' : 'right-to-left');

        for (let i = 0; i < ITEMS_PER_ROW * 2; i++) {
            const item = document.createElement('div');
            item.className = 'bg-marquee-item';

            const img = document.createElement('img');
            img.src = LOGO_SRC;
            img.alt = '';
            img.draggable = false;

            item.appendChild(img);
            row.appendChild(item);
        }

        container.appendChild(row);
    }

    const style = document.createElement('style');
    style.textContent = `
        .bg-marquee-row.left-to-right {
            animation-duration: ${DURATION}s;
        }
        .bg-marquee-row.right-to-left {
            animation-duration: ${DURATION}s;
        }
    `;
    document.head.appendChild(style);

})();