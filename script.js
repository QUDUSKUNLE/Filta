// Application State
let userState = {
    trialStartDate: localStorage.getItem('trialStartDate') || new Date().toISOString(),
    trialDaysRemaining: 7,
    isSubscribed: localStorage.getItem('isSubscribed') === 'true',
    subscriptionPlan: localStorage.getItem('subscriptionPlan') || null,
    downloadsToday: parseInt(localStorage.getItem('downloadsToday')) || 0,
    lastDownloadDate: localStorage.getItem('lastDownloadDate') || null
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateTrialStatus();
});

function initializeApp() {
    // Save trial start date if not exists
    if (!localStorage.getItem('trialStartDate')) {
        localStorage.setItem('trialStartDate', userState.trialStartDate);
    }
    
    // Reset daily download count if new day
    const today = new Date().toDateString();
    if (userState.lastDownloadDate !== today) {
        userState.downloadsToday = 0;
        localStorage.setItem('downloadsToday', '0');
        localStorage.setItem('lastDownloadDate', today);
    }
    
    // Set default save location
    document.getElementById('saveLocation').value = getDefaultDownloadPath();
}

function setupEventListeners() {
    // Download functionality
    document.getElementById('downloadBtn').addEventListener('click', handleDownload);
    document.getElementById('browseBtn').addEventListener('click', browseSaveLocation);
    
    // Modal functionality
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('subscriptionForm').addEventListener('submit', handleSubscription);
    
    // Navigation
    document.getElementById('loginBtn').addEventListener('click', () => alert('Login functionality would be implemented here'));
    document.getElementById('signupBtn').addEventListener('click', () => alert('Signup functionality would be implemented here'));
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('subscriptionModal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

function updateTrialStatus() {
    const trialStart = new Date(userState.trialStartDate);
    const now = new Date();
    const daysPassed = Math.floor((now - trialStart) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 7 - daysPassed);
    
    userState.trialDaysRemaining = daysRemaining;
    
    const trialStatusElement = document.getElementById('trialStatus');
    const trialDaysElement = document.getElementById('trialDays');
    
    if (userState.isSubscribed) {
        trialStatusElement.innerHTML = `
            <i class="fas fa-crown"></i>
            <span>Premium Member - ${userState.subscriptionPlan}</span>
        `;
        trialStatusElement.style.background = 'rgba(40, 167, 69, 0.2)';
    } else if (daysRemaining > 0) {
        trialDaysElement.textContent = `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
    } else {
        trialStatusElement.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>Trial Expired - Subscribe to continue</span>
        `;
        trialStatusElement.style.background = 'rgba(220, 53, 69, 0.2)';
        showTrialExpiredModal();
    }
}

function handleDownload() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const saveLocation = document.getElementById('saveLocation').value.trim();
    
    if (!videoUrl) {
        alert('Please enter a video URL');
        return;
    }
    
    if (!saveLocation) {
        alert('Please select a save location');
        return;
    }
    
    // Check trial/subscription status
    if (!userState.isSubscribed && userState.trialDaysRemaining <= 0) {
        showTrialExpiredModal();
        return;
    }
    
    // Check daily download limits for trial users
    if (!userState.isSubscribed && userState.downloadsToday >= 10) {
        alert('Daily download limit reached (10 downloads). Upgrade to Premium for unlimited downloads.');
        showPricing();
        return;
    }
    
    // Validate URL format
    if (!isValidVideoUrl(videoUrl)) {
        alert('Please enter a valid video URL');
        return;
    }
    
    startDownload(videoUrl, saveLocation);
}

function isValidVideoUrl(url) {
    try {
        const urlObj = new URL(url);
        const validDomains = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'twitch.tv'];
        return validDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
        return false;
    }
}

