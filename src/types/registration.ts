import React from 'react';

export interface FormData {
  province: string | null;
  department: string | null;
  eventType: string | null;
  typeOfSport: string | null;
  selectedSport: string | null;
  firstName: string;
  lastName: string;
  firstNameKh: string;
  lastNameKh: string;
  nationalID: string;
  dateOfBirth: string;
  gender?: string;
  email?: string;
  position: string | null;
  phoneNumber: string;
  photoUpload: File | null;
  category?: string | null;
  sportCategory: string | null;
}

export type RegistrationType = 'leader' | 'athletes';

export interface FormErrors {
  province?: string;
  department?: string;
  eventType?: string;
  typeOfSport?: string;
  selectedSport?: string;
  firstName?: string;
  lastName?: string;
  nationalID?: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  position?: string;
  phoneNumber?: string;
  photoUpload?: string;
}

export type OnFieldChange = <K extends keyof FormData>(
  field: K,
  value: FormData[K]
) => void;

export interface SportCategory {
  id: string;
  name: string;
  icon: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface HeaderButtonProps {
  variant?: 'primary' | 'outline';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface FormSectionProps {
  formData: FormData;
  handleChange: OnFieldChange;
  errors?: FormErrors;
}

export interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
}

export interface FormSelectProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export interface LogEntry {
  id: number;
  action: string;
  timestamp: string;
}