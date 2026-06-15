export const validateEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

export const validatePassword = (password) => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasMinLength = password.length >= 8;
  return { hasUppercase, hasNumber, hasMinLength, isValid: hasUppercase && hasNumber && hasMinLength };
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { strength: 20, label: 'Weak', color: '#ef4444' };
  if (score <= 2) return { strength: 40, label: 'Fair', color: '#f97316' };
  if (score <= 3) return { strength: 60, label: 'Good', color: '#f59e0b' };
  if (score <= 4) return { strength: 80, label: 'Strong', color: '#22c55e' };
  return { strength: 100, label: 'Very Strong', color: '#16a34a' };
};
