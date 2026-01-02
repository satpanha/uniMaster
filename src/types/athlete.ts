export interface Athlete {
  registeredAt: string | number | Date;
  id: string;
  name?: string;
  eventId?: string;
  sportId?: string;
  firstName: string;
  lastName: string;
  firstNameKh?: string;
  lastNameKh?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  province: string;
  department?: string;
  eventType?: string;
  sports: string[];
  sportCategory?: string;
  position?: string;
  nationalID?: string;
  email: string;
  phone: string;
  photoUrl?: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  medals?: {
    gold: number;
    silver: number;
    bronze: number;
  };
}