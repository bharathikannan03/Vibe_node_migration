# AGENT.md

## Project Overview

This is a Node.js backend application built using:

* Runtime: Node.js
* Framework: Express.js
* Database: MySQL
* Authentication: JWT
* Package Manager: npm
* Environment Management: dotenv

The goal of this project is to provide scalable REST APIs with clean architecture and maintainable code.

---

## Project Structure

```text
src/
├── config/
├── controllers/
├── services/
├── repositories/
├── middleware/
├── routes/
├── models/
├── validators/
├── utils/
├── constants/
├── jobs/
├── app.js
└── server.js
```

### Layer Responsibilities

#### Controllers

* Handle HTTP requests and responses.
* Perform request validation.
* Call services.
* Do not contain business logic.

#### Services

* Contain business logic.
* Communicate with repositories.
* Handle transactions and workflows.

#### Repositories

* Database interaction only.
* No business logic.

#### Middleware

* Authentication
* Authorization
* Request validation
* Error handling

---

## Coding Standards

### General

* Use ES Modules (`import/export`).
* Prefer async/await over Promise chains.
* Avoid callback-based code.
* Keep functions small and focused.
* Follow SOLID principles.

### Naming Conventions

| Type      | Convention       |
| --------- | ---------------- |
| Variables | camelCase        |
| Functions | camelCase        |
| Classes   | PascalCase       |
| Constants | UPPER_SNAKE_CASE |
| Files     | kebab-case       |

Examples:

```js
getUserById()
createOrderService()
USER_STATUS_ACTIVE
```

---

## API Standards

### Success Response

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

### HTTP Status Codes

* 200 → Success
* 201 → Created
* 400 → Bad Request
* 401 → Unauthorized
* 403 → Forbidden
* 404 → Not Found
* 500 → Internal Server Error

---

## Error Handling

* Use centralized error middleware.
* Never expose internal stack traces.
* Create custom error classes when needed.

Example:

```js
throw new AppError("User not found", 404);
```

---

## Database Guidelines

### Rules

* Use repositories for all database access.
* Avoid raw queries unless necessary.
* Always use transactions for multi-step operations.
* Add indexes for frequently queried fields.

---

## Validation

* Use Joi / Zod for request validation.
* Validate all request inputs.
* Never trust client data.

Example:

```js
const schema = Joi.object({
  email: Joi.string().email().required()
});
```

---

## Security Guidelines

* Hash passwords using bcrypt.
* Store secrets in environment variables.
* Implement rate limiting.
* Sanitize user input.
* Enable CORS properly.
* Validate JWT tokens in middleware.

---

## Logging

* Use Winston or Pino.
* Log:

  * API requests
  * Errors
  * Database failures
  * Background jobs

Do not log:

* Passwords
* Access tokens
* Sensitive personal information

---

## Testing

### Unit Tests

* Test services.
* Mock repositories.

### Integration Tests

* Test API endpoints.
* Test authentication flows.

Recommended stack:

```bash
Jest
Supertest
```

---

## AI Agent Instructions

When modifying code:

1. Follow existing architecture.
2. Do not place business logic inside controllers.
3. Reuse existing utilities before creating new ones.
4. Create reusable services.
5. Maintain backward compatibility unless instructed otherwise.
6. Add proper error handling.
7. Add validation for new endpoints.
8. Write clean, production-ready code.
9. Follow REST API conventions.
10. Update documentation when introducing new features.

Before generating code:

* Check existing patterns.
* Search for similar implementations.
* Avoid duplicate code.
* Keep changes minimal and focused.

---

## Environment Variables

Example:

```env
PORT=5000
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
NODE_ENV=development
```

---

## Definition of Done

A task is complete when:

* Code compiles successfully.
* Lint passes.
* Tests pass.
* Validation is implemented.
* Error handling is added.
* Documentation is updated.
* No sensitive information is exposed.

```
```
