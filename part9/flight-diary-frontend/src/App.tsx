import { useEffect, useState } from 'react';
import NewDiary from './components/NewDiary';
import Diaries from './components/Diaries';

import { getDiaries } from './services/diaries';

import { type NonSensitiveDiaryEntry } from './types';

function App() {
	const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);

	useEffect(() => {
		const fetchDiaries = async () => {
			const diaries = await getDiaries();
			console.log('diaries:', diaries);
			setDiaries(diaries);
		};
		fetchDiaries();
	}, []);

	return (
		<>
			<div>
				<h1>Flight Diary</h1>
				<NewDiary />
				<Diaries entries={diaries} />
			</div>
		</>
	);
}

export default App;
