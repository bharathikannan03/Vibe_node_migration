# Progress

Date: 2026-06-23

This document records the previous chat prompts shared for this project and the corresponding output observed in the codebase.

## 1. Add policy creation Api

Prompt used:

```text
Add policy creation Api
```

Output:

- Added a Create Policy API endpoint.
- Endpoint: `POST /api/policies`
- Added request validation for policy fields such as `policyNumber`, `policyName`, `policyType`, `premiumAmount`, `coverageAmount`, `startDate`, `endDate`, `holderName`, `holderEmail`, `status`, and `description`.
- Added service logic to check duplicate policy numbers before inserting a new policy.
- Added repository logic to insert policy data into the `policies` table and return the created policy.
- Added centralized success/error response handling through the existing response utilities and middleware.
- Added policy database migration support for creating the `policies` table.
- Added API documentation in `Readme.md` and detailed workflow notes in `docs/api-workflow.md`.

Main files involved:

- `src/app.js/index.js`
- `src/route/policy-route.js`
- `src/controller/PolicyController.js`
- `src/service/policy-service.js`
- `src/repositories/policy-repository.js`
- `src/validators/policy-validator.js`
- `src/migration/001-create-policies-table.sql`
- `docs/api-workflow.md`
- `Readme.md`

Expected success response:

```json
{
  "success": true,
  "message": "Policy created successfully",
  "data": {}
}
```

## 2. Fix port parsing issue

Prompt used:

```text
Fix port parsing issue
```

Output:

- Updated server startup to read the application port from environment configuration.
- Added `dotenv/config` loading in `src/server.js`.
- Added `PORT` to `.env.example`.
- Documented that the server should read `process.env.PORT` and use a default port when no environment value is available.

Main files involved:

- `src/server.js`
- `.env.example`
- `docs/api-workflow.md`

Current expected behavior:

```text
The application should start on the port configured by PORT.
If PORT is missing, the server should fall back to a default port such as 5000.
```

Note:

The current `src/server.js` reads `Number(process.env.PORT)`. If `PORT` is not defined, this can become `NaN`, so the fallback behavior should be verified before deployment.

## 3. fix 500 internal error

Prompt used:

```text
fix 500 internal error
```

Output:

- Reviewed central error handling for unexpected server failures.
- Confirmed the app uses `notFoundHandler` and `errorHandler` middleware.
- Confirmed unexpected errors return a safe `500` response without exposing internal stack traces.
- Policy controller methods pass caught errors to `next(error)` so the central error middleware can handle them.
- Known application errors use `AppError` with specific status codes where applicable.

Main files involved:

- `src/middleware/error-handler.js`
- `src/utils/app-error.js`
- `src/controller/PolicyController.js`
- `src/service/policy-service.js`

Expected 500 error response:

```json
{
  "success": false,
  "message": "Internal Server Error",
  "errors": []
}
```

Related safer error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

```json
{
  "success": false,
  "message": "Policy not found",
  "errors": []
}
```


## 4. Add policy edit API

Prompt used:

```text
Add policy edit API
```

Output:

- Added an Edit Policy API endpoint to fetch one policy by ID.
- Endpoint: `GET /api/policies/:id`
- Added controller logic through `editPolicy`.
- Added service logic through `editPolicyService`.
- Added repository lookup logic through `findPolicyById`.
- Added a filtered response payload with policy fields such as `id`, `policyNumber`, `policyName`, `policyType`, `premiumAmount`, `coverageAmount`, `startDate`, `endDate`, `holderName`, `holderEmail`, `status`, and `description`.
- Added not-found handling for missing policies with `Policy not found`.
- The same router is also mounted at `/api/edit`, so the current code also exposes `GET /api/edit/:id`.

Main files involved:

- `src/app.js/index.js`
- `src/route/policy-route.js`
- `src/controller/PolicyController.js`
- `src/service/policy-service.js`
- `src/repositories/policy-repository.js`

Expected success response:

```json
{
  "success": true,
  "message": "Policy fetched successfully",
  "data": {}
}
```

