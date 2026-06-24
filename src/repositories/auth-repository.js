import db from "../config/database.js";

const IDENTIFIER_COLUMNS = [
  "email",
  "username",
  "user_name",
  "mobile",
  "phone",
  "phone_number"
];
const PASSWORD_COLUMNS = ["password", "password_hash"];
const NAME_COLUMNS = ["name", "full_name", "first_name", "username", "email"];
const ROLE_COLUMNS = ["role_id", "ref_md_department_id"];

let cachedUserColumns = null;

const quoteIdentifier = (identifier) => `\`${identifier}\``;

const getUserColumns = async () => {
  if (cachedUserColumns) {
    return cachedUserColumns;
  }

  const [rows] = await db.execute(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'users'`
  );

  cachedUserColumns = new Set(rows.map((row) => row.COLUMN_NAME));
  return cachedUserColumns;
};

const getFirstAvailableColumn = (columns, candidates) => {
  return candidates.find((candidate) => columns.has(candidate)) || null;
};

const buildUserResponse = (row, columns, passwordColumn) => {
  const nameColumn = getFirstAvailableColumn(columns, NAME_COLUMNS);
  const roleColumn = getFirstAvailableColumn(columns, ROLE_COLUMNS);

  return {
    id: row.id,
    name: nameColumn ? row[nameColumn] : null,
    email: columns.has("email") ? row.email : null,
    username: columns.has("username") ? row.username : null,
    roleId: roleColumn ? row[roleColumn] : null,
    passwordHash: row[passwordColumn]
  };
};

export const findUserForLogin = async (identifier) => {
  const columns = await getUserColumns();
  const identifierColumns = IDENTIFIER_COLUMNS.filter((column) => columns.has(column));
  const passwordColumn = getFirstAvailableColumn(columns, PASSWORD_COLUMNS);

  if (!columns.has("id") || identifierColumns.length === 0 || !passwordColumn) {
    return null;
  }

  const identifierClause = identifierColumns.map((column) => `${quoteIdentifier(column)} = ?`);
  const filters = [`(${identifierClause.join(" OR ")})`];
  const values = identifierColumns.map(() => identifier);

  if (columns.has("deleted_at")) {
    filters.push("deleted_at IS NULL");
  }

  if (columns.has("is_active")) {
    filters.push("is_active = 1");
  }

  const [rows] = await db.execute(
    `SELECT *
     FROM users
     WHERE ${filters.join(" AND ")}
     LIMIT 1`,
    values
  );

  return rows.length > 0 ? buildUserResponse(rows[0], columns, passwordColumn) : null;
};
