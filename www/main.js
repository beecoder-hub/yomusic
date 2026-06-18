document.addEventListener('DOMContentLoaded', function () {
  const counter = document.querySelector('.counter');

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !counter.classList.contains('counted')) {
        counter.classList.add('counted');
        animateCounter();
      }
    });
  }, observerOptions);

  if (counter) {
    observer.observe(counter);
  }

  function animateCounter() {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = form.elements.email.value;
      const message = form.elements.message.value;
      if (!email.trim() || !message.trim()) {
        alert('Fields cannot be empty!');
        return false;
      }
      if (!validateEmail(email)) {
        alert('Invalid email');
        return false;
      }
      if (sessionStorage.getItem('mailTask') === email) {
        alert('Thank you for your message! We will get back to you soon.');
        form.reset();
        return false;
      }
      const submitbtn = document.getElementById('form-submit-btn');
      submitbtn.setAttribute('disabled', 'true');
      await sendEmail({ senderEmail: email.trim(), message: message.trim() });
      submitbtn.removeAttribute('disabled');
      form.reset();
    });
  }

  async function sendEmail({ senderEmail, message }) {
    const object = {
      access_key: 'ea680241-10e1-4b9f-ae70-2defabac1690',
      email: senderEmail,
      message: message,
    };
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(object),
    });
    if (!res.ok) {
      alert('OOps something went wrong!!');
      console.log('Failed to send Message');
      return false;
    }
    alert('Thank you for your message! We will get back to you soon.');
    sessionStorage.setItem('mailTask', senderEmail);
    return true;
  }

  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
  });

  /** ======= NAV TOGGLE ======== */

  const toggleBtn = document.getElementById('nav-toggle-btn');
  const containerMobile = document.getElementById('nav-container-mobile');
  const I = document.querySelector('#nav-toggle-btn i');

  let isOpenNav = false;
  toggleBtn.addEventListener('click', () => {
    if (!isOpenNav) {
      containerMobile.classList.add('active');
      I.classList.add('fa-close');
      I.classList.remove('fa-bars');
      isOpenNav = true;
    } else {
      containerMobile.classList.remove('active');
      I.classList.remove('fa-close');
      I.classList.add('fa-bars');
      isOpenNav = false;
    }
  });
});

function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}

function validateEmail(email) {
  // A commonly used regex that covers most real-world emails without being overly complex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email);
}
