# UI API Integration Guide

This document provides the necessary details for integrating the backend APIs with the UI. It includes endpoints, required payloads, and expected responses for Authentication, Patient Management (CRUD), and Poorva Karma routes.

## Base URL
Assuming local development, the base URL is: `https://bhastikarma-app-backend.onrender.com`

## Authentication Header
**Important:** All routes EXCEPT Login and Signup require an Authorization header with a Bearer token.
```http
Authorization: Bearer <your_jwt_token_here>
```

---

## 1. Authentication Routes

### 1.1 Signup
Create a new doctor/user account.
- **Method & Endpoint:** `POST /api/auth/signup`
- **Headers:** `Content-Type: application/json`
- **Payload:**
```json
{
  "name": "Dr. John Doe",
  "email": "johndoe@example.com",
  "password": "securepassword",
  "role": "doctor" // Optional, defaults to 'doctor'
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Dr. John Doe",
    "email": "johndoe@example.com",
    "role": "doctor"
  }
}
```

### 1.2 Login
Authenticate an existing user and get the JWT token.
- **Method & Endpoint:** `POST /api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Payload:**
```json
{
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Dr. John Doe",
    "email": "johndoe@example.com",
    "role": "doctor",
    "token": "eyJhbGciOiJIUzI1NiIsInR..." // Store this token for authenticated requests
  }
}
```

---

## 2. Patient Routes (CRUD)

### 2.1 Create a Patient
- **Method & Endpoint:** `POST /api/patients`
- **Headers:** `Content-Type: application/json` (or `multipart/form-data` if uploading a photo)
- **Payload (JSON Example):**
```json
{
  "demographics": {
    "fullName": "Jane Smith",
    "age": 45,
    "sex": "Female",
    "religion": "Hindu",
    "occupation": "Teacher",
    "maritalStatus": "Married",
    "address": "123 Main St",
    "phoneNo": "9876543210"
  },
  "hospitalInfo": {
    "admissionType": "OPD",
    "opdNumber": "OPD1234",
    "ipdNumber": "IPD1234",
    "clinicalDiseaseSelection": "Arthritis",
    "customDiagnosis": "Rheumatoid Arthritis"
  },
  "ClinicalInformation": {
    "chiefComplaints": "Severe joint pain",
    "historyOfPresentIllness": "Pain started 2 months ago",
    "historyOfPastIllness": "None",
    "familyHistory": "Mother had arthritis"
  },
  "personalHistory": {
    "ahara": "Veg",
    "vihara": "Sedentary",
    "addiction": "None",
    "bowelHabits": "Regular",
    "nidra": "Sound",
    "urineFrequency": "Normal",
    "bloodGroup": "O+"
  },
  "generalExamination": {
    "bp": "120/80",
    "rr": "18",
    "hr": "72",
    "temperature": "98.6",
    "weight": 65,
    "height": 160,
    "bmi": 25.4
  },
  "treatment": "Basti"
}
```
*Note: If you need to upload a photo, send the data as `multipart/form-data` and include the file in a field named `photo`.*
- **Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "64f2b3c4d5e6f7a8b9c0d1e2",
    "demographics": { ... },
    // ... complete patient object
  }
}
```

### 2.2 Get All Patients (for logged-in doctor)
- **Method & Endpoint:** `GET /api/patients`
- **Payload:** None
- **Success Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "64f2b3c4d5e6f7a8b9c0d1e2",
      "demographics": { "fullName": "Jane Smith", ... },
      // ... patient object details
    }
  ]
}
```

### 2.3 Get Single Patient by ID
- **Method & Endpoint:** `GET /api/patients/:id`
- **Payload:** None
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64f2b3c4d5e6f7a8b9c0d1e2",
    "demographics": { "fullName": "Jane Smith", ... },
    // ... full patient object details
  }
}
```

### 2.4 Update a Patient
- **Method & Endpoint:** `PUT /api/patients/:id`
- **Headers:** `Content-Type: application/json` (or `multipart/form-data` if uploading a photo)
- **Payload:** Send only the fields you want to update (similar to the Create Patient payload).
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64f2b3c4d5e6f7a8b9c0d1e2",
    // ... updated patient object details
  }
}
```

### 2.5 Delete a Patient
- **Method & Endpoint:** `DELETE /api/patients/:id`
- **Payload:** None
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Patient removed successfully"
}
```

---

## 3. Poorva Karma Routes
These routes evaluate specific parameters before the primary treatment. All of them use the Patient ID in the URL.

