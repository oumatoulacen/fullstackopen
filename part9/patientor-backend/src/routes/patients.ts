/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express, { NextFunction, Request, Response } from 'express';
import * as z from 'zod';
import { newPatientSchema } from '../utils';

import { NonSensitivePatient, Patient, NewPatient } from '../types';
import {
	getNonSensitivePatients,
	addPatient,
	getPatientById,
} from '../services/patientService';

const patientsRouter = express.Router();

patientsRouter.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
	res.send(getNonSensitivePatients());
});

patientsRouter.get('/:id', (req, res: Response<Patient | undefined>) => {
	const patient = getPatientById(req.params.id);
	return patient ? res.send(patient) : res.sendStatus(404);
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
	try {
		newPatientSchema.parse(req.body);
		console.log(req.body);
		next();
	} catch (error: unknown) {
		next(error);
	}
};

const errorMiddleware = (
	error: unknown,
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	if (error instanceof z.ZodError) {
		res.status(400).send({ error: error.issues });
	} else {
		next(error);
	}
};

patientsRouter.post(
	'/',
	newPatientParser,
	(req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
		const addedEntry = addPatient(req.body);
		res.json(addedEntry);
	}
);

patientsRouter.use(errorMiddleware);

export default patientsRouter;
