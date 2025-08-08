const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');
const { GraphQLError } = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const jwt = require('jsonwebtoken');

const pubsub = new PubSub();

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

				pubsub.publish('BOOK_ADDED', { bookAdded: book });
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
			if (!args.name || !args.setBornTo) {
				throw new GraphQLError('Name and birth year must be provided', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: { name: args.name, setBornTo: args.setBornTo },
					},
				});
			}
			if (typeof args.setBornTo !== 'number' || args.setBornTo < 0) {
				throw new GraphQLError('Birth year must be a positive integer', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.setBornTo,
					},
				});
			}

			const author = await Author.findOne({ name: args.name });
			if (!author) {
				throw new GraphQLError('Author not found', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.name,
					},
				});
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

	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
		},
	},
};

module.exports = resolvers;
