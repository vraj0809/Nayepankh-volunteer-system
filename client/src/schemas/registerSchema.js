import { z } from 'zod';

export const registerSchema = z.object({
  // Step 1: Personal Info
  fullName: z.string().min(3, 'Name must be at least 3 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),

  // Step 2: Academic Info
  college: z.string().min(1, 'College name is required'),
  degree: z.string().min(1, 'Degree is required'),
  yearOfStudy: z.string().min(1, 'Year of study is required'),

  // Step 3: Volunteer Info
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  areasOfInterest: z.array(z.string()).min(1, 'Select at least one area of interest'),
  motivation: z.string().min(50, 'Please write at least 50 characters'),
  availableHours: z.string().min(1, 'Please select available hours'),
  linkedinUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Step-specific schemas for step validation
export const step1Schema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const step2Schema = z.object({
  college: z.string().min(1, 'College name is required'),
  degree: z.string().min(1, 'Degree is required'),
  yearOfStudy: z.string().min(1, 'Year of study is required'),
});

export const step3Schema = z.object({
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  areasOfInterest: z.array(z.string()).min(1, 'Select at least one area of interest'),
  motivation: z.string().min(50, 'Please write at least 50 characters'),
  availableHours: z.string().min(1, 'Please select available hours'),
  linkedinUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
});
