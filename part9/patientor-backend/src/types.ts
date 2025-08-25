import { z } from 'zod';
import { newPatientSchema } from './utils';

export enum Gender {
	Male = 'male',
	Female = 'female',
	Other = 'other',
}

export interface Diagnosis {
	code: string;
	name: string;
	latin?: string;
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatient = z.infer<typeof newPatientSchema>;

export interface Patient extends NewPatient {
	id: string;
}
