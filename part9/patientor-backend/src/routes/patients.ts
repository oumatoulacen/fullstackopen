/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import { Response } from 'express';
import { NonSensitivePatient } from '../types';
import {
	getNonSensitivePatients,
	addPatient,
	getPatientById,
} from '../services/patientService';
import toNewPatientEntry from '../utils';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
	res.send(getNonSensitivePatients());
});

patientsRouter.get(
	'/:id',
	(req, res: Response<NonSensitivePatient | undefined>) => {
		const patient = getPatientById(req.params.id);
		if (patient) {
			res.send(getNonSensitivePatients().find((p) => p.id === patient.id));
		} else {
			res.sendStatus(404);
		}
	}
);

patientsRouter.post('/', (req, res /**: Response<NonSensitivePatient> */) => {
	try {
		const newPatientEntry = toNewPatientEntry(req.body);

		const addedEntry = addPatient(newPatientEntry);
		res.json(addedEntry);
	} catch (error: unknown) {
		let errorMessage = 'Something went wrong.';
		if (error instanceof Error) {
			errorMessage += ' Error: ' + error.message;
		}
		res.status(400).send(errorMessage);
	}
});

export default patientsRouter;
