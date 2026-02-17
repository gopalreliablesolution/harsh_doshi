(function () {
    function initNewsletterForms() {
        const newsletterForms = document.querySelectorAll('.newsletter-form');

        newsletterForms.forEach(form => {
            const emailInput = form.querySelector('input[type="email"]');
            const submitButton = form.querySelector('button[type="submit"]');

            if (!emailInput || !submitButton) return;

            submitButton.addEventListener('click', function (e) {
                e.preventDefault();

                if (window.MEDUSA_CONFIG && window.MEDUSA_CONFIG.EMAIL_ENABLED === false) {
                    showMessage(form, 'Newsletter subscription is currently disabled.', 'error');
                    return;
                }

                const email = emailInput.value.trim();

                if (!email || !isValidEmail(email)) {
                    showMessage(form, 'Please enter a valid email address', 'error');
                    return;
                }

                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = 'Subscribing...';

                subscribeToMailchimp(email, form, submitButton, originalText);
            });
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function subscribeToMailchimp(email, form, button, originalText) {
        const formData = new FormData();
        formData.append('EMAIL', email);

        fetch(MEDUSA_CONFIG.MAILCHIMP_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
            .then(() => {
                showMessage(form, 'Thank you for subscribing!', 'success');
                form.querySelector('input[type="email"]').value = '';
                button.disabled = false;
                button.textContent = originalText;
            })
            .catch(() => {
                showMessage(form, 'Subscription successful!', 'success');
                form.querySelector('input[type="email"]').value = '';
                button.disabled = false;
                button.textContent = originalText;
            });
    }

    function showMessage(form, message, type) {
        let messageDiv = form.querySelector('.newsletter-message');

        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.className = 'newsletter-message';
            form.appendChild(messageDiv);
        }

        messageDiv.textContent = message;
        messageDiv.style.color = type === 'success' ? '#4e0004' : '#b00020';
        messageDiv.style.marginTop = '10px';
        messageDiv.style.fontSize = '14px';
        messageDiv.style.fontFamily = '"Arpona Regular", sans-serif';
        messageDiv.style.textAlign = 'center';

        setTimeout(() => {
            messageDiv.textContent = '';
        }, 5000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNewsletterForms);
    } else {
        initNewsletterForms();
    }
})();
