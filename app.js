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


