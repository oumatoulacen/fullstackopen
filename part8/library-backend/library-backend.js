const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { v4: uuidv4 } = require('uuid');
const { GraphQLError } = require('graphql');

let authors = [
	{
		name: 'Robert Martin',
		id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
		born: 1952,
	},
	{
		name: 'Martin Fowler',
		id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
		born: 1963,
	},
	{
		name: 'Fyodor Dostoevsky',
		id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
		born: 1821,
	},
	{
		name: 'Joshua Kerievsky', // birthyear not known
		id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
	},
	{
		name: 'Sandi Metz', // birthyear not known
		id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
	},
];

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
 */

let books = [
	{
		title: 'Clean Code',
		published: 2008,
		author: 'Robert Martin',
		id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring'],
	},
	{
		title: 'Agile software development',
		published: 2002,
		author: 'Robert Martin',
		id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
		genres: ['agile', 'patterns', 'design'],
	},
	{
		title: 'Refactoring, edition 2',
		published: 2018,
		author: 'Martin Fowler',
		id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring'],
	},
	{
		title: 'Refactoring to patterns',
		published: 2008,
		author: 'Joshua Kerievsky',
		id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring', 'patterns'],
	},
	{
		title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
		published: 2012,
		author: 'Sandi Metz',
		id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring', 'design'],
	},
	{
		title: 'Crime and punishment',
		published: 1866,
		author: 'Fyodor Dostoevsky',
		id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
		genres: ['classic', 'crime'],
	},
	{
		title: 'Demons',
		published: 1872,
		author: 'Fyodor Dostoevsky',
		id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
		genres: ['classic', 'revolution'],
	},
];

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type AuthorDetails {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [AuthorDetails!]!
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
    ): AuthorDetails
  }
`;

const resolvers = {
	Query: {
		bookCount: () => books.length,
		authorCount: () => authors.length,
		allBooks(_root, args) {
			if (!args.author && !args.genre) {
				return books;
			}
			if (args.author && !args.genre) {
				return books.filter((book) => book.author === args.author);
			}
			if (!args.author && args.genre) {
				return books.filter((book) => book.genres.includes(args.genre));
			}
			// If both author and genre are provided, filter by both
			return books.filter(
				(book) =>
					book.author === args.author && book.genres.includes(args.genre)
			);
		},
		allAuthors: () =>
			authors.map((author) => ({
				name: author.name,
				id: author.id,
				born: author.born,
				bookCount: books.filter((book) => book.author === author.name).length,
			})),
	},

	Mutation: {
		addBook: (_root, args) => {
			if (books.find((book) => book.title === args.title)) {
				throw new GraphQLError('Book already exists', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.title,
					},
				});
			}
			if (!args.title || !args.author || !args.published || !args.genres) {
				throw new GraphQLError(
					`${!args.title ? 'Title' : ''} ${!args.author ? 'Author' : ''} ${
						!args.published ? 'Published' : ''
					} ${!args.genres ? 'Genres' : ''} must be provided`,
					{
						extensions: {
							code: 'BAD_USER_INPUT',
							invalidArgs: args,
						},
					}
				);
			}
			if (args.published < 0) {
				throw new GraphQLError('Published year must be a positive integer', {
					extensions: { code: 'BAD_USER_INPUT', argumentName: 'published' },
				});
			}
			if (!Array.isArray(args.genres)) {
				throw new GraphQLError('Genres must be an array', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.genres,
					},
				});
			}
			if (args.genres.some((genre) => typeof genre !== 'string')) {
				throw new GraphQLError('All genres must be strings', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.genres.filter(
							(genre) => typeof genre !== 'string'
						),
					},
				});
			}
			const newBook = {
				title: args.title,
				published: args.published,
				author: args.author,
				genres: args.genres,
				id: uuidv4(),
			};
			books.push(newBook);
			if (!authors.find((author) => author.name === args.author)) {
				authors.push({
					name: args.author,
					id: uuidv4(),
					born: null, // Assuming no birth year is provided
				});
			}
			return newBook;
		},
		editAuthor: (_root, args) => {
			const author = authors.find((a) => a.name === args.name);
			if (!author) {
				return null; // Author not found
			}
			author.born = args.setBornTo;
			return {
				name: author.name,
				id: author.id,
				born: author.born,
				bookCount: books.filter((book) => book.author === author.name).length,
			};
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

startStandaloneServer(server, {
	listen: { port: 4000 },
}).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
