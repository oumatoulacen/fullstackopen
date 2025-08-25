import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Diagnosis } from '../types';

export const getDiagnosis = async () => {
	const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
	return data;
};
