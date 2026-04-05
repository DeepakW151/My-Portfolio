// Create overlay for location permission
const createOverlay = () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        max-width: 80%;
        position: relative;
    `;

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #333;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        transition: color 0.3s ease;
    `;
    closeBtn.innerHTML = '&times;';
    closeBtn.id = 'closePermissionBtn';
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.color = '#bd5d38';
    });
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.color = '#333';
    });

    content.innerHTML = `
        <h2>Location Permission Required</h2>
        <p>Please allow location access to view this website.</p>
        <button id="permitLocation" style="
            background: #bd5d38;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 1rem;
        ">Allow Location Access</button>
    `;

    content.insertBefore(closeBtn, content.firstChild);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    return overlay;
};

// Create full-page error message
const showErrorPage = () => {
    const errorPage = document.createElement('div');
    errorPage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: 'Muli', sans-serif;
    `;

    const errorContent = document.createElement('div');
    errorContent.style.cssText = `
        text-align: center;
        color: white;
        max-width: 600px;
        padding: 2rem;
    `;

    errorContent.innerHTML = `
        <div style="font-size: 80px; margin-bottom: 1rem;">🚫</div>
        <h1 style="font-size: 2.5rem; margin: 0 0 1rem 0; font-weight: 700;">Access Denied</h1>
        <p style="font-size: 1.2rem; margin: 0 0 2rem 0; opacity: 0.95;">
            Location permission is required to access this website.
        </p>
        <p style="font-size: 1rem; margin: 0 0 2rem 0; opacity: 0.85;">
            We need your location to provide you with a personalized experience. 
            Please enable location access in your browser settings and try again.
        </p>
        <div style="margin: 2rem 0;">
            <button id="retryPermission" style="
                background: white;
                color: #667eea;
                border: none;
                padding: 12px 30px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 600;
                transition: all 0.3s ease;
                margin: 0 10px;
            ">Retry</button>
        </div>
        <p style="font-size: 0.85rem; margin: 2rem 0 0 0; opacity: 0.7;">
            If you don't grant location permission, leave this site and Go somewhere else.       </p>
    `;

    errorPage.appendChild(errorContent);
    document.body.appendChild(errorPage);
    errorPage.classList.add('error-page');

    // Retry button
    document.getElementById('retryPermission').addEventListener('click', () => {
        errorPage.remove();
        window.location.reload();
    });

    // Hover effects
    document.getElementById('retryPermission').addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    });
    document.getElementById('retryPermission').addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = 'none';
    });
};


// Detect browser information
const detectBrowser = () => {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    // Chrome
    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Chromium') === -1 && ua.indexOf('Edge') === -1) {
        browserName = 'Chrome';
        browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    }
    // Firefox
    else if (ua.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
        browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    }
    // Safari
    else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
        browserName = 'Safari';
        browserVersion = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    }
    // Edge
    else if (ua.indexOf('Edge') > -1 || ua.indexOf('Edg') > -1) {
        browserName = 'Edge';
        browserVersion = ua.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
    }
    // Opera
    else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
        browserName = 'Opera';
        browserVersion = ua.match(/OPR\/(\d+)/)?.[1] || 'Unknown';
    }
    // Internet Explorer
    else if (ua.indexOf('Trident') > -1) {
        browserName = 'Internet Explorer';
        browserVersion = ua.match(/rv:(\d+)/)?.[1] || 'Unknown';
    }

    return `${browserName} ${browserVersion}`;
};


// Handle location permission and API call
const handleLocation = async () => {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, (error) => {
                reject(error);
            });
        });

        const { latitude, longitude } = position.coords;

        // Get current IST time
        const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        // Get browser information
        const browser = detectBrowser();

        console.log('Sending location data:', { latitude, longitude, timestamp: istTime, browser });

        // Use backend URL from environment or default to localhost for development
        const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

        // Send location to server
        const response = await fetch(`${backendURL}/api/location`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude, timestamp: istTime, browser }),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success:', data);

        // Remove overlay and allow content to show
        const overlay = document.querySelector('.location-overlay');
        if (overlay) {
            overlay.style.transition = 'opacity 0.5s ease';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                // Scroll to top and ensure page is accessible
                window.scrollTo(0, 0);
                document.body.style.overflow = 'auto';
            }, 500);
        }

    } catch (error) {
        console.error('Location error:', error);
        showErrorPage();
    }
};

window.addEventListener('DOMContentLoaded', event => {
    // Check for location permission
    const overlay = createOverlay();
    overlay.classList.add('location-overlay');
    
    // Prevent scrolling while overlay is visible
    document.body.style.overflow = 'hidden';

    document.getElementById('permitLocation').addEventListener('click', handleLocation);

    // Handle close button click
    document.getElementById('closePermissionBtn').addEventListener('click', () => {
        overlay.remove();
        document.body.style.overflow = 'auto';
        showErrorPage();
    });

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});
