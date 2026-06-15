const generateCSV = (volunteers) => {
  const headers = [
    'Full Name',
    'Email',
    'Phone',
    'City',
    'State',
    'College',
    'Degree',
    'Year of Study',
    'Skills',
    'Areas of Interest',
    'Available Hours',
    'Status',
    'LinkedIn',
    'GitHub',
    'Registered At',
  ];

  const rows = volunteers.map((v) => [
    escapeCsvField(v.fullName),
    escapeCsvField(v.email),
    escapeCsvField(v.phone),
    escapeCsvField(v.city),
    escapeCsvField(v.state),
    escapeCsvField(v.college),
    escapeCsvField(v.degree),
    escapeCsvField(v.yearOfStudy),
    escapeCsvField((v.skills || []).join('; ')),
    escapeCsvField((v.areasOfInterest || []).join('; ')),
    escapeCsvField(v.availableHours),
    escapeCsvField(v.status),
    escapeCsvField(v.linkedinUrl || ''),
    escapeCsvField(v.githubUrl || ''),
    escapeCsvField(new Date(v.registeredAt).toLocaleDateString('en-IN')),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
};

const escapeCsvField = (field) => {
  if (field === null || field === undefined) return '""';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

module.exports = { generateCSV };
