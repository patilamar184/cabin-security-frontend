export function validateVisitor({ name, phone, department, role }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Enter the visitor name.';
  if (!/^\d{10}$/.test(phone.trim())) errors.phone = 'Enter a 10-digit phone number.';
  if (!department) errors.department = 'Choose a department.';
  if (!role) errors.role = 'Choose a role.';
  return errors;
}
