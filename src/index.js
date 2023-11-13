import { GraphQLServer } from "graphql-yoga";
import {v4 as uuidv4} from 'uuid';

//type definitions 
const typeDefinitions = `
    type Query {
        users (query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        comments: [Comment!]!
    }

    type Mutation{
        createUser(data: CreateUserInput!):User!
        deleteUser(id: ID!) : User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
    }

    input CreateUserInput{
        name: String!, 
        email: String!, 
        age: Int
    }

    input CreatePostInput {
        title: String!, 
        body: String!, 
        published: Boolean!, 
        author: ID!
    }

    input CreateCommentInput{
        text: String!, 
        author: ID!, 
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int,
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`
let users = [
    {
        id: '1',
        name: 'Rob',
        email: 'rob@rob.com',
        age:42
    },
    {
        id: '2',
        name: 'Joe',
        email: 'joe@aol.com',
        age:24
    },
    {
        id: '3', 
        name: 'Donald',
        email: 'don@ron.com'
    }
];

let posts = [
    {
        id: '1',
        title: 'my post title',
        body: 'I love writing blogs',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: '2 post 2 title',
        body: 'I 2 love  2 writing blogs',
        published: false,
        author: '1'
    },
    {
        id: '3',
        title: '3 3 2 3',
        body: '3 2 love  2 wri3ting b3ogs',
        published: true,
        author: '2'
    }
]

let comments = [
    {
        id: 'c1',
        text: 'garbage through and through!',
        author: '2',
        post: '1'
    },
    {
        id: 'c2',
        text: 'delightfully unoriginal',
        author: '2',
        post: '1'
    },
    {
        id: 'c3',
        text: 'read like a book should',
        author: '1',
        post: '2'
    },
    {
        id: 'c4',
        text: 'they didnt pay me enough to finish it!',
        author: '3',
        post: '3'
    },

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
        },
        comments(){
            return comments;
        }
    },
    Mutation:{
        createUser(parent, args, ctx, info){
            const emailTaken = users.some(u => u.email === args.email);

            if(emailTaken){
                throw new Error('email taken')
            }

            const newUser = {
                ...args.data,
                id: uuidv4(),
            }

            users.push(newUser);

            return newUser;
        },
        deleteUser(parent, args, ctx, info){
            const indexOf = users.findIndex(u => u.id === args.id);
            if(indexOf < 0){
                throw new Error(`user id ${args.id} does not exist`)
            }
            else{
                const deletedUsers = users.splice(indexOf, 1);

                let userPosts = posts.filter(p => p.author === args.id);
                posts = posts.filter(p => p.author !== args.id);

                comments = comments.filter(c => c.author !== args.id || !(userPosts.find(p => p.id === c.post)));
                console.log(comments);
                return deletedUsers[0];
            }
        },
        createPost(parent, args, ctx, info){
            const authorExists = users.some(u => u.id === args.data.author);
            if(authorExists){
                const post =  {
                    ...args.data,
                        id: uuidv4(),
                }
                posts.push(post);
                return post;
            }else{
                throw new Error(`user id ${args.author} does not exist`)
            }
        },
        deletePost(parent, args, ctx, info){
            comments = comments.filter(c => c.ppst !== args.id);
            
            const deletedPost = posts.find(p => p.id === args.id);

            posts = posts.filter(p => p.id !== args.id);

            return deletedPost;
        },
        createComment(parent, args, ctx, info){
            const postExists = posts.some(p => p.id == args.data.post);
``
            if(postExists){
                const authorExists = users.some(u => u.id === args.data.author);
                if(authorExists){

                    const comment =  {
                        ...args.data,
                        id: uuidv4(),
                    }

                    comments.push(comment);

                    return comment;
                }else{
                    throw new Error(`user with id ${args.author} does not exist`);
                }
            }
            else{
                throw new Error(`post with id ${args.post} does not exist`);
            }
        }
    },
    Post:{
        author(parent, args, ctx, info){
            const user = users.find(u => u.id === parent.author);
            return user;
        },
        comments(parent, args, ctx, info){
            const postComments = comments.filter(c => c.post === parent.id);
            return postComments;
        }
    }, 
    User:{
        posts (parent, args, ctx, info) {
            return posts.filter(p => p.author === parent.id);
        }, 
        comments(parent, args, ctx, info){
            return comments.filter(c => c.author === parent.id)
        }
    },
    Comment:{
        author(parent, args, ctx, info){
            return users.find(u => u.id === parent.author)
        },
        post(parent, args, ctx, info){
            const _post = posts.find(p => p.id = parent.post);
            return _post
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