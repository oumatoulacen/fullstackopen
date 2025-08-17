import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
	res.send('hello full stack');
});

app.get('/bmi', (req, res) => {
	const height = Number(req.query.height);
	const weight = Number(req.query.weight);

	if (isNaN(height) || isNaN(weight)) {
		return res.status(400).send('malformatted parameters');
	}

	if (height === 0 || weight === 0) {
		return res.status(400).send('No zero values allowed');
	}

	const bmiResult = calculateBmi(height, weight);
	return res.json({ weight, height, bmi: bmiResult });
});

app.post('/exercises', (req, res) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { daily_exercises, target } = req.body;

	if (!Array.isArray(daily_exercises) || daily_exercises.length === 0) {
		return res
			.status(400)
			.send({ error: 'Invalid or missing daily_exercises' });
	}
	if (typeof target !== 'number' || isNaN(target)) {
		return res.status(400).send({ error: 'Invalid or missing target' });
	}

	const result = calculateExercises(daily_exercises as number[], target);
	return res.send(result);
});

const PORT = 3003;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
