// ============================================
// Infrasys Contact Form Handler
// ============================================

(function() {
    'use strict';

    // Backend API URL
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : 'https://infrasys-backend.onrender.com'; // ← Update this with your actual Render URL

    // ============================================
    // Modal Contact Form Handler
    // ============================================
    const modalForm = document.getElementById('modal-contact-form');
    if (modalForm) {
        modalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Get form data
            const formData = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                message: form.message.value.trim()
            };
            
            // If subject field exists, append it to message
            if (form.subject) {
                formData.message = 'Subject: ' + form.subject.value.trim() + '\n\n' + formData.message;
            }
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            
            // Check if status div exists, if not create it
            let statusDiv = document.getElementById('modal-form-status');
            if (!statusDiv) {
                statusDiv = document.createElement('div');
                statusDiv.id = 'modal-form-status';
                statusDiv.style.cssText = 'margin-bottom:16px;padding:12px;border-radius:8px;display:none;font-size:0.9rem;';
                submitBtn.parentElement.insertBefore(statusDiv, submitBtn);
            }
            statusDiv.style.display = 'none';
            
            try {
                const response = await fetch(`${API_URL}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    statusDiv.style.display = 'block';
                    statusDiv.style.background = '#d4edda';
                    statusDiv.style.color = '#155724';
                    statusDiv.style.border = '1px solid #c3e6cb';
                    statusDiv.innerHTML = '<i class="fa-solid fa-check-circle"></i> ' + (data.message || 'Message sent successfully!');
                    form.reset();
                    
                    // Close modal after 2 seconds
                    setTimeout(() => {
                        if (typeof closeContactModal === 'function') {
                            closeContactModal();
                        }
                    }, 2000);
                } else {
                    throw new Error(data.error || 'Failed to send message');
                }
            } catch (error) {
                statusDiv.style.display = 'block';
                statusDiv.style.background = '#f8d7da';
                statusDiv.style.color = '#721c24';
                statusDiv.style.border = '1px solid #f5c6cb';
                statusDiv.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i> ' + error.message;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // ============================================
    // Main Page Contact Form Handler
    // ============================================
    const mainForm = document.getElementById('contact-form');
    if (mainForm) {
        mainForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Get form data
            const formData = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone ? form.phone.value.trim() : '',
                company: form.company ? form.company.value.trim() : '',
                service: form.service ? form.service.value : '',
                message: form.message.value.trim()
            };
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            
            // Check if status div exists, if not create it
            let statusDiv = document.getElementById('contact-form-status');
            if (!statusDiv) {
                statusDiv = document.createElement('div');
                statusDiv.id = 'contact-form-status';
                statusDiv.style.cssText = 'margin-bottom:16px;padding:12px;border-radius:8px;display:none;font-size:0.9rem;';
                submitBtn.parentElement.insertBefore(statusDiv, submitBtn);
            }
            statusDiv.style.display = 'none';
            
            try {
                const response = await fetch(`${API_URL}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    statusDiv.style.display = 'block';
                    statusDiv.style.background = '#d4edda';
                    statusDiv.style.color = '#155724';
                    statusDiv.style.border = '1px solid #c3e6cb';
                    statusDiv.innerHTML = '<i class="fa-solid fa-check-circle"></i> ' + (data.message || 'Message sent successfully!');
                    form.reset();
                } else {
                    throw new Error(data.error || 'Failed to send message');
                }
            } catch (error) {
                statusDiv.style.display = 'block';
                statusDiv.style.background = '#f8d7da';
                statusDiv.style.color = '#721c24';
                statusDiv.style.border = '1px solid #f5c6cb';
                statusDiv.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i> ' + error.message;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // ============================================
    // Careers Application Form Handler
    // ============================================
    const applyForm = document.getElementById('apply-form');
    if (applyForm) {
        applyForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('position', form.position.value);
            formData.append('name', form.name.value.trim());
            formData.append('email', form.email.value.trim());
            formData.append('phone', form.phone.value.trim());
            formData.append('linkedin', form.linkedin ? form.linkedin.value.trim() : '');
            formData.append('salary', form.salary ? form.salary.value.trim() : 'Not specified');
            formData.append('experience', form.experience ? form.experience.value : '');
            formData.append('message', form.message.value.trim());
            
            // Get resume file
            const resumeInput = form.resume;
            if (resumeInput && resumeInput.files[0]) {
                formData.append('resume', resumeInput.files[0]);
            } else {
                alert('Please upload your resume');
                return;
            }
            
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
            
            // Check if status div exists
            let statusDiv = document.getElementById('apply-form-status');
            if (!statusDiv) {
                statusDiv = document.createElement('div');
                statusDiv.id = 'apply-form-status';
                statusDiv.style.cssText = 'margin-bottom:16px;padding:12px;border-radius:8px;display:none;font-size:0.9rem;';
                submitBtn.parentElement.insertBefore(statusDiv, submitBtn);
            }
            statusDiv.style.display = 'none';
            
            try {
                const response = await fetch(`${API_URL}/api/apply`, {
                    method: 'POST',
                    body: formData // Don't set Content-Type header for FormData
                });
                
                const data = await response.json();
                
                if (response.ok && data.success) {
                    statusDiv.style.display = 'block';
                    statusDiv.style.background = '#d4edda';
                    statusDiv.style.color = '#155724';
                    statusDiv.style.border = '1px solid #c3e6cb';
                    statusDiv.innerHTML = '<i class="fa-solid fa-check-circle"></i> ' + (data.message || 'Application submitted successfully!');
                    form.reset();
                    
                    // Close modal after 3 seconds
                    setTimeout(() => {
                        if (typeof closeModal === 'function') {
                            closeModal();
                        }
                    }, 3000);
                } else {
                    throw new Error(data.error || 'Failed to submit application');
                }
            } catch (error) {
                statusDiv.style.display = 'block';
                statusDiv.style.background = '#f8d7da';
                statusDiv.style.color = '#721c24';
                statusDiv.style.border = '1px solid #f5c6cb';
                statusDiv.innerHTML = '<i class="fa-solid fa-exclamation-circle"></i> ' + error.message;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

})();
