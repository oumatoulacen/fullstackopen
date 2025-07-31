const { startStandaloneServer } = require('@apollo/server/standalone');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { GraphQLError } = require('graphql');

const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connection to MongoDB:', error.message);
	});

const typeDefs = `
	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
	}

	type Token {
		value: String!
	}

	type Book {
		title: String!
		published: Int!
		author: Author!
		genres: [String!]!
		id: ID!
	}

	type Author {
		name: String!
		id: ID!
		born: Int
		bookCount: Int
	}

	type Query {
		bookCount: Int!
		authorCount: Int!
		allBooks(author: String, genre: String): [Book!]!
		allAuthors: [Author!]!
		me: User
	}

	type Mutation {
		addBook(
			title: String!
			published: Int!
			author: String!
			genres: [String!]!
		): Book!

		editAuthor(
			name: String!
			setBornTo: Int!
		): Author

		createUser(
			username: String!
			favoriteGenre: String!
		): User!

		login(
			username: String!
			password: String!
		): Token
	}
`;

const resolvers = {
	Query: {
		bookCount: () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),
		allBooks: async (_root, args) => {
			let filter = {};
			if (args.author) {
				const author = await Author.findOne({ name: args.author });
				if (!author) {
					throw new GraphQLError('Author not found', {
						extensions: {
							code: 'BAD_USER_INPUT',
							invalidArgs: args.author,
						},
					});
				}
				// If an author is specified, filter books by that author
				filter.author = author._id;
			}
			if (args.genre) {
				filter.genres = { $in: [args.genre] };
			}
			return Book.find(filter).populate('author');
		},
		allAuthors: async () => Author.find({}),
		me: (_root, _args, { currentUser }) => {
			return currentUser;
		},
	},

	Author: {
		bookCount: async (root) => {
			const books = await Book.find({ author: root.id });
			return books.length;
		},
	},

	Mutation: {
		createUser: async (_root, args) => {
			try {
				const user = new User({ ...args });
				return await user.save();
			} catch (error) {
				throw new GraphQLError('Faild to create new user', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args,
						error: error.message,
					},
				});
			}
		},

		login: async (_root, args) => {
			const user = await User.findOne({ username: args.username });
			if (!user || args.password !== 'secret') {
				throw new GraphQLError('Wrong Credentials', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args,
					},
				});
			}
			const userForToken = {
				username: user.username,
				id: user._id,
			};
			const token = jwt.sign(userForToken, process.env.JWT_SECRET);
			return { value: token };
		},

		addBook: async (_root, args, { currentUser }) => {
			if (!currentUser) {
				throw new GraphQLError('UNAUTHENTICATED', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				});
			}
			let author = await Author.findOne({ name: args.author });
			if (!author) {
				try {
					// If the author does not exist, create a new author
					const newAuthor = new Author({ name: args.author });
					await newAuthor.save();
					author = newAuthor; // Use the newly created author
				} catch (error) {
					throw new GraphQLError('Failed to add author', {
						extensions: {
							code: 'BAD_USER_INPUT',
							invalidArgs: args.author,
							error: error.message,
						},
					});
				}
			}

			try {
				const newBook = new Book({ ...args, author: author._id });
				const book = await newBook.save();
				return await book.populate('author');
			} catch (error) {
				throw new GraphQLError('Failed to add book', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args,
						error: error.message,
					},
				});
			}
		},
		editAuthor: async (_root, args, { currentUser }) => {
			if (!currentUser) {
				throw new GraphQLError('UNAUTHENTICATED', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				});
			}
			const author = await Author.findOne({ name: args.name });
			if (!author) {
				return null; // Author not found
			}
			try {
				author.born = args.setBornTo;
				await author.save();
			} catch (error) {
				throw new GraphQLError("Faild to update the author's birth year", {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.name,
						error: error.message,
					},
				});
			}
			return author;
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req }) => {
		const auth = req ? req.headers.authorization : null;
		if (auth && auth.toLowerCase().startsWith('bearer ')) {
			const token = auth.substring(7);
			const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
			const currentUser = await User.findById(decodedToken.id);
			return { currentUser };
		}
		return {};
	},
}).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
