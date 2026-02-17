// Simple static auth script — shows a modal until correct static credentials are entered.
(function(){
  const AUTH_USER = 'admin'; // predefined login id (user won't enter this)
  const AUTH_PASS = 'HarsshDoshi@2025'; // password the user must enter
  const STORAGE_KEY = 'site_logged_in';

  function createLoginUI(){
    // overlay that blurs background using backdrop-filter
    const overlay = document.createElement('div');
    overlay.className = 'auth-overlay';
    overlay.id = 'authOverlay';

    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.id = 'authModal';
    modal.innerHTML = `
      <h2>Site Login</h2>
      <p style="font-family: 'Lato', sans-serif;">Please enter the password to continue.</p>
      <input id="authPass" type="password" placeholder="Password" autocomplete="current-password" />
      <div class="auth-actions">
        <button id="authSubmit">Submit</button>
      </div>
      <div id="authError" class="auth-error" aria-live="polite"></div>
    `;
    //  <div class="auth-id">Login ID: <strong>${AUTH_USER}</strong></div>


    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // focus password input
    setTimeout(()=> document.getElementById('authPass').focus(), 50);

    document.getElementById('authSubmit').addEventListener('click', attemptLogin);
    document.getElementById('authPass').addEventListener('keydown', function(e){
      if(e.key === 'Enter') attemptLogin();
    });
  }

  function attemptLogin(){
    const p = document.getElementById('authPass').value;
    const err = document.getElementById('authError');
    // only password is entered; user id is predefined as AUTH_USER
    if(p === AUTH_PASS){
      // success
      localStorage.setItem(STORAGE_KEY, 'true');
      window.dispatchEvent(new Event('site-authenticated'));
      err.textContent = 'Login successful.';
      err.classList.remove('auth-error');
      err.classList.add('auth-success');
      // remove modal shortly after showing success message
      setTimeout(removeLoginUI, 700);
    } else {
      err.textContent = 'Invalid password.';
      err.classList.remove('auth-success');
      err.classList.add('auth-error');
      // small shake to indicate error
      const modal = document.getElementById('authModal');
      modal.classList.remove('shake');
      void modal.offsetWidth;
      modal.classList.add('shake');
    }
  }

  function removeLoginUI(){
    const ov = document.getElementById('authOverlay');
    const md = document.getElementById('authModal');
    if(ov) ov.parentNode.removeChild(ov);
    if(md) md.parentNode.removeChild(md);
  }

  function init(){
    // If already logged in, expose logout and do nothing
    if(localStorage.getItem(STORAGE_KEY) === 'true'){
      window.logoutAuth = function(){ localStorage.removeItem(STORAGE_KEY); location.reload(); };
      return;
    }
    // otherwise show login modal
    createLoginUI();
    // expose logout for dev convenience
    window.logoutAuth = function(){ localStorage.removeItem(STORAGE_KEY); location.reload(); };
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
