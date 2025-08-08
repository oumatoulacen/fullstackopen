import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
	query {
		allAuthors {
			id
			name
			born
			bookCount
		}
	}
`;

export const ALL_BOOKS = gql`
	query allBooks($author: String, $genre: String) {
		allBooks(author: $author, genre: $genre) {
			id
			title
			author {
				id
				name
				born
				bookCount
			}
			published
			genres
		}
	}
`;

export const ADD_BOOK = gql`
	mutation addBook(
		$title: String!
		$author: String!
		$published: Int!
		$genres: [String!]!
	) {
		addBook(
			title: $title
			author: $author
			published: $published
			genres: $genres
		) {
			title
			author {
				id
				name
				born
				bookCount
			}
			published
			genres
		}
	}
`;

export const EDIT_AUTHOR = gql`
	mutation editAuthor($name: String!, $setBornTo: Int!) {
		editAuthor(name: $name, setBornTo: $setBornTo) {
			name
			born
			id
			bookCount
		}
	}
`;

export const BOOK_COUNT = gql`
	query {
		bookCount
	}
`;

export const AUTHOR_COUNT = gql`
	query {
		authorCount
	}
`;

export const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`;

export const CURRENT_USER = gql`
	query {
		me {
			username
			favoriteGenre
		}
	}
`;

export const CREATE_USER = gql`
	mutation createUser($username: String!, $favoriteGenre: String!) {
		createUser(username: $username, favoriteGenre: $favoriteGenre) {
			username
			favoriteGenre
		}
	}
`;

export const BOOK_DETAILS = gql`
	fragment BookDetails on Book {
		title
		published
		genres
	}
`;

export const BOOK_ADDED = gql`
	subscription {
		bookAdded {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`;
