// Shared behaviour for every page. Each block is guarded so pages that
// lack the relevant markup (e.g. no profile photo on the CN page) skip it.

// -- Profile photo rotator --
// Every page load shows the next photo in `profileImages`, wrapping at the
// end; clicking the photo also advances it. To add a photo: drop the file
// into images/profile/ and append an entry below. `pos` is the CSS
// object-position used for the square crop (keep the face in frame).
(function () {
  const btn = document.getElementById('profileSwap');
  const img = document.getElementById('profileImage');
  if (!btn || !img) return;
  const profileImages = [
    { src: 'images/profile/Profile1.jpg', pos: '60% 40%' },
    { src: 'images/profile/Profile2.jpg', pos: '50% 45%' },
    { src: 'images/profile/Profile3.jpg', pos: '56% 40%' },
    { src: 'images/profile/Profile4.jpg', pos: '54% 45%' },
    { src: 'images/profile/Profile5.jpg', pos: '20% 70%' },
    { src: 'images/profile/Profile6.jpg', pos: '50% 45%' },
  ];
  const key = 'rg.lastProfileIdx';
  let idx = 0;
  try {
    const last = parseInt(localStorage.getItem(key), 10);
    idx = Number.isFinite(last) ? (last + 1) % profileImages.length : 0;
  } catch (e) { /* storage blocked: start at the first photo */ }

  const show = (i) => {
    const p = profileImages[i];
    img.src = p.src;
    img.style.objectPosition = p.pos;
    try { localStorage.setItem(key, String(i)); } catch (e) {}
  };
  show(idx);

  // Preload the next photo so a click swaps instantly.
  const preload = (i) => { new Image().src = profileImages[i].src; };
  preload((idx + 1) % profileImages.length);

  btn.addEventListener('click', () => {
    idx = (idx + 1) % profileImages.length;
    btn.classList.add('profile-swap--fading');
    setTimeout(() => {
      show(idx);
      btn.classList.remove('profile-swap--fading');
      preload((idx + 1) % profileImages.length);
    }, 180);
  });
})();

// -- Typed-name effect with NUS-blue surname swap --
// Types "Ruihua Guo" letter-by-letter, then swaps to the final markup
// where "Guo" is wrapped in <span class="name-last"> (coloured NUS blue
// via CSS). prefers-reduced-motion skips straight to the final state.
(function () {
  const el = document.querySelector('.name-typed');
  const caret = document.querySelector('.name-caret');
  const mark = document.querySelector('.name .mark');
  if (!el) return;
  const text = el.dataset.text || '';
  const finalize = () => {
    el.innerHTML = 'Ruihua <span class="name-last">Guo</span>';
  };
  const reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    finalize();
    if (caret) caret.style.display = 'none';
    return;
  }
  el.textContent = '';
  if (mark) mark.classList.add('mark--hidden');
  let i = 0;
  const step = 80; // ms per character
  function tick() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i += 1;
      setTimeout(tick, step);
    } else {
      finalize();
      if (mark) {
        mark.classList.remove('mark--hidden');
        mark.classList.add('mark--visible');
      }
      if (caret) {
        setTimeout(() => caret.classList.add('name-caret--done'), 900);
      }
    }
  }
  tick();
})();

// -- Contact form submit (Web3Forms) --
// POSTs the typed Name/Email/Message to api.web3forms.com, which forwards
// the submission to ruihua.g@u.nus.edu. No page redirect, inline status.
// access_key + honeypot are in the form markup; subject is personalised
// here so the inbox subject line shows the sender's name.
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const setStatus = (text, state) => {
    if (!status) return;
    status.textContent = text;
    if (state) status.dataset.state = state;
    else status.removeAttribute('data-state');
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name    = (data.get('name')    || '').toString().trim();
    const email   = (data.get('email')   || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();
    if (!name || !email || !message) {
      setStatus('Please fill in your name, email, and message.', 'error');
      return;
    }
    data.set('subject', 'Website message from ' + name);
    setStatus('Sending…', null);
    if (button) button.disabled = true;
    try {
      const resp = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await resp.json().catch(() => null);
      if (resp.ok && json && json.success) {
        setStatus("Thanks — your message is on its way. I'll reply within 48 hours.", 'ok');
        form.reset();
      } else {
        const msg = (json && json.message) || 'Something went wrong sending the message.';
        setStatus(msg + " You can also email me directly: ruihua.g@u.nus.edu", 'error');
      }
    } catch (err) {
      setStatus("Couldn't reach the form server. Please email me directly: ruihua.g@u.nus.edu", 'error');
    } finally {
      if (button) button.disabled = false;
    }
  });
})();

// -- Back-to-top button (Research / Experiences / Blog) --
// Fades in after the reader scrolls past ~a third of the viewport and
// stays pinned bottom-right; click smooth-scrolls to the top.
(function () {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  const toggle = () => {
    btn.classList.toggle('back-to-top--visible', window.scrollY > window.innerHeight * 0.35);
  };
  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    btn.blur();
  });
})();

// -- Scroll-driven reveals --
// Fade-and-rise targets marked with .reveal as they enter the viewport.
// One-shot: once revealed, the observer stops watching. prefers-reduced-motion
// skips straight to the visible state.
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('reveal--visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => observer.observe(el));
})();
