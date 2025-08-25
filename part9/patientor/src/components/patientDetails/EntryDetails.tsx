import { Entry } from '../../types';

const HealthCheck = {
	0: 'Healthy',
	1: 'LowRisk',
	2: 'HighRisk',
	3: 'CriticalRisk',
};

const assertNever = (value: never): never => {
	throw new Error(`Unexpected object: ${JSON.stringify(value)}`);
};

type Props = {
	entry: Entry;
	diagnosis?: { [code: string]: string };
};
function EntryDetails({ entry }: Props) {
	switch (entry.type) {
		case 'HealthCheck':
			return (
				<div>
					<p>Health Check Rating: {HealthCheck[entry.healthCheckRating]}</p>
				</div>
			);
		case 'Hospital':
			return (
				<div>
					<p>Hospital Entry</p>
					{entry.discharge && (
						<>
							<p>Discharge Date: {entry.discharge.date}</p>
							<p>Discharge Criteria: {entry.discharge.criteria}</p>
						</>
					)}
				</div>
			);
		case 'OccupationalHealthcare':
			return (
				<div>
					{entry.sickLeave && (
						<p>
							Sick Leave: {entry.sickLeave.startDate} -{' '}
							{entry.sickLeave.endDate}
						</p>
					)}
				</div>
			);
		default:
			return assertNever(entry);
	}
}

export default EntryDetails;
