import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import Button from '@mui/material/Button';

import { Patient, Diagnosis } from '../../types';
import patientService from '../../services/patients';

import EntryDetails from './EntryDetails';

type Props = {
	diagnosis: Diagnosis[];
};

function PatientDetails({ diagnosis }: Props) {
	const { id } = useParams();
	const [patientDetails, setPatientDetails] = useState<Patient | null>(null);

	useEffect(() => {
		const fetchPatientDetails = async () => {
			if (id) {
				const patient = await patientService.getPatientById(id);
				setPatientDetails(patient);
			}
		};
		fetchPatientDetails();
	}, [id]);

	if (!patientDetails) return <div>no patient found</div>;
	if (!diagnosis) return <p>loading diagnosis ...</p>;

	const diagnosisObj: { [code: string]: string } = {};
	diagnosis.forEach((d) => {
		diagnosisObj[d.code] = d.name;
	});

	return (
		<div>
			<h2>Patient Details</h2>
			<p>
				{patientDetails.name}{' '}
				{patientDetails.gender === 'male' ? <ManIcon /> : <WomanIcon />}
			</p>
			<p>Occupation: {patientDetails.occupation}</p>
			<p>SSN: {patientDetails.ssn}</p>
			<div>
				<strong>Entries</strong>
				{patientDetails.entries.length > 0 ? (
					patientDetails.entries.map((entry) => (
						<div
							key={entry.id}
							style={{
								border: '1px solid black',
								margin: '10px',
								padding: '10px',
							}}
						>
							<p>
								{entry.date} {entry.description}
							</p>
							{entry.diagnosisCodes && (
								<ul>
									{entry.diagnosisCodes.map((code) => (
										<li key={code}>
											{code} {diagnosisObj[code] || 'Unknown Diagnosis'}
										</li>
									))}
								</ul>
							)}
							<p> diagnose by {entry.specialist}</p>
							<EntryDetails key={entry.id} entry={entry} />
						</div>
					))
				) : (
					<p>No entries found</p>
				)}
			</div>
			<Button variant="contained" color="primary">
				Add New Entry
			</Button>
		</div>
	);
}

export default PatientDetails;
