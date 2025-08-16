interface ExerciseCalculation {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

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

console.log(calculateExercises([3, 0, 2, 4, 1], 4));
