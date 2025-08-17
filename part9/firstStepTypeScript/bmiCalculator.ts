/**        BMI, basic categories
 * Category	BMI (kg/m2)[c]	BMI Prime[c]
 * Underweight (Severe thinness)    < 16.0
 * Underweight (Moderate thinness)	16.0–17.0
 * Underweight (Mild thinness)	17.0–18.5
 * Normal range	18.5–25.0
 * Overweight (Pre-obese)	25.0–30.0
 * Obese (Class I)	30.0–35.0
 * Obese (Class II)	35.0–40.
 * Obese (Class III)	≥ 40.0
 */

const calculateBmi = (height: number, weight: number): string => {
	const bmi = weight / ((height / 100) * (height / 100));

	if (bmi < 16.0) {
		return `Underweight (Severe thinness) (BMI: ${bmi})`;
	} else if (16 < bmi && bmi < 17.0) {
		return `Underweight (Moderate thinness) (BMI: ${bmi})`;
	} else if (17.0 < bmi && bmi < 18.5) {
		return `Underweight (Mild thinness) (BMI: ${bmi})`;
	} else if (18.5 < bmi && bmi < 25.0) {
		return `Normal range (BMI: ${bmi})`;
	} else if (25.0 < bmi && bmi < 30.0) {
		return `Overweight (Pre-obese) (BMI: ${bmi})`;
	} else if (30.0 < bmi && bmi < 35.0) {
		return `Obese (Class I) (BMI: ${bmi})`;
	} else if (35.0 < bmi && bmi < 40.0) {
		return `Obese (Class II) (BMI: ${bmi})`;
	} else {
		return `Obese (Class III) (BMI: ${bmi})`;
	}
};

if (require.main === module) {
	if (process.argv.length < 4) {
		console.error('Usage: npm run calculateBmi <height> <weight>');
		process.exit(1);
	}

	const height = Number(process.argv[2]);
	const weight = Number(process.argv[3]);
	console.log(calculateBmi(height, weight));
}

export default calculateBmi;
