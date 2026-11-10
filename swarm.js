/* =====================================================
   SWARM.JS — subtle, natural cursor flight
   ===================================================== */

(function initSwarmRebuild() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const textSelector = 'h1, h2, h3, h4, h5, h6, p, a, button, label, li, td, th, blockquote, figcaption, summary, .stat-item, .location-tag, .role-info, .skill-name, .project-title, .project-desc, .cert-id, .cert-platform, .scroll-text, .section-indicator';
    const colors = ['#d94141', '#178600', '#4F5D95', '#b07219', '#3572A5', '#e34c26'];
    const cursorLayer = document.createElement('div');
    const agents = [];
    const activeMarquees = new Map();
    const recentlyBoxed = new Map();
    const MAX_AGENTS = 21;
    let textTargets = [];
    let resizeFrame = 0;
    let profileReady = false;
    let swarmEnabled = !prefersReducedMotion.matches;
    let lastScrollChase = 0;
    let nextChasingAgent = 0;
    let observer;

    cursorLayer.className = 'swarm-cursor-layer';
    cursorLayer.setAttribute('aria-hidden', 'true');
    cursorLayer.style.visibility = 'hidden';
    document.body.appendChild(cursorLayer);

    function viewportSize() {
        const viewport = window.visualViewport;
        return {
            width: Math.round(viewport ? viewport.width : document.documentElement.clientWidth),
            height: Math.round(viewport ? viewport.height : window.innerHeight)
        };
    }

    function safeInsets(viewport) {
        return {
            x: Math.min(24, viewport.width / 10),
            y: Math.min(24, viewport.height / 10)
        };
    }

    function targetAgentCount() {
        return Math.min(MAX_AGENTS, Math.max(5, Math.ceil(viewportSize().width / 65)));
    }

    function refreshTextTargets() {
        const excluded = '[aria-hidden="true"], svg, canvas, .fa, .fas, .far, .fab, .separator, .bg-marquee-container, .iron-filings-canvas, .swarm-cursor-layer';
        textTargets = Array.from(document.querySelectorAll(textSelector)).filter(function(target) {
            if (!target.textContent.trim() || target.closest(excluded)) return false;
            if (target.parentElement && target.parentElement.closest(textSelector)) return false;
            return true;
        });
    }

    function getVisibleTargets(viewport) {
        return textTargets.filter(function(target) {
            const rect = target.getBoundingClientRect();
            if (!rect.width || !rect.height || rect.bottom < 0 || rect.top > viewport.height ||
                rect.right < 0 || rect.left > viewport.width) return false;
            for (let element = target; element && element !== document.body; element = element.parentElement) {
                const style = window.getComputedStyle(element);
                if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
            }
            return true;
        });
    }

    function randomPoint(viewport, padding) {
        const safe = safeInsets(viewport);
        const insetX = Math.min(Math.max(padding, safe.x), viewport.width / 3);
        const insetY = Math.min(Math.max(padding, safe.y), viewport.height / 3);
        return {
            x: insetX + Math.random() * Math.max(1, viewport.width - insetX * 2),
            y: insetY + Math.random() * Math.max(1, viewport.height - insetY * 2)
        };
    }

    function nextDestination(agent, preferredTarget) {
        const viewport = viewportSize();
        const safe = safeInsets(viewport);
        const nearbyText = getVisibleTargets(viewport);
        const target = preferredTarget || (nearbyText.length > 0 && Math.random() < 0.68
            ? nearbyText[Math.floor(Math.random() * nearbyText.length)]
            : null);

        if (target) {
            const rect = target.getBoundingClientRect();
            const padding = Math.min(20, Math.max(8, Math.min(rect.width, rect.height) * 0.12));
            if (preferredTarget) {
                return {
                    x: Math.max(safe.x, Math.min(viewport.width - safe.x, rect.left + rect.width / 2)),
                    y: Math.max(safe.y, Math.min(viewport.height - safe.y, rect.top + rect.height / 2)),
                    target: target
                };
            }
            const side = Math.floor(Math.random() * 4);
            const point = {
                x: side < 2
                    ? rect.left + Math.random() * rect.width
                    : (side === 2 ? rect.left - padding : rect.right + padding),
                y: side >= 2
                    ? rect.top + Math.random() * rect.height
                    : (side === 0 ? rect.top - padding : rect.bottom + padding)
            };
            point.x = Math.max(safe.x, Math.min(viewport.width - safe.x, point.x));
            point.y = Math.max(safe.y, Math.min(viewport.height - safe.y, point.y));
            point.target = target;
            return point;
        }

        const edge = Math.floor(Math.random() * 4);
        const point = randomPoint(viewport, 28);
        if (edge === 0) point.x = safe.x;
        if (edge === 1) point.x = viewport.width - safe.x;
        if (edge === 2) point.y = safe.y;
        if (edge === 3) point.y = viewport.height - safe.y;
        return point;
    }

    function showMarquee(target, cursorPoint, color) {
        if (!target || !target.isConnected) return;
        const viewport = viewportSize();
        const existing = activeMarquees.get(target);
        if (existing) {
            positionMarquee(target, existing.element);
            return;
        }

        const bounds = getMarqueeBounds(target, viewport);
        if (!bounds) return;

        const anchorX = Math.max(0, Math.min(1, (cursorPoint.x - bounds.left) / bounds.width));
        const anchorY = Math.max(0, Math.min(1, (cursorPoint.y - bounds.top) / bounds.height));
        const startClip = 'inset(' + (anchorY * 100) + '% ' + ((1 - anchorX) * 100) + '% ' +
            ((1 - anchorY) * 100) + '% ' + (anchorX * 100) + '%)';
        const marquee = document.createElement('div');
        marquee.className = 'swarm-marquee';
        marquee.style.setProperty('--swarm-selection-color', color);
        cursorLayer.appendChild(marquee);
        positionMarquee(target, marquee);
        activeMarquees.set(target, { element: marquee, animation: null });

        const animation = marquee.animate([
            { clipPath: startClip, opacity: 0.9, offset: 0 },
            { clipPath: 'inset(0 0 0 0)', opacity: 0.9, offset: 0.46 },
            { clipPath: 'inset(0 0 0 0)', opacity: 0.72, offset: 0.72 },
            { clipPath: 'inset(0 0 0 0)', opacity: 0 }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(.2, .75, .25, 1)',
            fill: 'both'
        });
        activeMarquees.get(target).animation = animation;
        animation.onfinish = function() {
            activeMarquees.delete(target);
            marquee.remove();
        };
    }

    function getMarqueeBounds(target, viewport) {
        const rect = target.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;

        const padX = Math.min(Math.max(14, rect.width * 0.1), Math.min(34, viewport.width * 0.08));
        const padY = Math.min(Math.max(10, rect.height * 0.28), Math.min(26, viewport.height * 0.06));
        const left = Math.max(3, rect.left - padX);
        const top = Math.max(3, rect.top - padY);
        const right = Math.min(viewport.width - 3, rect.right + padX);
        const bottom = Math.min(viewport.height - 3, rect.bottom + padY);
        if (right <= left || bottom <= top) return null;

        return { left: left, top: top, right: right, bottom: bottom, width: right - left, height: bottom - top };
    }

    function positionMarquee(target, marquee) {
        if (!target.isConnected || !marquee.isConnected) return;
        const bounds = getMarqueeBounds(target, viewportSize());
        if (!bounds) {
            marquee.style.opacity = '0';
            return;
        }

        marquee.style.left = bounds.left + 'px';
        marquee.style.top = bounds.top + 'px';
        marquee.style.width = bounds.width + 'px';
        marquee.style.height = bounds.height + 'px';
    }

    function hoverTarget(agent, target) {
        if (!target || !target.isConnected) return;
        const now = performance.now();
        const lastShown = recentlyBoxed.get(target) || 0;
        if (now - lastShown < 2200 || activeMarquees.has(target)) return;

        recentlyBoxed.set(target, now);
        const cursorRect = agent.cursor.getBoundingClientRect();
        const startX = cursorRect.left + cursorRect.width * 0.25;
        const startY = cursorRect.top + cursorRect.height * 0.2;
        const bounds = getMarqueeBounds(target, viewportSize());
        if (!bounds) return;

        const corners = [
            { x: bounds.left, y: bounds.top },
            { x: bounds.right, y: bounds.top },
            { x: bounds.right, y: bounds.bottom },
            { x: bounds.left, y: bounds.bottom }
        ];
        const end = corners.reduce(function(farthest, corner) {
            return Math.hypot(corner.x - startX, corner.y - startY) >
                Math.hypot(farthest.x - startX, farthest.y - startY) ? corner : farthest;
        }, corners[0]);

        if (agent.animation) {
            agent.animation.cancel();
            agent.animation = null;
        }

        showMarquee(target, { x: startX, y: startY }, agent.color);

        const cursorCenterX = end.x + cursorRect.width * 0.25;
        const cursorCenterY = end.y + cursorRect.height * 0.3;
        const dx = startX - (cursorCenterX - cursorRect.width / 4);
        const dy = startY - (cursorCenterY - cursorRect.height * 0.3);
        agent.position = { x: cursorCenterX, y: cursorCenterY };
        agent.cursor.style.left = cursorCenterX + 'px';
        agent.cursor.style.top = cursorCenterY + 'px';

        const drag = agent.cursor.animate([
            { transform: 'translate(-50%, -50%) translate(' + dx + 'px, ' + dy + 'px)' },
            { transform: 'translate(-50%, -50%)' }
        ], {
            duration: 760,
            easing: 'cubic-bezier(.22, .72, .24, 1)',
            fill: 'forwards'
        });
        agent.animation = drag;
        drag.onfinish = function() {
            if (agent.animation !== drag) return;
            agent.animation = null;
            window.setTimeout(function() {
                if (agent.cursor.isConnected && !document.hidden) flyTo(agent);
            }, 240);
        };
    }

    function watchFlightForText(agent, animation) {
        function checkHover() {
            if (agent.animation !== animation || animation.playState === 'finished' || animation.playState === 'idle') return;

            const cursorRect = agent.cursor.getBoundingClientRect();
            const cursorX = cursorRect.left + cursorRect.width * 0.25;
            const cursorY = cursorRect.top + cursorRect.height * 0.2;
            const viewport = viewportSize();
            const hovered = getVisibleTargets(viewport).find(function(target) {
                if (activeMarquees.has(target)) return false;
                const lastShown = recentlyBoxed.get(target) || 0;
                if (performance.now() - lastShown < 2200) return false;

                const rect = target.getBoundingClientRect();
                const hoverPadding = Math.min(12, Math.max(5, Math.min(rect.width, rect.height) * 0.08));
                return cursorX >= rect.left - hoverPadding && cursorX <= rect.right + hoverPadding &&
                    cursorY >= rect.top - hoverPadding && cursorY <= rect.bottom + hoverPadding;
            });

            if (hovered) hoverTarget(agent, hovered);
            window.requestAnimationFrame(checkHover);
        }

        window.requestAnimationFrame(checkHover);
    }

    function flyTo(agent, preferredTarget) {
        if (!swarmEnabled) return;
        const viewport = viewportSize();
        const destinationInfo = nextDestination(agent, preferredTarget);
        const destination = destinationInfo;
        const from = agent.position;
        const deltaX = destination.x - from.x;
        const deltaY = destination.y - from.y;
        const distance = Math.hypot(deltaX, deltaY);
        const duration = Math.max(1250, Math.min(3200, 1150 + distance * 0.95));
        const bend = (Math.random() - 0.5) * Math.min(84, distance * 0.22);
        const length = Math.max(1, distance);
        const middleX = from.x + deltaX * 0.5 - (deltaY / length) * bend;
        const middleY = from.y + deltaY * 0.5 + (deltaX / length) * bend;
        const keyframes = [
            {
                transform: 'translate(-50%, -50%) translate(' + (from.x - destination.x) + 'px, ' + (from.y - destination.y) + 'px)',
                opacity: 0.72,
                offset: 0
            },
            {
                transform: 'translate(-50%, -50%) translate(' + (middleX - destination.x) + 'px, ' + (middleY - destination.y) + 'px)',
                opacity: 0.92,
                offset: 0.5
            },
            { transform: 'translate(-50%, -50%)', opacity: 0.86, offset: 1 }
        ];

        agent.position = destination;
        agent.cursor.style.left = destination.x + 'px';
        agent.cursor.style.top = destination.y + 'px';
        const animation = agent.cursor.animate(keyframes, {
            duration: duration,
            easing: 'cubic-bezier(.22, .61, .36, 1)',
            fill: 'forwards'
        });
        watchFlightForText(agent, animation);
        animation.onfinish = function() {
            if (agent.animation !== animation) return;
            agent.animation = null;
            if (destination.target) hoverTarget(agent, destination.target);
            window.setTimeout(function() {
                if (agent.cursor.isConnected && !document.hidden) flyTo(agent);
            }, 320 + Math.random() * 420);
        };
        agent.animation = animation;
    }

    function chaseTarget(agent, target) {
        if (!agent || !target || !target.isConnected) return;
        if (agent.animation) {
            const rect = agent.cursor.getBoundingClientRect();
            agent.animation.cancel();
            agent.animation = null;
            agent.position = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            agent.cursor.style.left = agent.position.x + 'px';
            agent.cursor.style.top = agent.position.y + 'px';
        }
        flyTo(agent, target);
    }

    function updateMarqueesForScroll() {
        activeMarquees.forEach(function(record, target) {
            if (!target.isConnected) {
                if (record.animation) record.animation.cancel();
                activeMarquees.delete(target);
                record.element.remove();
                return;
            }
            positionMarquee(target, record.element);
        });
    }

    function chaseDuringScroll() {
        if (!swarmEnabled) return;
        updateMarqueesForScroll();
        const now = performance.now();
        if (!profileReady || document.hidden || now - lastScrollChase < 360 || !agents.length) return;
        lastScrollChase = now;

        const viewport = viewportSize();
        const visibleTargets = getVisibleTargets(viewport);
        if (!visibleTargets.length) return;

        const centerY = viewport.height * 0.55;
        const candidates = visibleTargets
            .map(function(target) {
                const rect = target.getBoundingClientRect();
                return {
                    target: target,
                    distance: Math.abs(rect.top + rect.height / 2 - centerY),
                    lastBoxed: recentlyBoxed.get(target) || 0
                };
            })
            .filter(function(item) {
                return now - item.lastBoxed > 1050 && !activeMarquees.has(item.target);
            })
            .sort(function(a, b) {
                return a.distance - b.distance;
            });

        if (!candidates.length) return;
        const target = candidates[0].target;
        const agent = agents[nextChasingAgent % agents.length];
        nextChasingAgent++;
        chaseTarget(agent, target);

        recentlyBoxed.forEach(function(timestamp, boxedTarget) {
            if (now - timestamp > 10000 || !boxedTarget.isConnected) recentlyBoxed.delete(boxedTarget);
        });
    }

    function createAgent(index) {
        const viewport = viewportSize();
        const position = { x: viewport.width / 2, y: viewport.height / 2 };
        const color = colors[index % colors.length];
        const cursor = document.createElement('div');
        cursor.className = 'swarm-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        cursor.innerHTML = '<svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5.5 3.21V20.8C5.5 21.6 6.4 22 7 21.4L11.3 17.1H18.5C19.3 17.1 19.8 16.2 19.3 15.6L6.5 2.8C5.9 2.2 5.5 2.6 5.5 3.21Z" fill="' + color + '" stroke="white" stroke-width="1.5"/></svg><span class="swarm-label" style="--swarm-color:' + color + '">DEV_' + String(index + 1).padStart(2, '0') + '</span>';
        cursorLayer.appendChild(cursor);

        const agent = { cursor: cursor, position: position, animation: null, color: color };
        agents.push(agent);
        if (profileReady && swarmEnabled) flyTo(agent);
    }

    function releaseSwarm() {
        if (profileReady) return;
        profileReady = true;
        if (swarmEnabled) launchSwarmFromProfile();
    }

    function launchSwarmFromProfile() {
        cursorLayer.style.visibility = 'visible';
        const profile = Array.from(document.querySelectorAll('.profile-img')).find(function(image) {
            const style = window.getComputedStyle(image);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });
        const profileRect = profile && profile.getBoundingClientRect();
        const viewport = viewportSize();
        const origin = profileRect && profileRect.width && profileRect.height
            ? { x: profileRect.left + profileRect.width / 2, y: profileRect.top + profileRect.height / 2 }
            : { x: viewport.width / 2, y: viewport.height / 2 };
        agents.forEach(function(agent, index) {
            agent.position = origin;
            agent.cursor.style.left = origin.x + 'px';
            agent.cursor.style.top = origin.y + 'px';
            window.setTimeout(function() {
                if (swarmEnabled && agent.cursor.isConnected && !document.hidden) flyTo(agent);
            }, index * 18);
        });
    }

    function setSwarmEnabled(enabled) {
        swarmEnabled = enabled;
        if (!swarmEnabled) {
            cursorLayer.style.visibility = 'hidden';
            agents.forEach(function(agent) {
                if (agent.animation) agent.animation.cancel();
                agent.animation = null;
            });
            activeMarquees.forEach(function(record) {
                if (record.animation) record.animation.cancel();
                record.element.remove();
            });
            activeMarquees.clear();
            return;
        }

        if (profileReady) launchSwarmFromProfile();
    }

    function syncAgents() {
        const wanted = targetAgentCount();
        while (agents.length < wanted) createAgent(agents.length);
        while (agents.length > wanted) {
            const agent = agents.pop();
            if (agent.animation) agent.animation.cancel();
            agent.cursor.remove();
        }
    }

    function updateForViewport() {
        if (resizeFrame) return;
        resizeFrame = window.requestAnimationFrame(function() {
            resizeFrame = 0;
            syncAgents();
            if (!profileReady || !swarmEnabled) return;
            const viewport = viewportSize();
            const safe = safeInsets(viewport);
            agents.forEach(function(agent) {
                if (agent.animation) {
                    const rect = agent.cursor.getBoundingClientRect();
                    agent.animation.cancel();
                    agent.animation = null;
                    agent.position.x = rect.left + rect.width / 2;
                    agent.position.y = rect.top + rect.height / 2;
                }
                agent.position.x = Math.max(safe.x, Math.min(viewport.width - safe.x, agent.position.x));
                agent.position.y = Math.max(safe.y, Math.min(viewport.height - safe.y, agent.position.y));
                agent.cursor.style.left = agent.position.x + 'px';
                agent.cursor.style.top = agent.position.y + 'px';
                if (!document.hidden) flyTo(agent);
            });
        });
    }

    function handleVisibilityChange() {
        if (!profileReady || !swarmEnabled) return;
        agents.forEach(function(agent) {
            if (document.hidden) {
                if (agent.animation) agent.animation.pause();
            } else if (agent.animation) {
                agent.animation.play();
            } else {
                flyTo(agent);
            }
        });
    }

    refreshTextTargets();
    if ('MutationObserver' in window) {
        observer = new MutationObserver(function() {
            refreshTextTargets();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('profile-assembly-complete', releaseSwarm, { once: true });
    window.addEventListener('swarm-setting-change', function(event) {
        setSwarmEnabled(Boolean(event.detail.enabled));
    });
    syncAgents();
    window.addEventListener('resize', updateForViewport, { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', updateForViewport, { passive: true });
    window.addEventListener('scroll', chaseDuringScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
})();
