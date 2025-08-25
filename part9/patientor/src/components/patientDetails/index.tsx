import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Patient } from '../../types';
import patientService from '../../services/patients';

function PatientDetails() {
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

	return (
		<div>
			<h2>Patient Details</h2>
			<p>Name: {patientDetails.name}</p>
			<p>Gender: {patientDetails.gender}</p>
			<p>Occupation: {patientDetails.occupation}</p>
			<p>SSN: {patientDetails.ssn}</p>
			<p>Date of Birth: {patientDetails.dateOfBirth}</p>
			<p>Entries: {patientDetails.entries.join(' ')}</p>
		</div>
	);
}

export default PatientDetails;
