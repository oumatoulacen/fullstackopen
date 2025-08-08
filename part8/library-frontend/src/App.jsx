import { useState } from 'react';
import { useApolloClient, useSubscription } from '@apollo/client';

import Authors from './components/Authors';
import Books from './components/Books';
import Recommend from './components/Recommend';
import NewBook from './components/NewBook';
import Notify from './components/Notify';
import LoginForm from './components/LoginForm';

import { BOOK_ADDED, ALL_BOOKS } from './queries';

const App = () => {
	const [page, setPage] = useState('authors');
	const [notification, setNotification] = useState(null);
	const [token, setToken] = useState(
		localStorage.getItem('user-token') || null
	);
	const client = useApolloClient();

	// Subscription to handle book additions
	useSubscription(BOOK_ADDED, {
		onData: ({ data, client }) => {
			const bookAdded = data.data.bookAdded;
			notify(`New book added on server: ${bookAdded.title}}`, 'success');

			console.log('Book added on server', bookAdded);
			client.cache.updateQuery(
				{
					query: ALL_BOOKS,
				},
				(existingData) => {
					if (!existingData) return null;
					return {
						allBooks: [...existingData.allBooks, bookAdded],
					};
				}
			);
		},
		onError: (error) => {
			console.error('Subscription error:', error);
			notify('Error in subscription: ' + error.message, 'error');
		},
	});

	const notify = (message, type) => {
		setNotification({ message, type });
		setTimeout(() => {
			setNotification(null);
		}, 5000);
	};

	const logout = () => {
		setToken(null);
		localStorage.clear();
		client.resetStore();
		notify('Logged out successfully', 'success');
		setPage('authors'); // Redirect to authors page after logout
	};

	return (
		<div>
			<Notify notification={notification} />
			<div>
				<button onClick={() => setPage('authors')}>authors</button>
				<button onClick={() => setPage('books')}>books</button>
				{!token ? (
					<button onClick={() => setPage('login')}>login</button>
				) : (
					<>
						<button onClick={() => setPage('add')}>add book</button>
						<button onClick={() => setPage('recommend')}>recommend</button>
						<button onClick={logout}>logout</button>
					</>
				)}
			</div>

			{/* <p style={{ marginLeft: '10px' }}>
				Welcome,{' '}
				{localStorage.getItem('user-name')
					? localStorage.getItem('user-name').username
					: 'Anonymous user'}{' '}
			</p> */}
			<Recommend show={page === 'recommend'} notify={notify} />
			<LoginForm
				show={page === 'login'}
				setToken={setToken}
				notify={notify}
				setPage={setPage}
			/>
			<Authors show={page === 'authors'} notify={notify} />

			<Books show={page === 'books'} notify={notify} />

			<NewBook show={page === 'add'} notify={notify} />
		</div>
	);
};

export default App;
