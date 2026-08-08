// Get DOM elements
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
/// CV download Button
let cvDow = document.querySelectorAll(".cv-download");
/// contact form
// let contactForm = document.querySelector("#contact-form");

// Toggle menu function
function toggleMenu() {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
}

// Event listeners
hamburger.addEventListener("click", toggleMenu);

// Close menu when clicking a link
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  }
});

/// Download Resume
cvDow.forEach((button) => {
  button.addEventListener("click", function () {
    /// resume  Drive Link
    const resumeLink =
      "https://drive.google.com/uc?export=download&id=1-EJqyHu9bPwu_HGftUBw69JN111FZynq";
    /// here we craete <a>
    const downloadLink = document.createElement("a");
    downloadLink.href = resumeLink;
    downloadLink.setAttribute("download", "Rahul_Kumar_Sahu.pdf");
    /// Append to the body and trigger the download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    /// remove the link after Download
    document.body.removeChild(downloadLink);
  });
});

// Select the contact form using the correct ID selector
let contactForm = document.querySelector("#contact-form"); 

contactForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission
  console.log("Form submitted!");

  // Get input field values
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  console.log(name, email, subject, message); 

  // Show confirmation alert
  alert(`Thank you, ${name}! Your message has been received.`);
   // Optionally, submit the form programmatically
   this.submit();

  // Clear form fields after submission
  this.reset();

 
});




// --- Typing Text Animation ---
const typingTextSpan = document.querySelector('.typing-text');
if (typingTextSpan) {
    const textArray = ["App Developer", "Web Developer", "Programmer", "Tech Enthusiast"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = textArray[textIndex];
        
        if (isDeleting) {
            typingTextSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 100 : 200;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing
    type(); // Corrected function call
}

// --- 3D Tilt Profile Effect ---
const profileContainer = document.querySelector('.home .profile');
const profileImg = document.querySelector('.home .profile img');

if (profileContainer && profileImg) {
    profileContainer.addEventListener('mousemove', (e) => {
        const rect = profileContainer.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 15; // Max 15deg rotation
        const rotateY = ((centerX - x) / centerX) * 15; // Max 15deg rotation

        profileImg.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    profileContainer.addEventListener('mouseleave', () => {
        profileImg.style.transform = `rotateX(0) rotateY(0) scale(1)`;
    });
}

// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Animate only once
        }
    });
}, {
    threshold: 0.15, // Trigger when 15% visible
    rootMargin: "0px"
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});

