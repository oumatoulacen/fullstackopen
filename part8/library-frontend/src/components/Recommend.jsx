import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { ALL_BOOKS, CURRENT_USER, ALL_AUTHORS } from '../queries';

const Recommend = ({ show }) => {
	const [favoriteGenre, setFavoriteGenre] = useState('');
	useQuery(CURRENT_USER, {
		skip: !localStorage.getItem('user-token') || !show, // Skip if no token
		onCompleted: (data) => {
			if (data && data.me) {
				setFavoriteGenre(data.me.favoriteGenre);
			}
		},
		onError: (error) => {
			console.error('Error fetching current user:', error);
			setFavoriteGenre(''); // Reset favorite genre on error
		},
	});
	const { data, loading, error } = useQuery(ALL_BOOKS, {
		skip: !show || !favoriteGenre,
		refetchQueries: [{ query: ALL_AUTHORS }],
		variables: { genre: favoriteGenre },
	});

	if (!show) {
		return null;
	}

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;
	if (!data || !data.allBooks) {
		return <p>No books found.</p>;
	}

	return (
		<div>
			<h2>Recommended Books</h2>
			<p>
				books in your favorite genre:{' '}
				<strong>
					<em>{favoriteGenre}</em>
				</strong>
			</p>
			{data.allBooks.length === 0 ? (
				<p>No books found in your favorite genre.</p>
			) : (
				<table>
					<thead>
						<tr>
							<th></th>
							<th>author</th>
							<th>published</th>
						</tr>
					</thead>
					<tbody>
						{data.allBooks.map((a) => (
							<tr key={a.title}>
								<td>{a.title}</td>
								<td>{a.author.name}</td>
								<td>{a.published}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default Recommend;
