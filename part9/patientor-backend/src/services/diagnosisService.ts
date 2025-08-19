import { Diagnosis } from '../types';
import diagnoses from '../../data/diagnoses';

export const getDiagnoses = () => {
	return diagnoses;
};

export const addDiagnosis = (diagnosis: Diagnosis) => {
	diagnoses.push(diagnosis);
	return diagnosis;
};

export const getDiagnosisByCode = (code: string): Diagnosis | undefined => {
	return diagnoses.find((diagnosis) => diagnosis.code === code);
};
