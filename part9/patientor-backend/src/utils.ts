import { Gender, NewPatient } from './types';

const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
	return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
	return Object.values(Gender)
		.map((v) => v.toString())
		.includes(param);
};

const parseString = (str: unknown, name: string) => {
	if (!isString(str)) {
		throw new Error(`Incorrect or missing ${name}: ` + str);
	}
	return str;
};

const parseDate = (date: unknown, name: string) => {
	if (!isString(date) || !isDate(date)) {
		throw new Error(`Incorrect or missing ${name}: ` + date);
	}
	return date;
};

const parseGender = (gender: unknown, name: string): Gender => {
	if (!isString(gender) || !isGender(gender)) {
		throw new Error(`Incorrect or missing ${name} ` + gender);
	}
	return gender;
};

const toNewPatientEntry = (object: unknown): NewPatient => {
	if (!object || typeof object !== 'object') {
		throw new Error('Incorrect or missing data');
	}

	if (
		'name' in object &&
		'dateOfBirth' in object &&
		'ssn' in object &&
		'gender' in object &&
		'occupation' in object
	) {
		const newPatient: NewPatient = {
			name: parseString(object.name, 'name'),
			dateOfBirth: parseDate(object.dateOfBirth, 'dateOfBirth'),
			ssn: parseString(object.ssn, 'ssn'),
			gender: parseGender(object.gender, 'gender'),
			occupation: parseString(object.occupation, 'occupation'),
		};
		return newPatient;
	}

	throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatientEntry;
