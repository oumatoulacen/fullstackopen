import { useState } from 'react';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notify from './components/Notify';

const App = () => {
	const [page, setPage] = useState('authors');
	const [notification, setNotification] = useState(null);

	const notify = (message, type) => {
		setNotification({ message, type });
		setTimeout(() => {
			setNotification(null);
		}, 5000);
	};

	return (
		<div>
			<Notify notification={notification} />
			<div>
				<button onClick={() => setPage('authors')}>authors</button>
				<button onClick={() => setPage('books')}>books</button>
				<button onClick={() => setPage('add')}>add book</button>
			</div>

			<Authors show={page === 'authors'} notify={notify} />

			<Books show={page === 'books'} notify={notify} />

			<NewBook show={page === 'add'} notify={notify} />
		</div>
	);
};

export default App;
