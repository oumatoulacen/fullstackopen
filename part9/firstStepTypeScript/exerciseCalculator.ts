interface ExerciseCalculation {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

const parseArguments = (args: string[]): [number[], number] => {
	if (args.length < 4)
		throw new Error(
			'Usage: npm run calculateExercises <target> <hour1> <hour2> ...'
		);

	const target = Number(args[2]);
	if (isNaN(target)) throw new Error(`The target ${args[2]} is not a number`);
	const dailyExerciseHours = args.slice(3).map((arg) => {
		const num = Number(arg);
		if (isNaN(num)) throw new Error(`The argument ${arg} is not a number`);
		return num;
	});

	return [dailyExerciseHours, target];
};

const calculateExercises = (
	dailyExerciseHours: number[],
	target: number
): ExerciseCalculation => {
	const totalHours = dailyExerciseHours.reduce((a, b) => a + b, 0);
	const average = totalHours / dailyExerciseHours.length;

	return {
		periodLength: dailyExerciseHours.length,
		trainingDays: dailyExerciseHours.filter((hours) => hours > 0).length,
		success: average >= target,
		rating: average >= target ? 3 : average >= target - 1 ? 2 : 1,
		ratingDescription:
			average >= target
				? 'Great job!'
				: average >= target - 1
				? 'Not too bad but could be better'
				: 'You need to exercise more',
		target: target,
		average: average,
	};
};

const [dailyExerciseHours, target] = parseArguments(process.argv);

console.log(calculateExercises(dailyExerciseHours, target));
