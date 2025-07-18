zdocument.addEventListener('DOMContentLoaded', function() {
    
    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const profileDetails = document.getElementById('profileDetails');
    const editProfileForm = document.getElementById('editProfileForm');

    if (editProfileBtn && cancelEditBtn) {
        editProfileBtn.addEventListener('click', function() {
            profileDetails.style.display = 'none';
            editProfileForm.style.display = 'block';
        });

        cancelEditBtn.addEventListener('click', function() {
            editProfileForm.style.display = 'none';
            profileDetails.style.display = 'block';
        });
    }

    // Profile picture upload functionality
    const profileUpload = document.getElementById('profile-upload');
    const profilePic = document.querySelector('.profile-pic');
    const initialElement = document.querySelector('.initial');

    if (profileUpload) {
        profileUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];

            if (file && file.type.match('image.*')) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    // If there's no img element yet, create one
                    if (!profilePic.querySelector('img')) {
                        const img = document.createElement('img');
                        profilePic.innerHTML = '';
                        profilePic.appendChild(img);
                        profilePic.classList.remove('no-pic');
                    }

                    // Set the image source to the uploaded file
                    const img = profilePic.querySelector('img');
                    img.src = e.target.result;

        
                    if (initialElement) {
                        initialElement.style.display = 'none';
                    }
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // Validate form before submission
    const profileForm = document.querySelector('form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            // Phone number validation
            const phoneInput = document.getElementById('phoneNumber');
            if (phoneInput && phoneInput.value) {
                const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
                if (!phoneRegex.test(phoneInput.value)) {
                    event.preventDefault();
                    alert('Please enter a valid phone number');
                    phoneInput.focus();
                    return false;
                }
            }

            // Date of birth validation 
            const dobInput = document.getElementById('dateOfBirth');
            if (dobInput && dobInput.value) {
                const dob = new Date(dobInput.value);
                const today = new Date();
                const minAge = 16;

                let age = today.getFullYear() - dob.getFullYear();
                const monthDiff = today.getMonth() - dob.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                    age--;
                }

                if (age < minAge) {
                    event.preventDefault();
                    alert('You must be at least ' + minAge + ' years old');
                    dobInput.focus();
                    return false;
                }
            }

            return true;
        });
    }

    // Add animation to stats
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        statNumbers.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            let currentValue = 0;
            const duration = 1500;
            const frameRate = 30;
            const increment = finalValue / (duration / frameRate);

            function updateCounter() {
                if (currentValue < finalValue) {
                    currentValue += increment;
                    if (currentValue > finalValue) {
                        currentValue = finalValue;
                    }
                    stat.textContent = Math.floor(currentValue);
                    requestAnimationFrame(updateCounter);
                }
            }

            // Start animation when element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(stat);
        });
    }

    // Enhanced hover effects for event cards
    const eventCards = document.querySelectorAll('.event-card');
    if (eventCards.length > 0) {
        eventCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }
});