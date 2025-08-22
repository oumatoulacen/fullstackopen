import { type NonSensitiveDiaryEntry } from '../types';

type Props = {
	entries: NonSensitiveDiaryEntry[];
};

function Diaries({ entries }: Props) {
	return (
		<div>
			<h2>Diaries</h2>
			{entries.map((entry) => (
				<div key={entry.id}>
					<h3>{entry.date}</h3>
					<p>Weather: {entry.weather}</p>
					<p>Visibility: {entry.visibility}</p>
				</div>
			))}
		</div>
	);
}

export default Diaries;
