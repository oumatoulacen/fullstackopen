import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ALL_AUTHORS } from '../queries';

const Books = ({ show }) => {
	const [selectedGenre, setSelectedGenre] = useState(null);
	const [genres, setGenres] = useState([
		'all',
		'refactoring',
		'design',
		'crime',
	]);
	const [filteredBooks, setFilteredBooks] = useState([]);

	const { loading, error } = useQuery(ALL_BOOKS, {
		refetchQueries: [{ query: ALL_AUTHORS }],
		skip: !show,
		variables: selectedGenre ? { genre: selectedGenre } : {},
		onCompleted: (data) => {
			if (data && data.allBooks) {
				setFilteredBooks(data.allBooks);

				const allGenres = new Set(genres);
				data.allBooks.forEach((book) => {
					book.genres.forEach((genre) => allGenres.add(genre));
				});
				setGenres([...Array.from(allGenres)]);
			}
		},
		onError: (error) => {
			if (!error.graphQLErrors || error.graphQLErrors.length === 0) {
				console.error(error.message);
				return;
			}
			const message = error.graphQLErrors.map((e) => e.message).join('\n');
			console.error(message);
		},
	});

	if (!show) {
		return null;
	}

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	// react filter
	// const filteredBooks =
	// 	selectedGenre === 'all'
	// 		? books
	// 		: books.filter((book) => book.genres.includes(selectedGenre));

	return (
		<div>
			<h2>books</h2>
			<p>
				in genre{' '}
				<strong>
					<em>{selectedGenre || 'all'}</em>
				</strong>
			</p>
			<p>
				{filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
			</p>
			<table>
				<thead>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
				</thead>
				<tbody>
					{filteredBooks.length ? (
						filteredBooks.map((a) => (
							<tr key={a.title}>
								<td>{a.title}</td>
								<td>{a.author.name}</td>
								<td>{a.published}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="3">No books found.</td>
						</tr>
					)}
				</tbody>
			</table>
			<h3>Filter by genre</h3>
			{genres.map((genre) => (
				<button
					key={genre}
					onClick={() => setSelectedGenre(genre === 'all' ? null : genre)}
					style={{
						backgroundColor:
							selectedGenre === genre ||
							(selectedGenre === null && genre === 'all')
								? 'lightblue'
								: 'white',
						border: '1px solid #ccc',
						borderRadius: '4px',
						margin: '5px',
						padding: '5px 10px',
						cursor: 'pointer',
					}}
				>
					{genre}
				</button>
			))}
		</div>
	);
};

export default Books;
