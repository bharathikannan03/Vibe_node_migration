import db from "../config/database.js";

const toPolicy = (row) => ({
  id: row.id,
  policyNumber: row.policy_number,
  policyName: row.policy_name,
  policyType: row.policy_type,
  premiumAmount: Number(row.premium_amount),
  coverageAmount: Number(row.coverage_amount),
  startDate: row.start_date,
  endDate: row.end_date,
  holderName: row.holder_name,
  holderEmail: row.holder_email,
  status: row.status,
  description: row.description,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

export const findPolicyByNumber = async (policyNumber) => {
  const [rows] = await db.execute(
    "SELECT * FROM policies WHERE policy_number = ? LIMIT 1",
    [policyNumber]
  );

  return rows.length > 0 ? toPolicy(rows[0]) : null;
};

export const findPolicyById = async (policyId) => {
  const [rows] = await db.execute(
    "SELECT * FROM policies WHERE id = ? LIMIT 1",
    [policyId]
  );

  return rows.length > 0 ? toPolicy(rows[0]) : null;
};

export const createPolicy = async (policy) => {
  const [result] = await db.execute(
    `INSERT INTO policies (
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      policy.policyNumber,
      policy.policyName,
      policy.policyType,
      policy.premiumAmount,
      policy.coverageAmount,
      policy.startDate,
      policy.endDate,
      policy.holderName,
      policy.holderEmail,
      policy.status,
      policy.description
    ]
  );

  return findPolicyById(result.insertId);
};

export const updatePolicy = async (policyId, updateData) => {
  await db.execute(
    `UPDATE policies
     SET policy_type = ?,
         start_date = ?,
         end_date = ?,
         holder_name = ?,
         holder_email = ?,
         status = ?
     WHERE id = ?`,
    [
      updateData.policyType,
      updateData.startDate,
      updateData.endDate,
      updateData.holderName,
      updateData.holderEmail,
      updateData.status,
      policyId
    ]
  );

  return findPolicyById(policyId);
};


