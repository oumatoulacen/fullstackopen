import axios from 'axios';
import {
	type NonSensitiveDiaryEntry,
	type DiaryEntry,
	type NewDiaryEntry,
} from '../types';

const API_URL = 'http://localhost:3000/api/diaries';

export const getDiaries = async () => {
	const response = await axios.get<NonSensitiveDiaryEntry[]>(API_URL);
	return response.data;
};

export const createDiary = async (diary: NewDiaryEntry) => {
	const response = await axios.post<DiaryEntry>(API_URL, diary);
	return response.data;
};
