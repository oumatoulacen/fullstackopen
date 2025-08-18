import express from 'express';
import { Response } from 'express';
import data from '../../data/diagnoses';
import { Diagnosis } from '../../types';

const diagnosesRouter = express.Router();

diagnosesRouter.get('/', (_req, res: Response<Diagnosis[]>) => {
	res.send(data);
});

diagnosesRouter.post('/', (req, res: Response<Diagnosis>) => {
	const newDiagnosis: Diagnosis = req.body as Diagnosis;
	data.push(newDiagnosis);
	res.status(201).send(newDiagnosis);
});

export default diagnosesRouter;
