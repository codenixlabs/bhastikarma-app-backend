# Flutter API Integration Guide (Bhastikarma App)

This guide provides everything a Flutter developer needs to integrate the backend APIs.

## 🔗 Base Configuration
- **Base URL (Physical Device)**: `https://bhastikarma-app-backend.onrender.com/api`
- **Headers**: All requests (except Auth) require the Authorization header.
  ```dart
  {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_JWT_TOKEN>'
  }
  ```

---

## 🔐 1. Authentication (`/auth`)
Store the returned `token` securely using `flutter_secure_storage` or `shared_preferences`.

### 1.1 Signup
- **Endpoint**: `POST /auth/signup`
- **Auth Required**: No
- **Payload**:
  ```json
  {
    "name": "Dr. John",
    "email": "doctor@test.com",
    "password": "password123",
    "role": "doctor" // optional, defaults to "doctor"
  }
  ```

### 1.2 Login
- **Endpoint**: `POST /auth/login`
- **Auth Required**: No
- **Payload**:
  ```json
  {
    "email": "doctor@test.com",
    "password": "password123"
  }
  ```
- **Response**: Contains the `token` inside the `data` object.

---

## 🏥 2. Patients (`/patients`)
All endpoints below require the `Authorization` header.

### 2.1 Get All Patients
- **Endpoint**: `GET /patients`
- **Auth Required**: Yes

### 2.2 Create Patient
- **Endpoint**: `POST /patients`
- **Auth Required**: Yes
- **Note**: If sending an image (`photo`), use `MultipartRequest` in Flutter instead of JSON. Otherwise, use standard JSON.
- **Payload** (JSON example without image):
  ```json
  {
    "demographics": {
      "fullName": "Rahul Sharma",
      "age": 45,
      "sex": "Male"
    },
    "hospitalInfo": {
      "admissionType": "OPD"
    },
    "ClinicalInformation": {
      "chiefComplaints": "Lower back pain"
    },
    "treatment": "Kati Basti"
  }
  ```
*(Check `models/Patient.js` for all optional fields like personalHistory, generalExamination, etc.)*

### 2.3 Get Patient by ID
- **Endpoint**: `GET /patients/<patient_id>`
- **Auth Required**: Yes

### 2.4 Update Patient
- **Endpoint**: `PUT /patients/<patient_id>`
- **Auth Required**: Yes
- **Payload**: Same structure as Create Patient, just pass fields to update.

### 2.5 Delete Patient
- **Endpoint**: `DELETE /patients/<patient_id>`
- **Auth Required**: Yes

---

## 📋 3. Poorva Karma Assessments (`/poorva-karma`)
These endpoints update specific sections of the Poorva Karma assessment for a specific patient.

### 3.1 Niruha Eligibility
- **Endpoint**: `PUT /poorva-karma/<patient_id>/niruha`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "recentInternalSnehanaEtc": false,
    "continuousVomitingEtc": false,
    "historyOfMiscarriageOrPregnant": false,
    "uncontrolledDiabetesHypertensionCkd": false
  }
  ```
*(Backend automatically calculates `isEligible` based on these booleans).*

### 3.2 Anuvasana Eligibility
- **Endpoint**: `PUT /poorva-karma/<patient_id>/anuvasana`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "hasAsthapanaContraindications": false,
    "impairedDigestion": false,
    "diarrhoeaOrHardBowel": false,
    "intestinalWormsPleehaEtc": false,
    "aruchiPoisoningCoryzaEtc": false
  }
  ```

### 3.3 Pariksha
- **Endpoint**: `PUT /poorva-karma/<patient_id>/pariksha`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "prakriti": "Vata",
    "sarataha": "Madhyam",
    "sanhanan": "Madhyam",
    "pramana": "Madhyam",
    "satva": "Madhyam",
    "satmya": "Madhyam",
    "aharaShakti": "Madhyam",
    "vyayamaShakti": "Avara",
    "vaya": "Madhyam",
    "jihwa": "Nirlipta"
  }
  ```

### 3.4 Agni Assessment
- **Endpoint**: `PUT /poorva-karma/<patient_id>/agni`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "jaranShaktiScore": 3,
    "abhyavaharanaShaktiScore": 4,
    "ruchiScore": 4
  }
  ```

### 3.5 Kostha Assessment
- **Endpoint**: `PUT /poorva-karma/<patient_id>/kostha`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "bowelFrequencyScore": 2,
    "consistencyScore": 2,
    "urgencyScore": 1,
    "patientExperienceScore": 2,
    "foodHabitChangeScore": 1
  }
  ```

### 3.6 Saama Nirama Lakshana
- **Endpoint**: `PUT /poorva-karma/<patient_id>/saama-nirama`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "srotorodha": true,
    "balabhransha": false,
    "gaurava": false,
    "alasya": true,
    "anilaMudhata": false,
    "apaki": false,
    "nishthivana": false,
    "malaSanga": false,
    "aruchi": false,
    "klama": false
  }
  ```

### 3.7 Bala Assessment
- **Endpoint**: `PUT /poorva-karma/<patient_id>/bala`
- **Auth Required**: Yes
- **Payload**:
  ```json
  {
    "bala": "Madhyama" // Options: 'Pravara', 'Madhyama', 'Avara'
  }
  ```
