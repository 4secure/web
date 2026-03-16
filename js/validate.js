/**
* Contact Form Validation for Four Secure
* Handles form validation and AJAX submission to Web3Forms
*/

(function () {
    "use strict";

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Always initialize unified form for service pages
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            // Check if it's contact page form (has first-name field) or other forms
            const hasFirstNameField = contactForm.querySelector('#first-name') !== null;
            
            if (hasFirstNameField) {
                // This is contact page form
                initContactForm();
            } else {
                // This includes homepage and service page forms (both have name field, no first-name)
                initUnifiedForm();
            }
        }
        
        initServiceDropdown();
    });

    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (!contactForm) return;

        contactForm.removeAttribute('novalidate');

        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            resetFormErrors(this);
            
            if (validateContactForm(this)) {
                showLoading(this, true);
                submitForm(this);
            }
        });

        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this, 'contact');
            });
        });
    }

    function initUnifiedForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (!contactForm) return;

        contactForm.removeAttribute('novalidate');

        contactForm.addEventListener('submit', function(event) {
            console.log('Form submit event triggered');
            event.preventDefault();
            
            resetFormErrors(this);
            
            if (validateUnifiedForm(this)) {
                console.log('Validation passed, submitting form');
                showLoading(this, true);
                submitForm(this);
            } else {
                console.log('Validation failed, not submitting form');
            }
        });

        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this, 'unified');
            });
        });
    }

    function validateUnifiedForm(form) {
        console.log('validateUnifiedForm called');
        let isValid = true;
        
        // Required fields for unified forms (homepage and service pages)
        const requiredFields = [
            'name', 
            'email', 
            'message'
        ];
        
        requiredFields.forEach(fieldId => {
            const field = form.querySelector(`#${fieldId}`);
            if (!validateField(field, 'unified')) {
                isValid = false;
            }
        });
        
        // Validate service field (REQUIRED for all unified forms)
        const serviceField = form.querySelector('#service');
        const serviceValue = serviceField ? serviceField.value.trim() : '';
        const serviceTrigger = form.querySelector('.dropdown-selected');
        
        console.log('Service validation:', {
            serviceValue: serviceValue,
            serviceText: serviceTrigger ? serviceTrigger.textContent.trim() : 'no trigger'
        });
        
        // Check if no service is selected (either dropdown text is default OR hidden input is empty)
        if (serviceTrigger && (serviceTrigger.textContent.trim() === 'Select a service' || !serviceValue)) {
            console.log('Service validation failed - showing error');
            showFieldError(serviceTrigger, 'Please select a service');
            isValid = false;
        }
        
        // Validate consent checkbox
        const consent = form.querySelector('#consent');
        if (consent && !consent.checked) {
            showFieldError(consent, 'Please agree to data processing policy');
            isValid = false;
        }
        
        console.log('Final isValid:', isValid);
        return isValid;
    }

    function validateContactForm(form) {
        let isValid = true;
        
        // Required fields for contact page
        const requiredFields = [
            'first-name', 
            'last-name', 
            'email', 
            'company', 
            'subject', 
            'message'
        ];
        
        requiredFields.forEach(fieldId => {
            const field = form.querySelector(`#${fieldId}`);
            if (!validateField(field, 'contact')) {
                isValid = false;
            }
        });
        
        // Validate service field (optional but if selected, validate)
        const serviceField = form.querySelector('#service');
        const serviceValue = serviceField ? serviceField.value : '';
        const serviceTrigger = form.querySelector('.dropdown-selected');
      if (serviceTrigger && serviceTrigger.textContent === 'Select a service' && !serviceValue) {
    showFieldError(serviceTrigger, 'Please select a service');
    isValid = false;
}
        
        // Validate consent checkbox
        const consent = form.querySelector('#consent');
        if (consent && !consent.checked) {
            showFieldError(consent, 'Please agree to the data processing policy');
            isValid = false;
        }
        
        return isValid;
    }

    function validateServicePageForm(form) {
        let isValid = true;
        
        // Required fields for service page
        const requiredFields = [
            'name', 
            'email', 
            'message'
        ];
        
        requiredFields.forEach(fieldId => {
            const field = form.querySelector(`#${fieldId}`);
            if (!validateField(field, 'service-page')) {
                isValid = false;
            }
        });
        
        // Validate service field (REQUIRED for service page forms)
        const serviceField = form.querySelector('#service');
        const serviceValue = serviceField ? serviceField.value : '';
        const serviceTrigger = form.querySelector('.dropdown-selected');
        
        if (serviceTrigger && serviceTrigger.textContent === 'Select a service' && !serviceValue) {
            showFieldError(serviceTrigger, 'Please select a service');
            isValid = false;
        }
        
        // Validate consent checkbox
        const consent = form.querySelector('#consent');
        if (consent && !consent.checked) {
            showFieldError(consent, 'Please agree to the data processing policy');
            isValid = false;
        }
        
        return isValid;
    }

    function validateHomepageForm(form) {
        let isValid = true;
        
        // Required fields for homepage
        const requiredFields = [
            'name', 
            'email', 
            'message'
        ];
        
        requiredFields.forEach(fieldId => {
            const field = form.querySelector(`#${fieldId}`);
            if (!validateField(field, 'homepage')) {
                isValid = false;
            }
        });
        
        // Validate service field (optional but if selected, validate)
        const serviceField = form.querySelector('#service');
        const serviceValue = serviceField ? serviceField.value : '';
        const serviceTrigger = form.querySelector('.dropdown-selected');
        
       // Change from optional to required:
if (serviceTrigger && serviceTrigger.textContent === 'Select a service' && !serviceValue) {
    showFieldError(serviceTrigger, 'Please select a service');
    isValid = false;
}
        
        // Validate consent checkbox
        const consent = form.querySelector('#consent');
        if (consent && !consent.checked) {
            showFieldError(consent, 'Please agree to the data processing policy');
            isValid = false;
        }
        
        return isValid;
    }

    function validateField(field, formType = 'contact') {
        if (!field) return true;
        
        const value = field.value ? field.value.trim() : '';
        let isValid = true;
        let errorMessage = '';
        
        removeFieldError(field);
        
        if (field.required && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        
        if (isValid && value) {
            switch (field.id) {
                case 'email':
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(value)) {
                        errorMessage = 'Please enter a valid email address';
                        isValid = false;
                    }
                    break;
                    
                case 'phone':
                    if (value) {
                        const phonePattern = /^[0-9+\s\-\(\)]{7,20}$/;
                        if (!phonePattern.test(value)) {
                            errorMessage = 'Please enter a valid phone number';
                            isValid = false;
                        }
                    }
                    break;
                    
                case 'first-name':
                case 'last-name':
                case 'name':
                case 'company':
                case 'subject':
                    if (value.length < 2) {
                        errorMessage = 'Must be at least 2 characters';
                        isValid = false;
                    }
                    break;
                    
                case 'message':
                    // Different message length requirements for different form types
                    const minLength = (formType === 'unified') ? 5 : 10;
                    if (value.length < minLength) {
                        errorMessage = `Message must be at least ${minLength} characters`;
                        isValid = false;
                    }
                    break;
                    
                // Service field validation (if needed)
                case 'service':
                    if (!value) {
                        errorMessage = 'Please select a service';
                        isValid = false;
                    }
                    break;
            }
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }

    function showFieldError(field, message) {
        removeFieldError(field);
        
        field.classList.add('error');
        
        // Handle dropdown trigger specially
        if (field.classList.contains('dropdown-selected')) {
            // Find the parent dropdown and add error class
            const dropdown = field.closest('.custom-dropdown');
            if (dropdown) {
                dropdown.classList.add('error');
                
                // Create or show error message for dropdown
                let errorSpan = dropdown.parentElement.querySelector('.form-error');
                if (errorSpan) {
                    errorSpan.textContent = message;
                }
            }
        } else {
            // Regular field error
            let errorSpan = field.parentElement.querySelector('.form-error');
            if (errorSpan) {
                errorSpan.textContent = message;
            }
        }
        
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    function removeFieldError(field) {
        field.classList.remove('error');
        
        // Handle dropdown trigger specially
        if (field.classList.contains('dropdown-selected')) {
            const dropdown = field.closest('.custom-dropdown');
            if (dropdown) {
                dropdown.classList.remove('error');
            }
        }
        
        const errorSpan = field.parentElement.querySelector('.form-error');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    }

    function resetFormErrors(form) {
        const successMsg = form.querySelector('.form-success');
        if (successMsg) {
            successMsg.style.display = 'none';
        }
        
        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
        });
        
        const errorSpans = form.querySelectorAll('.form-error');
        errorSpans.forEach(span => {
            span.textContent = '';
        });
        
        // Remove error class from dropdowns
        const dropdowns = form.querySelectorAll('.custom-dropdown.error');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('error');
        });
    }

    function showLoading(form, show) {
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (show) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; margin-right: 8px;">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25" fill="none"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" fill="none"/>
                </svg>
                Sending...
            `;
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send Message
            `;
        }
    }

    function submitForm(form) {
        const formData = new FormData(form);
        
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            showLoading(form, false);
            
            if (data.success) {
                const successMsg = form.querySelector('.form-success');
                successMsg.style.display = 'block';
                form.reset();
                resetServiceDropdown();
                
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 5000);
            } else {
                alert(data.message || 'Form submission failed. Please try again.');
            }
        })
        .catch(error => {
            showLoading(form, false);
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    }

    function initServiceDropdown() {
        const dropdownTrigger = document.getElementById('service-dropdown-trigger');
        const dropdownMenu = document.getElementById('service-dropdown-menu');
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        const hiddenInput = document.getElementById('service');
        
        if (!dropdownTrigger || !dropdownMenu) return;

        // Remove any existing error when selecting
        dropdownTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
            dropdownTrigger.classList.toggle('active');
            
            // Remove error class when opening dropdown
            const dropdown = this.closest('.custom-dropdown');
            if (dropdown) {
                dropdown.classList.remove('error');
                const errorSpan = dropdown.parentElement.querySelector('.form-error');
                if (errorSpan) {
                    errorSpan.textContent = '';
                }
            }
        });
        
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                const value = this.dataset.value;
                const text = this.querySelector('span:last-child').textContent;
                
                dropdownTrigger.querySelector('.dropdown-selected').textContent = text;
                hiddenInput.value = value;
                
                dropdownMenu.classList.remove('active');
                dropdownTrigger.classList.remove('active');
                
                dropdownItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Remove error class when item is selected
                const dropdown = dropdownTrigger.closest('.custom-dropdown');
                if (dropdown) {
                    dropdown.classList.remove('error');
                    const errorSpan = dropdown.parentElement.querySelector('.form-error');
                    if (errorSpan) {
                        errorSpan.textContent = '';
                    }
                }
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
                dropdownTrigger.classList.remove('active');
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdownMenu.classList.remove('active');
                dropdownTrigger.classList.remove('active');
            }
        });
    }

    function resetServiceDropdown() {
        const dropdownTrigger = document.getElementById('service-dropdown-trigger');
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        const hiddenInput = document.getElementById('service');
        
        if (dropdownTrigger) {
            dropdownTrigger.querySelector('.dropdown-selected').textContent = 'Select a service';
        }
        
        if (hiddenInput) {
            hiddenInput.value = '';
        }
        
        dropdownItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // Remove any error class
        const dropdown = dropdownTrigger?.closest('.custom-dropdown');
        if (dropdown) {
            dropdown.classList.remove('error');
        }
    }
})();