### 3.1 Update Niruha Eligibility
- **Method & Endpoint:** `PUT /api/poorva-karma/:patientId/niruha`
- **Headers:** `Content-Type: application/json`
- **Payload:**
```json
{
  "recentInternalSnehanaEtc": false,
  "continuousVomitingEtc": false,
  "historyOfMiscarriageOrPregnant": false,
  "uncontrolledDiabetesHypertensionCkd": false
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "isEligible": true,
  "message": "Eligible"
}
```

### 3.2 Update Anuvasana Eligibility
- **Method & Endpoint:** `PUT /api/poorva-karma/:patientId/anuvasana`
- **Headers:** `Content-Type: application/json`
- **Payload:**
```json
{
  "hasAsthapanaContraindications": false,
  "impairedDigestion": false,
  "diarrhoeaOrHardBowel": false,
  "intestinalWormsPleehaEtc": false,
  "aruchiPoisoningCoryzaEtc": false
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "isEligible": true,
  "message": "Eligible"
}
```

### 3.3 Update Pariksha
- **Method & Endpoint:** `PUT /api/poorva-karma/:patientId/pariksha`
- **Headers:** `Content-Type: application/json`
- **Payload:**
```json
{
  "prakriti": "Vata-Pitta",
  "sarataha": "Madhyam",
  "sanhanan": "Pravara",
  "pramana": "Madhyam",
  "satva": "Pravara",
  "satmya": "Madhyam",
  "aharaShakti": "Pravara",
  "vyayamaShakti": "Madhyam",
  "vaya": "Madhyam",
  "jihwa": "Nirlipta"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "prakriti": "Vata-Pitta",
    // ... other pariksha fields saved
  }
}
```

### 3.4 Update Agni Assessment
- **Method & Endpoint:** `PUT /api/poorva-karma/:patientId/agni`
- **Headers:** `Content-Type: application/json`
- **Payload:**
```json
{
  "jaranShaktiScore": 3,
  "abhyavaharanaShaktiScore": 3,
  "ruchiScore": 4,
  "recommendedDrugs": "Chitrakadi Vati"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "totalScore": 10,
  "agniType": "Madhyam Agni(sama agni)",
  "data": {
    "jaranShaktiScore": 3,
    "abhyavaharanaShaktiScore": 3,
    "ruchiScore": 4,
    "totalScore": 10,
    "agniType": "Madhyam Agni(sama agni)",
    "recommendedDrugs": "Chitrakadi Vati"
  }
}
```

### 3.5 Update Kostha Assessment
- **Method & Endpoint:** `PUT /api/poorva-karma/:patientId/kostha`
- **Headers:** `Content-Type: application/json`
- **Payload:**
```json
{
  "bowelFrequencyScore": 2,
  "consistencyScore": 2,
  "urgencyScore": 1,
  "patientExperienceScore": 2,
  "foodHabitChangeScore": 1
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "totalScore": 8,
  "kosthaType": "Madhyam kostha",
  "data": {
    // ... saved kostha object data
  }
}
```

### 3.6 Update Saama Nirama Lakshana
- **Method & Endpoint:** `PUT /api/poorva-karma/:patientId/saama-nirama`
- **Headers:** `Content-Type: application/json`
- **Payload:**
```json
{
  "srotorodha": false,
  "balabhransha": false,
  "gaurava": true,
  "alasya": false,
  "anilaMudhata": false,
  "apaki": false,
  "nishthivana": false,
  "malaSanga": false,
  "aruchi": true,
  "klama": false
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "deepanPachanaRequired": true,
  "data": {
    "gaurava": true,
    "aruchi": true,
    "deepanPachanaRequired": true
    // ... rest of the symptoms
  }
}
```

### 3.7 Update Bala
- **Method & Endpoint:** `PUT /api/poorva-karma/:patientId/bala`
- **Headers:** `Content-Type: application/json`
- **Payload:**
```json
{
  "bala": "Madhyam"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "bala": "Madhyam"
}
```

### 3.8 Mark Poorva Karma Completed
- **Method & Endpoint:** `PUT /api/poorva-karma/:patientId/complete`
- **Payload:** None (empty object `{}` is fine if client requires body)
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Poorva Karma marked as completed",
  "data": {
    "poorvaKarmaCompleted": true,
    "pradhanaKarmaCompleted": false,
    "paschataKarmaCompleted": false
  }
}
```
