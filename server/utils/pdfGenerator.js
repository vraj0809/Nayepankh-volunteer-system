// PDF generation is handled client-side via jsPDF + jspdf-autotable
// This utility provides helper functions for server-side formatting if needed

const formatVolunteerForPDF = (volunteer) => {
  return {
    name: volunteer.fullName,
    email: volunteer.email,
    phone: volunteer.phone,
    city: volunteer.city,
    state: volunteer.state,
    college: volunteer.college,
    degree: volunteer.degree,
    yearOfStudy: volunteer.yearOfStudy,
    skills: (volunteer.skills || []).join(', '),
    areasOfInterest: (volunteer.areasOfInterest || []).join(', '),
    availableHours: volunteer.availableHours,
    status: volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1),
    registeredAt: new Date(volunteer.registeredAt).toLocaleDateString('en-IN'),
  };
};

module.exports = { formatVolunteerForPDF };
