import express from 'express';
import { Response } from 'express';
import data from '../../data/patients';
import { NonSensitivePatient, Patient } from '../../types';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
	res.send(
		data.map(({ id, name, dateOfBirth, gender, occupation }) => ({
			id,
			name,
			dateOfBirth,
			gender,
			occupation,
		}))
	);
});

patientsRouter.post('/', (req, res: Response<NonSensitivePatient>) => {
	const newPatient = req.body as Patient;
	data.push(newPatient);
	res.status(201).send({
		id: newPatient.id,
		name: newPatient.name,
		dateOfBirth: newPatient.dateOfBirth,
		gender: newPatient.gender,
		occupation: newPatient.occupation,
	});
});

export default patientsRouter;
