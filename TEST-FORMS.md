# ✅ Form Testing Instructions

## 🚀 Quick Test (2 Steps)

### **Step 1: Start Backend Server**

```powershell
cd server
npm start
```

**Expected output:**
```
✅ Infrasys mailer server running on http://localhost:3000
📧 Emails will be sent to: info@infrasys.tech
```

---

### **Step 2: Open Website**

**Option A - Use Backend Server** (Recommended):
```
http://localhost:3000
```

**Option B - Use Live Server** (VS Code extension):
```
Right-click index.html → "Open with Live Server"
http://127.0.0.1:5502
```

---

## 🧪 Testing Contact Forms

### **Test 1: Modal Contact Form** (All Pages)

1. Click **"Contact"** button (top-right)
2. Fill in:
   - Name: `Test User`
   - Phone: `+91 98765 43210`
   - Email: `test@example.com`
   - Subject: `Testing`
   - Message: `This is a test message`
3. Click **"Submit Inquiry"**
4. **Expected**: 
   - Button shows "Sending..." with spinner
   - Success message appears (green)
   - Form closes automatically after 2 seconds
   - Email arrives at `info@infrasys.tech`

---

### **Test 2: Main Contact Page Form**

1. Go to: `http://localhost:3000/contact.html`
2. Fill the form
3. Click **"Send Message"**
4. **Expected**: Same success behavior as modal form

---

### **Test 3: Careers Application Form**

1. Go to: `http://localhost:3000/careers.html`
2. Click **"Apply Now"** on any job
3. Fill form + upload PDF resume
4. Click **"Submit Application"**
5. **Expected**: 
   - Application submitted
   - Email arrives with resume attachment

---

## ❌ Troubleshooting

### Problem: "Failed to send" error

**Solution:**
- Make sure backend server is running (`npm start` in server folder)
- Check browser console (F12) for errors
- Verify `.env` file is configured correctly

### Problem: Redirects to Formspree

**Solution:**
- Clear browser cache (Ctrl + Shift + Delete)
- Hard reload page (Ctrl + Shift + R)
- Check that `form-handler.js` is loaded (F12 → Network tab)

### Problem: CORS error in console

**Solution:**
- Server is already configured for ports 5500, 5501, 5502
- If using different port, add it to `server.js` CORS config

---

## 📧 What Happens When Form is Submitted?

```
User fills form 
   ↓
form-handler.js captures submit event
   ↓
Sends data to backend API (http://localhost:3000/api/contact)
   ↓
Node.js server receives data
   ↓
Nodemailer connects to Gmail SMTP
   ↓
Email sent to info@infrasys.tech
   ↓
Success message shown to user
```

---

## ✅ All Forms Updated

The following forms now use your backend API:

1. **Modal Contact Form** (all 16 pages):
   - index.html, about.html, services.html, industries.html
   - team.html, process.html, careers.html, investor-relations.html
   - blogs.html, blog-gen-ai-erp.html, insights.html, events.html
   - contact.html, compliance.html, privacy-policy.html, terms.html

2. **Main Contact Form**:
   - index.html (home page)
   - contact.html (dedicated contact page)

3. **Careers Application Form**:
   - careers.html (with resume upload)

---

## 🌐 Production Deployment

When deploying to live server:

1. Deploy backend to Render/Railway/Heroku
2. Update `form-handler.js`:
   ```javascript
   const API_URL = 'https://your-backend-url.onrender.com';
   ```
3. Update CORS in `server.js` with your domain
4. Test all forms on production

---

**Last Updated**: August 20, 2026