function startDownload(url, location) {
    const progressContainer = document.getElementById('downloadProgress');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Show progress bar
    progressContainer.style.display = 'block';
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        progressText.textContent = `Downloading... ${Math.round(progress)}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            completeDownload(url, location);
        }
    }, 200);
}

function completeDownload(url, location) {
    const progressContainer = document.getElementById('downloadProgress');
    const progressText = document.querySelector('.progress-text');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Update UI
    progressText.textContent = 'Download completed!';
    downloadBtn.disabled = false;
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    
    // Update download count
    if (!userState.isSubscribed) {
        userState.downloadsToday++;
        localStorage.setItem('downloadsToday', userState.downloadsToday.toString());
    }
    
    // Hide progress after delay
    setTimeout(() => {
        progressContainer.style.display = 'none';
        document.getElementById('videoUrl').value = '';
    }, 3000);
    
    // Show success message
    showNotification('Video downloaded successfully!', 'success');
}

function browseSaveLocation() {
    // In a real application, this would open a file dialog
    // For demo purposes, we'll simulate folder selection
    const folders = [
        '/Users/Downloads',
        '/Users/Documents/Videos',
        '/Users/Desktop',
        '/Users/Movies'
    ];
    
    const selectedFolder = folders[Math.floor(Math.random() * folders.length)];
    document.getElementById('saveLocation').value = selectedFolder;
}

function getDefaultDownloadPath() {
    // Return a default download path based on the operating system
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Mac')) {
        return '/Users/' + (navigator.userAgent.includes('Chrome') ? 'Downloads' : 'Downloads');
    } else if (userAgent.includes('Windows')) {
        return 'C:\\Users\\Downloads';
    } else {
        return '/home/Downloads';
    }
}

function selectPlan(planType) {
    const plans = {
        monthly: {
            name: 'Monthly Plan',
            price: '$9.99/month',
            features: ['Unlimited downloads', 'HD & 4K quality', 'Priority support', 'Batch downloads']
        },
        yearly: {
            name: 'Yearly Plan',
            price: '$99.99/year',
            features: ['Everything in Monthly', 'Advanced analytics', 'API access', 'Custom integrations']
        }
    };
    
    const selectedPlan = plans[planType];
    if (!selectedPlan) return;
    
    // Update modal content
    document.getElementById('selectedPlan').innerHTML = `
        <h3>${selectedPlan.name}</h3>
        <div style="font-size: 1.5rem; color: #667eea; font-weight: bold; margin: 0.5rem 0;">
            ${selectedPlan.price}
        </div>
        <ul style="text-align: left; margin-top: 1rem;">
            ${selectedPlan.features.map(feature => `<li><i class="fas fa-check" style="color: #28a745; margin-right: 0.5rem;"></i>${feature}</li>`).join('')}
        </ul>
    `;
    
    // Show modal
    document.getElementById('subscriptionModal').style.display = 'block';
}

function handleSubscription(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = document.getElementById('email').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    
    // Basic validation
    if (!email || !cardNumber || !expiry || !cvv) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate payment processing
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Simulate successful subscription
        userState.isSubscribed = true;
        userState.subscriptionPlan = document.getElementById('selectedPlan').querySelector('h3').textContent;
        
        localStorage.setItem('isSubscribed', 'true');
        localStorage.setItem('subscriptionPlan', userState.subscriptionPlan);
        
        closeModal();
        updateTrialStatus();
        showNotification('Subscription successful! Welcome to Premium!', 'success');
        
        // Reset form
        event.target.reset();
        submitBtn.innerHTML = 'Subscribe Now';
        submitBtn.disabled = false;
    }, 2000);
}

function closeModal() {
    document.getElementById('subscriptionModal').style.display = 'none';
    document.getElementById('trialExpiredModal').style.display = 'none';
}

function showTrialExpiredModal() {
    document.getElementById('trialExpiredModal').style.display = 'block';
}

function showPricing() {
    document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
    closeModal();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#667eea'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Format card number input
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
    e.target.value = formattedValue;
});

// Format expiry date input
document.getElementById('expiry').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

// Format CVV input
document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
});