import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const Authors = ({ show, notify }) => {
	const [selectedAuthor, setSelectedAuthor] = useState('');
	const [birthYear, setBirthYear] = useState(0);

	const [editAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
		skip: !show, // Skip the mutation if the component is not shown
		onError: (error) => {
			if (!error.graphQLErrors || error.graphQLErrors.length === 0) {
				notify(error.message, 'error');
				return;
			}
			const message = error.graphQLErrors.map((e) => e.message).join('\n');
			notify(message, 'error');
			setSelectedAuthor('');
			setBirthYear(0);
		},
		// Reset the form after mutation is completed
		onCompleted: () => {
			notify(`Birth year updated for ${selectedAuthor}`, 'success');
			setSelectedAuthor('');
			setBirthYear(0);
		},
	});

	const { loading, error, data } = useQuery(ALL_AUTHORS, {
		skip: !show, // Skip the query if the component is not shown
	});

	if (!show) {
		return null;
	}

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const authors = data.allAuthors;
	if (!authors || authors.length === 0) {
		return <p>No authors found.</p>;
	}

	const handleSetBirthYear = async (event) => {
		event.preventDefault();
		await editAuthor({
			variables: {
				name: selectedAuthor,
				setBornTo: parseInt(birthYear, 10),
			},
		});
	};

	return (
		<div>
			<h2>authors</h2>
			<table>
				<thead>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
				</thead>
				<tbody>
					{authors.map((a) => (
						<tr key={a.name}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>

			<h3>Set BirthYear</h3>
			<form onSubmit={handleSetBirthYear}>
				<div>
					<label htmlFor="author">Author:</label>
					<select
						id="author"
						value={selectedAuthor}
						onChange={({ target }) => setSelectedAuthor(target.value)}
					>
						<option value="">Select Author</option>
						{authors.map((a) => (
							<option key={a.name} value={a.name}>
								{a.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor="birthYear">Birth Year:</label>
					<input
						type="number"
						id="birthYear"
						value={birthYear}
						onChange={({ target }) => setBirthYear(target.value)}
					/>
				</div>
				<button type="submit">Update Birth Year</button>
			</form>
		</div>
	);
};

export default Authors;
