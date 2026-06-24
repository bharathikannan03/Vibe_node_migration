# Create Policy API Workflow

This document explains how the current Create Policy API works from server startup to database insert and response handling.

## API Summary

| Item | Value |
| --- | --- |
| Method | `POST` |
| Endpoint | `/api/policies` |
| Purpose | Create a new insurance policy |
| Main table | `policies` |
| Success status | `201 Created` |

## 1. Server Startup

The application starts from `src/server.js`.

```js
import app from "./app.js/index.js";
```

The Express app is imported from `src/app.js/index.js`.

The server reads the port from `process.env.PORT`. If `PORT` is not available, it uses the default port configured in `src/server.js`.

```js
const DEFAULT_PORT = 5000;
const port = process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT;
```

Then the server starts listening:

```js
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

## 2. Express App Setup

The main Express app is configured in `src/app.js/index.js`.

It does the following:

1. Creates an Express app.
2. Enables JSON request body parsing.
3. Adds a health check route.
4. Registers the policy routes.
5. Registers not-found and error-handling middleware.

```js
app.use(express.json());
app.use("/api/policies", policyRouter);
app.use(notFoundHandler);
app.use(errorHandler);
```

## 3. Request Entry Point

When a client sends this request:

```http
POST /api/policies
Content-Type: application/json
```

The request reaches this route in `src/route/policy-route.js`:

```js
router.post("/", validateRequest(validateCreatePolicy), createPolicy);
```

Because the router is mounted on `/api/policies`, the final endpoint becomes:

```text
POST /api/policies
```

## 4. Request Validation

Before the controller runs, the request body is validated by:

```js
validateRequest(validateCreatePolicy)
```

The validation rules are defined in `src/validators/policy-validator.js`.

Required fields:

| Field | Rule |
| --- | --- |
| `policyNumber` | Required string, max 50 characters |
| `policyName` | Required string, max 150 characters |
| `policyType` | Required string, max 100 characters |
| `premiumAmount` | Required non-negative number |
| `coverageAmount` | Required non-negative number |
| `startDate` | Required date in `YYYY-MM-DD` format |
| `endDate` | Required date in `YYYY-MM-DD` format |
| `holderName` | Required string, max 150 characters |

Optional fields:

| Field | Rule |
| --- | --- |
| `holderEmail` | Optional string, must be valid email when provided |
| `description` | Optional string, max 1000 characters |
| `status` | Optional, defaults to `active` |

Allowed status values:

```text
active, inactive, expired, cancelled
```

Additional validation:

```text
endDate must be on or after startDate
```

If validation fails, the request stops here and returns:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

## 5. Controller Layer

After validation passes, the request goes to `createPolicy` in `src/controller/PolicyController.js`.

The controller:

1. Receives the validated request body.
2. Calls the service layer.
3. Sends the success response.
4. Passes errors to the central error handler.

```js
const policy = await createPolicyService(req.body);
return sendSuccess(res, 201, "Policy created successfully", policy);
```

## 6. Service Layer

Business logic is handled in `src/service/policy-service.js`.

The service first checks whether the policy number already exists:

```js
const existingPolicy = await findPolicyByNumber(policyPayload.policyNumber);
```

If the policy number already exists, it throws a `409 Conflict` error:

```json
{
  "success": false,
  "message": "Policy number already exists",
  "errors": [
    {
      "field": "policyNumber",
      "message": "Policy number must be unique"
    }
  ]
}
```

If the policy number is unique, the service calls the repository to create the policy:

```js
return createPolicy(policyPayload);
```

## 7. Repository Layer

Database work is handled in `src/repositories/policy-repository.js`.

The repository inserts the policy into the `policies` table:

```sql
INSERT INTO policies (
  policy_number,
  policy_name,
  policy_type,
  premium_amount,
  coverage_amount,
  start_date,
  end_date,
  holder_name,
  holder_email,
  status,
  description
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
```

After insert, it fetches the newly created policy using the inserted ID:

```js
return findPolicyById(result.insertId);
```

The database row is converted from snake_case column names to camelCase API fields using `toPolicy`.

Example:

| Database column | API response field |
| --- | --- |
| `policy_number` | `policyNumber` |
| `policy_name` | `policyName` |
| `premium_amount` | `premiumAmount` |
| `created_at` | `createdAt` |

## 8. Database Connection

The database pool is created in `src/config/database.js`.

The app uses `mysql2/promise`.

It can connect using `DATABASE_URL`, or individual database environment variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=vibe_node_migration
DB_CONNECTION_LIMIT=10
```

## 9. Database Table

The `policies` table is created by:

```text
src/migration/001-create-policies-table.sql
```

Important table rules:

| Column | Rule |
| --- | --- |
| `id` | Primary key, auto increment |
| `policy_number` | Required and unique |
| `status` | Enum: `active`, `inactive`, `expired`, `cancelled` |
| `created_at` | Auto-created timestamp |
| `updated_at` | Auto-updated timestamp |

Before using the API, run:

```bash
npm run migrate
```

## 10. Success Response

When the policy is created successfully, the API returns:

```json
{
  "success": true,
  "message": "Policy created successfully",
  "data": {
    "id": 1,
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
    "description": "Annual family health insurance policy",
    "createdAt": "2026-06-19T00:00:00.000Z",
    "updatedAt": "2026-06-19T00:00:00.000Z"
  }
}
```

## 11. Error Handling

Errors are handled centrally in `src/middleware/error-handler.js`.

Common error flows:

| Scenario | Status | Message |
| --- | --- | --- |
| Invalid request body | `400` | `Validation failed` |
| Duplicate policy number | `409` | `Policy number already exists` |
| Unknown route | `404` | `Route <path> not found` |
| Unexpected server/database error | `500` | `Internal Server Error` |

## 12. End-to-End Flow

```text
Client
  |
  | POST /api/policies
  v
Express App
  |
  | app.use("/api/policies", policyRouter)
  v
Policy Route
  |
  | validateRequest(validateCreatePolicy)
  v
Validation Middleware
  |
  | Valid request body
  v
Policy Controller
  |
  | createPolicyService(req.body)
  v
Policy Service
  |
  | Check duplicate policy number
  v
Policy Repository
  |
  | INSERT INTO policies
  v
MySQL Database
  |
  | Return inserted policy
  v
Repository maps DB row to API object
  |
  v
Controller sends 201 response
  |
  v
Client receives success response
```

## 13. Sample Request

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

## 14. Commands

Install dependencies:

```bash
npm install
```

Run database migrations:

```bash
npm run migrate
```

Start the server:

```bash
npm start
```

Health check:

```http
GET /health
```

Create policy:

```http
POST /api/policies
```