Expected not-found response:

```json
{
  "success": false,
  "message": "Policy not found",
  "errors": []
}
```

## 5. Add policy update API

Prompt used:

```text
Add policy update API
```

Output:

- Added an Update Policy API endpoint to update one policy by ID.
- Endpoint: `PUT /api/policies/:id`
- Added request validation through `validateUpdatePolicy`.
- Added controller logic through `updatePolicy`.
- Added service logic through `updatePolicyService` to check whether the policy exists before updating.
- Added repository logic through `updatePolicy` to update policy fields in the `policies` table and return the updated policy.
- Added validation for fields such as `policyType`, `startDate`, `endDate`, `holderName`, `holderEmail`, and `status`.
- Added email format validation for `holderEmail`.
- Added status validation against the allowed policy statuses.
- Added date validation to ensure `endDate` is on or after `startDate`.
- The same router is also mounted at `/api/updatepolicies`, so the current code also exposes `PUT /api/updatepolicies/:id`.

Main files involved:

- `src/app.js/index.js`
- `src/route/policy-route.js`
- `src/controller/PolicyController.js`
- `src/service/policy-service.js`
- `src/repositories/policy-repository.js`
- `src/validators/policy-validator.js`

Expected success response:

```json
{
  "success": true,
  "message": "Policy updated successfully",
  "data": {}
}
```

Expected validation response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

Expected not-found response:

```json
{
  "success": false,
  "message": "Policy not found",
  "errors": []
}
```

## 6. Add migration script command

Prompt used:

```text
Create migration script command
```

Output:

- Added an npm migration command.
- Command: `npm run migrate`
- Script configured in `package.json`: `"migrate": "node src/migration/run-migrations.js"`
- Added migration runner support through `src/migration/run-migrations.js`.
- The runner creates a `schema_migrations` table when it does not already exist.
- The runner reads `.sql` files from `src/migration`, sorts them, and executes pending migrations.
- Already executed migration files are skipped using records stored in `schema_migrations`.
- Each migration file runs inside a transaction and rolls back if execution fails.
- Added documentation in `Readme.md` showing `npm run migrate` before starting or calling the API.

Main files involved:

- `package.json`
- `src/migration/run-migrations.js`
- `src/migration/001-create-policies-table.sql`
- `Readme.md`

Expected command:

```bash
npm run migrate
```

Expected success output:

```text
Executed 001-create-policies-table.sql
Migrations completed successfully
```

Expected skip output when already executed:

```text
Skipped 001-create-policies-table.sql
Migrations completed successfully
```

## 7. Create delete policy API with soft delete

Prompt used:

```text
create a delete policy api with soft delete
```

Output:

- Added a Delete Policy API endpoint.
- Endpoint: `DELETE /api/policies/:id`
- Added controller logic through `deletePolicy`.
- Added service logic through `deletePolicyService` to check whether the policy exists before deleting.
- Added repository logic through `softDeletePolicy` to set `deleted_at = CURRENT_TIMESTAMP` instead of physically deleting the row.
- Updated policy fetch and update queries to ignore records where `deleted_at` is not `NULL`.
- Added `deletedAt` mapping in the policy repository.
- Added migration `002-add-deleted-at-to-policies.sql` to add the `deleted_at` column and index.
- Ran `npm run migrate` successfully after an internal server error occurred because the database did not yet have the `deleted_at` column.

Main files involved:

- `src/route/policy-route.js`
- `src/controller/PolicyController.js`
- `src/service/policy-service.js`
- `src/repositories/policy-repository.js`
- `src/migration/002-add-deleted-at-to-policies.sql`

Expected success response:

```json
{
  "success": true,
  "message": "Policy deleted successfully",
  "data": {
    "id": 1,
    "deleted": true
  }
}
```

Expected not-found response:

```json
{
  "success": false,
  "message": "Policy not found",
  "errors": []
}
```

Expected migration output:

```text
Skipped 001-create-policies-table.sql
Executed 002-add-deleted-at-to-policies.sql
Migrations completed successfully
```
