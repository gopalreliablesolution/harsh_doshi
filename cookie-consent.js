document.addEventListener('DOMContentLoaded', () => {
    // Check if consent is already given
    const consent = localStorage.getItem('cookieConsent');

    // HTML string for the banner
    const cookieBannerHTML = `
    <div class="privacy-banner">
      
      <div class="privacy-text">
        <h4>WE VALUE YOUR PRIVACY</h4>
        <p>
          Your experience on this site will be improved by accepting
          cookies. <a href="Privacy-Policy.html">Privacy Policy</a>
        </p>
      </div>
      <div class="privacy-buttons">
        <button type="button" class="customise-btn">Customise</button>
        <button type="button" class="reject-btn">Reject All</button>
        <button type="button" class="accept-btn">Accept All</button>
      </div>
    </div>
    `;

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
    .privacy-banner {
        position: fixed; /* Changed to fixed to ensure it stays at bottom of viewport */
        bottom: 0;
        left: 0;
        right: 0;
        background: #460004; /* Increased opacity for better visibility */
        color: white; /* Fallback */
        color: var(--white, white);
        padding: 15px 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center; /* Center alignment */
        z-index: 1000; /* High z-index */
        font-size: 14px;
        gap: 30px;
        transition: all 0.5s ease;
    }

    .play-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-right: 30px;
    }

    .play-btn,
    .sound-btn {
        background: none;
        border: none;
        color: white;
        color: var(--white, white);
        font-size: 18px;
        cursor: pointer;
        padding: 5px;
        transition: opacity 0.3s ease;
    }

    .play-btn:hover,
    .sound-btn:hover {
        opacity: 0.7;
    }

    .privacy-text {
        flex: 1;
        margin-right: 20px;
    }

    .privacy-text h4 {
        font-size: 14px;
        font-family: "Aviano Sans", sans-serif;
        text-align: left;
        margin: 0 0 5px 0;
        font-weight: bold;
    }

    .privacy-text p {
        margin: 0;
        opacity: 0.9;
        font-size: 14px;
        font-family: "Lato", sans-serif;
        text-align: left;
    }

    .privacy-text a {
        color: white;
        color: var(--white, white);
        text-decoration: underline;
    }

    .privacy-buttons {
        display: flex;
        gap: 20px;
        align-items: center;
        white-space: nowrap; /* Prevent wrapping on desktop if possible */
    }

    .privacy-buttons button {
        padding: 8px 16px;
        border: none;
        background: transparent;
        color: white;
        color: var(--white, white);
        cursor: pointer;
        font-size: 14px;
        text-decoration: underline;
        font-weight: 500;
        font-family: "Lato", sans-serif;
    }

    .privacy-buttons .accept-btn {
         border: 1px solid white;
         border: 1px solid var(--white, white);
         text-decoration: none;
         text-align: center;
         border-radius: 0; /* Keep it square/sharp as per design */
    }

    .privacy-buttons button:hover {
        opacity: 1;
        color: white;
        color: var(--white, white);
        background: transparent;
        text-decoration: underline;
    }

    .privacy-buttons .accept-btn:hover {
        opacity: 1;
        background: transparent;
        text-decoration: none;
        border: 1px solid white;
        border: 1px solid var(--white, white);
    }



    .privacy-banner.hidden {
        opacity: 0;
        transform: translateY(100%);
        pointer-events: none;
    }

    /* Mobile adjustments */
    @media (max-width: 768px) {
        .privacy-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            padding: 20px;
        }
        .privacy-text {
            width: 100%;
            margin: 0;
        }
        .privacy-buttons {
            width: 100%;
            display: grid; /* Use grid for older mobile style or flex column */
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 0;
        }
        /* Make Accept All span full width on mobile */
        .privacy-buttons .accept-btn {
            grid-column: 1 / -1;
            width: 100%;
            text-align: center;
            box-sizing: border-box;
        }
        .privacy-buttons .customise-btn, 
        .privacy-buttons .reject-btn {
            text-align: center;
        }
        .privacy-buttons .customise-btn:hover,
.privacy-buttons .reject-btn:hover {
    border: 1px solid white;
    border: 1px solid var(--white, white);
    text-decoration: none; /* Optional: remove underline on hover */
}
    }
    `;
    document.head.appendChild(style);

    // Inject HTML into body
    document.body.insertAdjacentHTML('beforeend', cookieBannerHTML);

    // Get references to elements
    const privacyBanner = document.querySelector(".privacy-banner");
    const acceptBtn = document.querySelector(".accept-btn");
    const rejectBtn = document.querySelector(".reject-btn");
    const customiseBtn = document.querySelector(".customise-btn");
    const playBtn = document.querySelector("#playBtn");
    const soundBtn = document.querySelector("#soundBtn");

    // Hide if already consented
    if (consent) {
        privacyBanner.classList.add("hidden");
    }

    // Event Listeners
    if (acceptBtn) {
        acceptBtn.addEventListener("click", () => {
            privacyBanner.classList.add("hidden");
            localStorage.setItem("cookieConsent", "accepted");
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener("click", () => {
            privacyBanner.classList.add("hidden");
            localStorage.setItem("cookieConsent", "rejected");
        });
    }

    if (customiseBtn) {
        customiseBtn.addEventListener("click", () => {
            alert("Customize cookie settings");
        });
    }

    // Audio Controls Logic (preserved from existing files)
    let isPlaying = true;
    let isMuted = false;

    if (playBtn) {
        playBtn.addEventListener('click', function () {
            isPlaying = !isPlaying;
            this.innerHTML = isPlaying ? '⏸' : '▶️';
            // Add your audio play/pause logic here
        });
    }

    if (soundBtn) {
        soundBtn.addEventListener('click', function () {
            isMuted = !isMuted;
            this.innerHTML = isMuted ? '🔇' : '🔊';
            // Add your audio mute/unmute logic here
        });
    }
});
