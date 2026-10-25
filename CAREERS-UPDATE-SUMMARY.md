# ✅ Careers Page - Update Summary

## Changes Made:

### 1. ✅ Added New Job Opening - Salesforce Developer
**Position:** Salesforce Developer  
**Location:** Gurugram, Haryana (On-site)  
**Experience:** 3-4 years  
**Status:** 1 Opening · Actively Hiring

**Details:**
- Full job description with responsibilities
- Required skills and certifications
- Preferred qualifications
- Compensation details
- Apply Now button (no LinkedIn)

---

### 2. ✅ Removed "Apply via LinkedIn" Button
**From all 4 job openings:**
- ERPNext / Python Developer
- Software Development Intern
- Business Analyst
- Salesforce Developer

Now only "Apply Now" button is available for all positions.

---

### 3. ✅ Removed All Placeholders from Apply Form
**Before:**
- Name: `placeholder="Rahul Sharma"`
- Phone: `placeholder="+91 98765 43210"`
- Email: `placeholder="rahul@gmail.com"`
- LinkedIn: `placeholder="https://linkedin.com/in/rahulsharma"`
- Salary: `placeholder="e.g. 4.5 LPA"`
- Experience: `placeholder="e.g. 2 years"`

**After:**
- All placeholders removed
- Clean input fields with labels only

---

### 4. ✅ Updated Apply Form Email Address
**From:** `info@infrasys.tech`  
**To:** `infrasyslimited.tech@gmail.com`

Modal header now shows:
> "Your application will be sent to **infrasyslimited.tech@gmail.com**"

---

## Current Job Openings (Total: 4)

### 1. ERPNext / Python Developer
- **Type:** Full-Time
- **Location:** Gurugram, NCR
- **Count:** 1 Opening
- **Status:** Actively Hiring
- **Experience:** Less than 3 years preferred

### 2. Software Development Intern
- **Type:** Internship
- **Location:** Gurugram, NCR
- **Count:** 2 Openings
- **Status:** Actively Hiring
- **Duration:** 6 Months Minimum

### 3. Business Analyst
- **Type:** Full-Time
- **Location:** Remote (Mumbai-based preferred)
- **Count:** 1 Opening
- **Status:** Actively Hiring

### 4. Salesforce Developer (NEW!) 🆕
- **Type:** Full-Time
- **Location:** Gurugram, NCR
- **Count:** 1 Opening
- **Status:** Actively Hiring
- **Experience:** 3-4 years required
- **Certifications:** Salesforce Platform Developer I (mandatory)

---

## Apply Form Flow:

```
User clicks "Apply Now" button
    ↓
Modal opens with job title
    ↓
User fills form (no placeholders)
    ↓
Uploads resume (PDF/DOC/DOCX)
    ↓
form-handler.js sends to backend
    ↓
Backend API: /api/apply
    ↓
Email sent to: infrasyslimited.tech@gmail.com
    ↓
Success message shown
```

---

## Backend Configuration:

**File:** `server/.env`
```env
RECIPIENT_EMAIL=infrasyslimited.tech@gmail.com
```

Applications will arrive in Gmail inbox with:
- All form data
- Resume attached
- Professional email template

---

## Testing Checklist:

- [ ] Open careers.html
- [ ] Verify 4 job openings visible
- [ ] Click Salesforce Developer job - expands properly
- [ ] Check "Apply Now" button - no LinkedIn button
- [ ] Click "Apply Now" - modal opens
- [ ] Verify no placeholders in form fields
- [ ] Check email shown: infrasyslimited.tech@gmail.com
- [ ] Fill form and submit (test)
- [ ] Check email arrives at infrasyslimited.tech@gmail.com

---

**All changes completed accurately and precisely!** ✅

Last Updated: August 20, 2026
