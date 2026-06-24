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
