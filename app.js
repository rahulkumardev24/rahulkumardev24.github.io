// Get DOM elements
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
/// CV download Button
let cvDow = document.querySelectorAll("#cvDow");
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


// --- Particle Constellation Effect ---
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    let particlesArray;

    // Mouse position
    let mouse = {
        x: null,
        y: null,
        radius: 170
    }

    window.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    // Particle Class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw individual particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color; 
            ctx.fill();
        }

        // Update particle position
        update() {
            // Check if particle is still within canvas
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // check collision detection - mouse position / particle position
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < mouse.radius + this.size){
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 10;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 10;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 10;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 10;
                }
            }
            // move particle
            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        }
    }

    // Create particle array
    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 2) - 1;
            let directionY = (Math.random() * 2) - 1;
            let color = '#3dcfd3'; // Primary color

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Check if particles are close enough to draw line
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                     opacityValue = 1 - (distance / 20000);
                     ctx.strokeStyle = 'rgba(61, 207, 211,' + opacityValue + ')';
                     ctx.lineWidth = 1;
                     ctx.beginPath();
                     ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                     ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                     ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    // Resize event
    window.addEventListener('resize', () => {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        init();
    });

    // Start
    init();
    animate();
}


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

