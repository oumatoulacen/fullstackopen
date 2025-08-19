import { Gender, NewPatient } from './types';
import * as z from 'zod';

export const newPatientSchema = z.object({
	name: z.string().min(2).max(100),
	dateOfBirth: z.iso.date(),
	ssn: z.string().min(6).max(11),
	gender: z.enum(Gender),
	occupation: z.string().min(2).max(100),
});

const toNewPatientEntry = (object: unknown): NewPatient => {
	return newPatientSchema.parse(object);
};

export default toNewPatientEntry;
