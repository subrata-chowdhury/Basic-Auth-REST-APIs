## Basic Auth APIs Documentation

### POST /api/auth/register
Registers a new user.

**Request Body (JSON):**
- `email` (string): User's email address.
- `password` (string): User's password.
- `username` (string): Desired username.

**Response:**
- Returns user registration status and details.

---

### POST /api/auth/login
Authenticates a user and returns a session/token.

**Request Body (JSON):**
- `username` (string): User's username.
- `password` (string): User's password.

**Response:**
- Returns authentication status and token if successful.

---

### POST /api/auth/forget
Generates and sends an OTP for password reset.

**Request Body (JSON):**
- `username` (string): User's username.

**Response:**
- Returns OTP generation status.

---

### POST /api/auth/checkOtp
Verifies the OTP sent to the user.

**Request Body (JSON):**
- `username` (string): User's username.
- `otp` (string): One-time password received.

**Response:**
- Returns OTP verification status.

---

### POST /api/auth/reset
Checks OTP and resets the user's password.

**Request Body (JSON):**
- `otp` (string): One-time password received.
- `username` (string): User's username.
- `password` (string): New password to set.

**Response:**
- Returns password reset status.

---

### POST /api/auth/otp
Retrieves the OTP for a user (for testing purposes only).

**Request Body (JSON):**
- `username` (string): User's username.

**Response:**
- Returns the OTP for the specified user.
