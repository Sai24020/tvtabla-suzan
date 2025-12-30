//---------- MENU ANIMATION & TOGGLE ----------
const ANIMATION = { NONE: 'none', TIMER: 'timer', ALTERNATIVE: 'alternative' };
window.MENU_ANIMATION_MODE ??= ANIMATION.NONE;

let menuIcon, menu, loadingSpinner, titleElem, currentChannel, tvDataCache;

document.addEventListener('DOMContentLoaded', () => {
    menuIcon = document.querySelector('.menu-icon');
    menu = document.querySelector('.menu');
    loadingSpinner = document.querySelector('#js-loading');
    titleElem = document.querySelector('#js-title');
    currentChannel = null;
    tvDataCache = {};

    if (!menuIcon || !menu) return;

    // Toggle menu click
    menuIcon.addEventListener('click', toggleMenu);

    // Toggle menu keyboard (Enter/Space)
    menuIcon.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') toggleMenu();
    });

    // Menu item click & keyboard
    const menuItems = Array.from(menu.querySelectorAll('li'));
    menuItems.forEach(li => {
        li.addEventListener('click', () => setChannel(li.textContent));
        li.setAttribute('onclick', `setChannel('${li.textContent}')`); // för Cypress-test
        li.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') setChannel(li.textContent);
        });
    });

    // Init first channel
    if (menuItems.length) setChannel(menuItems[0].textContent);
});

// Toggle menu
function toggleMenu() {
    const isOpen = menu.classList.contains('menu--show');
    if (isOpen) closeMenu();
    else openMenu();
}

// Open menu
function openMenu() {
    if (window.MENU_ANIMATION_MODE === ANIMATION.TIMER) {
        animateMenuTimer(-300, 0, 'open');
    } else if (window.MENU_ANIMATION_MODE === ANIMATION.ALTERNATIVE) {
        animateMenuAlt(-300, 0, 'open');
    } else {
        menu.classList.add('menu--show');
        menu.style.left = '0px';
    }

    const icon = menuIcon.querySelector('i');
    if (icon) icon.classList.replace('fa-bars', 'fa-times');

    const firstItem = menu.querySelector('li');
    if (firstItem) firstItem.focus();
}

// Close menu
function closeMenu() {
    if (window.MENU_ANIMATION_MODE === ANIMATION.TIMER) {
        animateMenuTimer(0, -300, 'close');
    } else if (window.MENU_ANIMATION_MODE === ANIMATION.ALTERNATIVE) {
        animateMenuAlt(0, -300, 'close');
    } else {
        menu.classList.remove('menu--show');
        menu.style.left = '-300px';
    }

    const icon = menuIcon.querySelector('i');
    if (icon) icon.classList.replace('fa-times', 'fa-bars');
}

// Timer-based animation
function animateMenuTimer(start, end, action) {
    let left = start;
    const step = start < end ? 10 : -10;
    const interval = setInterval(() => {
        left += step;
        menu.style.left = left + 'px';
        if ((step > 0 && left >= end) || (step < 0 && left <= end)) {
            clearInterval(interval);
            menu.style.left = end + 'px';
            if (action === 'open') menu.classList.add('menu--show');
            else menu.classList.remove('menu--show');
        }
    }, 10);
}

// Alternative animation using requestAnimationFrame
function animateMenuAlt(start, end, action) {
    let left = start;
    const step = start < end ? 10 : -10;

    function animate() {
        left += step;
        if ((step > 0 && left >= end) || (step < 0 && left <= end)) {
            left = end;
            menu.style.left = left + 'px';
            if (action === 'open') menu.classList.add('menu--show');
            else menu.classList.remove('menu--show');
            return;
        }
        menu.style.left = left + 'px';
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

//--------- CHANNEL SELECTION & FETCH ---------
async function setChannel(channelName) {
    currentChannel = channelName;
    titleElem.textContent = channelName;

    showLoading();
    const data = await fetchChannelData(channelName);
    hideLoading();
    renderPrograms(data);

    closeMenu();

    const schedule = document.querySelector('#js-schedule');
    if (schedule) schedule.focus();
}

// Fetch data
async function fetchChannelData(channelName) {
    if (tvDataCache[channelName]) return tvDataCache[channelName];

    try {
        const res = await fetch(`data/${channelName}.json`);
        const json = await res.json();
        const programs = json.map(p => ({
            program: p.name,
            start: new Date(p.start),
            description: p.description
        }));
        programs.sort((a, b) => a.start - b.start);
        tvDataCache[channelName] = programs;
        return programs;
    } catch (err) {
        console.error('Failed to fetch:', err);
        return [];
    }
}

//--------- PROGRAM RENDERING ---------
function renderPrograms(programs) {
    const schedule = document.querySelector('#js-schedule');
    schedule.innerHTML = '';

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';

    if (programs.length > 0) {
        const prevBtn = document.createElement('li');
        prevBtn.className = 'list-group-item show-previous';
        prevBtn.textContent = 'Visa tidigare program';
        prevBtn.tabIndex = 0;
        prevBtn.addEventListener('click', async () => {
            showLoading();
            const data = await fetchChannelData(currentChannel);
            renderPreviousPrograms(data);
            hideLoading();
        });
        prevBtn.addEventListener('keydown', async e => {
            if (e.key === 'Enter' || e.key === ' ') {
                showLoading();
                const data = await fetchChannelData(currentChannel);
                renderPreviousPrograms(data);
                hideLoading();
            }
        });
        ul.appendChild(prevBtn);
    }

    const now = new Date();
    const filtered = programs.filter(p => p.start >= now);

    filtered.forEach(p => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<strong>${formatTime(p.start)}</strong><div>${p.program}</div>`;
        ul.appendChild(li);
    });

    schedule.appendChild(ul);
}

// Render all programs
function renderPreviousPrograms(programs) {
    const schedule = document.querySelector('#js-schedule');
    schedule.innerHTML = '';

    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';

    programs.forEach(p => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<strong>${formatTime(p.start)}</strong><div>${p.program}</div>`;
        ul.appendChild(li);
    });

    schedule.appendChild(ul);
}

//--------- LOADING SPINNER ---------
function showLoading() {
    loadingSpinner.classList.add('show');
    loadingSpinner.classList.remove('hidden');
}

function hideLoading() {
    loadingSpinner.classList.remove('show');
    loadingSpinner.classList.add('hidden');
}

//--------- TIME FORMATTING ---------
function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
