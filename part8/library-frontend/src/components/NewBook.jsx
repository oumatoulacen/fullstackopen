import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries';

const NewBook = ({ show, notify }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [published, setPublished] = useState(0);
	const [genre, setGenre] = useState('');
	const [genres, setGenres] = useState([]);

	const [addBook] = useMutation(ADD_BOOK, {
		refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
		onCompleted: () => {
			notify(`Book added: ${title}`, 'success');
		},
		onError: (error) => {
			if (!error.graphQLErrors || error.graphQLErrors.length === 0) {
				notify(error.message, 'error');
				return;
			}
			const message = error.graphQLErrors.map((e) => e.message).join('\n');
			notify(message, 'error');
		},
		skip: !show,
	});

	if (!show) {
		return null;
	}

	const submit = async (event) => {
		event.preventDefault();

		console.log('add book...');
		await addBook({
			variables: {
				title,
				author,
				published: parseInt(published, 10),
				genres,
			},
		});

		setTitle('');
		setPublished(0);
		setAuthor('');
		setGenres([]);
		setGenre('');
	};

	const addGenre = () => {
		setGenres(genres.concat(genre));
		setGenre('');
	};

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					title
					<input
						value={title}
						onChange={({ target }) => setTitle(target.value)}
					/>
				</div>
				<div>
					author
					<input
						value={author}
						onChange={({ target }) => setAuthor(target.value)}
					/>
				</div>
				<div>
					published
					<input
						type="number"
						value={published}
						onChange={({ target }) => setPublished(target.value)}
					/>
				</div>
				<div>
					<input
						value={genre}
						onChange={({ target }) => setGenre(target.value)}
					/>
					<button onClick={addGenre} type="button">
						add genre
					</button>
				</div>
				<div>genres: {genres.join(' ')}</div>
				<button type="submit">create book</button>
			</form>
		</div>
	);
};

export default NewBook;
