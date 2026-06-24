# Vibe Node Migration

## Create Policy API

Create the policies table before calling the API:

```bash
npm run migrate
```

Start the server:

```bash
npm start
```
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" --- to create a JWT_SECRET for .env
```
```bash
npm run seed:users   --to run the seeder for create initial user.
```
### POST `/api/policies`

Request body:

```json
{
  "policyNumber": "POL-1001",
  "policyName": "Family Health Cover",
  "policyType": "health",
  "premiumAmount": 12000,
  "coverageAmount": 500000,
  "startDate": "2026-07-01",
  "endDate": "2027-06-30",
  "holderName": "Aarav Sharma",
  "holderEmail": "aarav@example.com",
  "status": "active",
  "description": "Annual family health insurance policy"
}
```

Success response:

```json
{
  "success": true,
  "message": "Policy created successfully",
  "data": {}
}
```
## JWT Login API

Run migrations before testing locally so the development `users` table exists:

```bash
npm run migrate
```

Set these environment variables:

```env
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
```

### POST `/api/auth/login`

Request body:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

You can also send `identifier` or `username` instead of `email`.

Success response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "tokenType": "Bearer",
    "expiresIn": "1d",
    "user": {}
  }
}
```

## User Seeder

Seed the default admin user after running migrations:

```bash
npm run seed:users
```

Default seeded credentials:

```text
Email: admin@gmail.com
Password: admin@123
```
