const at = (day, h, m, s = 0) => new Date(2026, 9, day, h, m, s).toISOString();

export const seedUser = {
  id: 1,
  full_name: 'Amit Patil',
  username: 'amitpatil',
  email: 'amitpatil@example.com',
  phone: '+91 98765 43210',
  role: 'Cabin Owner',
  department: 'R&D Department',
  created_at: at(12, 10, 30),
};

export const seedVisitors = [
  { id: 102, name: 'Rohit Patil', department: 'Engineering', phone: '9876543210', role: 'Employee', fingerprint_count: 1, registered_at: at(25, 10, 30) },
  { id: 101, name: 'Sneha Kulkarni', department: 'HR', phone: '9321456780', role: 'Employee', fingerprint_count: 1, registered_at: at(24, 14, 15) },
  { id: 100, name: 'Amit Sharma', department: 'Maintenance', phone: '9765432109', role: 'Contractor', fingerprint_count: 1, registered_at: at(23, 11, 20) },
  { id: 99, name: 'Priya Desai', department: 'Operations', phone: '9898765432', role: 'Employee', fingerprint_count: 1, registered_at: at(22, 16, 45) },
  { id: 98, name: 'Vikas More', department: 'IT', phone: '9156784321', role: 'Visitor', fingerprint_count: 1, registered_at: at(20, 13, 10) },
  { id: 97, name: 'Neha Verma', department: 'Administration', phone: '9988776655', role: 'Employee', fingerprint_count: 0, registered_at: at(19, 9, 30) },
  { id: 96, name: 'Suresh Jadhav', department: 'Security', phone: '9823456789', role: 'Employee', fingerprint_count: 1, registered_at: at(18, 15, 25) },
  { id: 95, name: 'Anjali Singh', department: 'Finance', phone: '9766123450', role: 'Employee', fingerprint_count: 1, registered_at: at(17, 12, 0) },
];

const people = [
  ['Amit Patil', 'IT', 'Employee'],
  ['Sneha Kulkarni', 'HR', 'Employee'],
  ['Rohan Deshmukh', 'Operations', 'Visitor'],
  ['Pooja Sharma', 'IT', 'Employee'],
  ['Vikas More', 'Maintenance', 'Visitor'],
  ['Neha Singh', 'HR', 'Employee'],
  ['Rahul Jadhav', 'Operations', 'Employee'],
  ['Priya Mehta', 'Administration', 'Visitor'],
  ['Sandeep Kale', 'Maintenance', 'Employee'],
  ['Ankita Rao', 'IT', 'Visitor'],
];

// 47 sample entries, newest first.
export const seedEntries = Array.from({ length: 47 }, (_, i) => {
  const [visitor_name, department, role] = people[i % people.length];
  return {
    id: 102 - i,
    visitor_name,
    department,
    role,
    entry_at: at(29 - Math.floor(i / 3), 9 + ((i * 7) % 9), (i * 13) % 60, (i * 29) % 60),
    method: 'Fingerprint',
    result: i % 4 === 2 ? 'denied' : 'allowed',
  };
});

export const seedAccessRequests = [
  { id: 102, visitor_name: 'Amit Sharma', method: 'Fingerprint', status: 'pending', requested_at: at(29, 10, 15) },
  { id: 101, visitor_name: 'Priya Desai', method: 'Fingerprint', status: 'allowed', requested_at: at(29, 9, 42) },
  { id: 100, visitor_name: 'Rohit Kapse', method: 'Fingerprint', status: 'denied', requested_at: at(29, 9, 20) },
  { id: 99, visitor_name: 'Sneha Patil', method: 'Fingerprint', status: 'pending', requested_at: at(29, 9, 10) },
  { id: 98, visitor_name: 'Vikas More', method: 'Fingerprint', status: 'allowed', requested_at: at(29, 8, 55) },
  { id: 97, visitor_name: 'Neha Kulkarni', method: 'Fingerprint', status: 'pending', requested_at: at(29, 8, 32) },
  { id: 96, visitor_name: 'Arjun Mehta', method: 'Fingerprint', status: 'denied', requested_at: at(29, 8, 18) },
  { id: 95, visitor_name: 'Kiran Jadhav', method: 'Fingerprint', status: 'allowed', requested_at: at(29, 7, 50) },
];
