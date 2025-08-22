import { useState } from 'react';
import axios from 'axios';

import { type NewDiaryEntry } from '../types';
import { createDiary } from '../services/diaries';

function NewDiary() {
	const [date, setDate] = useState('');
	const [weather, setWeather] = useState<NewDiaryEntry['weather']>('sunny');
	const [visibility, setVisibility] =
		useState<NewDiaryEntry['visibility']>('great');
	const [comment, setComment] = useState('');

	const [errors, setErrors] = useState<string>('');
	const showErrors = (message: string) => {
		setErrors(message);
		setTimeout(() => {
			setErrors('');
		}, 5000);
	};

	const resetForm = () => {
		setDate('');
		setWeather('sunny');
		setVisibility('great');
		setComment('');
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const newEntry: NewDiaryEntry = {
			date,
			weather,
			visibility,
			comment,
		};
		try {
			await createDiary(newEntry);
		} catch (error) {
			console.log('Error creating diary entry:', error);
			if (axios.isAxiosError(error)) {
				showErrors(error.response?.data || 'Failed to create diary entry');
			} else {
				showErrors(String(error));
			}
		} finally {
			resetForm();
		}
	};

	return (
		<div>
			{errors && <p style={{ color: 'red' }}>{errors}</p>}
			<h2>New Diary Entry</h2>
			<form onSubmit={onSubmit}>
				<div>
					<label>
						Date:
						<input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							required
						/>
					</label>
				</div>
				<div>
					<label>
						Weather:
						<select
							value={weather}
							onChange={(e) =>
								setWeather(e.target.value as NewDiaryEntry['weather'])
							}
							required
						>
							<option value="sunny">Sunny</option>
							<option value="rainy">Rainy</option>
							<option value="cloudy">Cloudy</option>
							<option value="stormy">Stormy</option>
							<option value="windy">Windy</option>
						</select>
					</label>
				</div>
				<div>
					<label>
						Visibility:
						<input
							type="radio"
							value="great"
							checked={visibility === 'great'} // instead of id
							onChange={() => setVisibility('great')}
						/>
						Great
						<input
							type="radio"
							value="good"
							checked={visibility === 'good'}
							onChange={() => setVisibility('good')}
						/>
						Good
						<input
							type="radio"
							value="ok"
							checked={visibility === 'ok'}
							onChange={() => setVisibility('ok')}
						/>
						Ok
						<input
							type="radio"
							value="poor"
							checked={visibility === 'poor'}
							onChange={() => setVisibility('poor')}
						/>
						Poor
					</label>
				</div>
				<div>
					<label>
						Comment:
						<textarea
							value={comment}
							onChange={(e) => setComment(e.target.value)}
							required
						/>
					</label>
				</div>
				<button type="submit">Add Entry</button>
			</form>
		</div>
	);
}

export default NewDiary;
