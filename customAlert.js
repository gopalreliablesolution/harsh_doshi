(function () {

    function createAlert(options) {
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) existingAlert.remove();

        const {
            message = "",
            type = "alert", // alert | confirm
            onConfirm = null,
            onCancel = null
        } = options;

        const alertBox = document.createElement('div');
        alertBox.className = 'custom-alert';

        alertBox.innerHTML = `
            <div class="alert-overlay" style="
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.4);
                z-index: 9998;
            "></div>

            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #ffffff;
                padding: 30px;
                width: 90%;
                max-width: 380px;
                text-align: center;
                font-family: 'Lato', sans-serif;
                box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                z-index: 9999;
            ">
                <p style="
                    margin-bottom: 20px;
                    font-size: 15px;
                    color: #222;
                    line-height: 1.5;
                ">${message}</p>

                <div style="display:flex; justify-content:center; gap:10px;">
                    ${type === "confirm" ? `
                        <button class="alert-cancel">Cancel</button>
                        <button class="alert-confirm">Confirm</button>
                    ` : `
                        <button class="alert-ok">OK</button>
                    `}
                </div>
            </div>
        `;

        document.body.appendChild(alertBox);

        const overlay = alertBox.querySelector('.alert-overlay');
        overlay.onclick = () => alertBox.remove();

        const styleButton = (btn, bg, color) => {
            btn.style.padding = "10px 28px";
            btn.style.border = "1px solid black";
            btn.style.background = bg;
            btn.style.color = color;
            btn.style.cursor = "pointer";
            btn.style.fontSize = "13px";
            btn.style.letterSpacing = "0.5px";
            btn.style.transition = "all 0.3s ease";

            btn.onmouseover = function () {
                this.style.background = "black";
                this.style.color = "white";
            };

            btn.onmouseout = function () {
                this.style.background = "white";
                this.style.color = "black";
            };
        };

        if (type === "alert") {
            const okBtn = alertBox.querySelector('.alert-ok');
            styleButton(okBtn, "white", "black");
            okBtn.onclick = () => alertBox.remove();
        }

        if (type === "confirm") {
            const confirmBtn = alertBox.querySelector('.alert-confirm');
            const cancelBtn = alertBox.querySelector('.alert-cancel');

            styleButton(confirmBtn, "white", "black");
            styleButton(cancelBtn, "white", "black");

            confirmBtn.onclick = () => {
                if (onConfirm) onConfirm();
                alertBox.remove();
            };

            cancelBtn.onclick = () => {
                if (onCancel) onCancel();
                alertBox.remove();
            };
        }
    }

    // Global functions
    window.showCustomAlert = function (message) {
        createAlert({ message, type: "alert" });
    };

    window.showCustomConfirm = function (message, onConfirm, onCancel) {
        createAlert({
            message,
            type: "confirm",
            onConfirm,
            onCancel
        });
    };

})();
