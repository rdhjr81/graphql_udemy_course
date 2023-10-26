import { GraphQLServer } from "graphql-yoga";

//type definitions 
const typeDefinitions = `
    type Query {
        users (query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`
const users = [
    {
        id: '1234567',
        name: 'Rob',
        email: 'rob@rob.com',
        age:42
    },
    {
        id: '222333',
        name: 'Joe',
        email: 'joe@aol.com',
        age:24
    },
    {
        id: '1234567',
        name: 'Donald',
        email: 'don@ron.com'
    }
];

const posts = [
    {
        id: '11111',
        title: 'my post title',
        body: 'I love writing blogs',
        published: true
    },
    {
        id: '1221',
        title: '2 post 2 title',
        body: 'I 2 love  2 writing blogs',
        published: false
    },
    {
        id: '132321',
        title: '3 3 2 3',
        body: '3 2 love  2 wri3ting b3ogs',
        published: true
    }
]

//resolvers 
const resolvers = {
    Query: {
        users(parent, args, ctx, info){
            if(args.query){
                return users.filter(u => {
                    const lowerCased = u.name.toLowerCase();
                    const lowerQuery = args.query.toLowerCase();
                    const present = lowerCased.indexOf(lowerQuery, 0) >= 0;
                    
                    return present;
                })
            }
            return users;
        }, 
        posts(parent, args, ctx, info){
            
            if(args.query){
                const lowerCasedQuery = args.query.toLowerCase();
                return posts.filter(p => {
                    const foundInBody = p.body.indexOf(lowerCasedQuery) >= 0;
                    const foundInTitle = p.title.indexOf(lowerCasedQuery) >= 0;
                    return foundInBody || foundInTitle;
                })
            }
            return posts;
        },       
        me(){
            return {
                id: '1234567',
                name: 'Rob',
                email: 'rob@rob.com',
                age:42
            };
        }
    }
}

const server = new GraphQLServer({
    typeDefs: typeDefinitions,
    resolvers: resolvers
});

server.start(() => {
    console.log('server is up');
})