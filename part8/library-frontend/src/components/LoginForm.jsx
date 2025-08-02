import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';

const LoginForm = ({ show, notify, setToken, setPage }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [login, result] = useMutation(LOGIN, {
		onError: (error) => {
			if (!error.graphQLErrors || error.graphQLErrors.length === 0) {
				notify(error.message, 'error');
				return;
			}
			const message = error.graphQLErrors.map((e) => e.message).join('\n');
			notify(message, 'error');
		},
		onCompleted: () => {
			notify('Login successful', 'success');
			setPage('authors'); // Redirect to authors page after login
		},
		skip: !show,
	});

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value;
			setToken(token);
			localStorage.setItem('user-token', token);
		}
	}, [result.data, setToken]);

	if (!show) return null;

	const submit = async (event) => {
		event.preventDefault();

		login({ variables: { username, password } });
		setUsername('');
		setPassword('');
	};

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					username{' '}
					<input
						value={username}
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password{' '}
					<input
						type="password"
						value={password}
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type="submit">login</button>
				<p>
					<button onClick={() => setPage('authors')}>cancel</button>
				</p>
			</form>
		</div>
	);
};

export default LoginForm;
