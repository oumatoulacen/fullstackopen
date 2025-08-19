import express from 'express';
import { Response } from 'express';
import { Diagnosis } from '../types';
import {
	getDiagnoses,
	addDiagnosis,
	getDiagnosisByCode,
} from '../services/diagnosisService';

const diagnosesRouter = express.Router();

diagnosesRouter.get('/', (_req, res: Response<Diagnosis[]>) => {
	res.send(getDiagnoses());
});

diagnosesRouter.get('/:code', (req, res: Response<Diagnosis | undefined>) => {
	const diagnosis = getDiagnosisByCode(req.params.code);
	if (diagnosis) {
		res.send(diagnosis);
	} else {
		res.sendStatus(404);
	}
});

diagnosesRouter.post('/', (req, res: Response<Diagnosis>) => {
	const newDiagnosis: Diagnosis = req.body as Diagnosis;
	addDiagnosis(newDiagnosis);
	res.status(201).send(newDiagnosis);
});

export default diagnosesRouter;
