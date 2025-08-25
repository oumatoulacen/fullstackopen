import patients from '../../data/patients-full';
import { Patient, NonSensitivePatient, NewPatient } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const getPatients = () => {
	return patients;
};

export const getNonSensitivePatients = (): NonSensitivePatient[] => {
	return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
		id,
		name,
		dateOfBirth,
		gender,
		occupation,
	}));
};

export const getPatientById = (id: string): Patient | undefined => {
	return patients.find((patient) => patient.id === id);
};

export const addPatient = (patient: NewPatient): Patient => {
	const newPatient = { id: uuidv4(), ...patient };
	patients.push(newPatient);
	return newPatient;
};
