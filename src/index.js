import { GraphQLServer } from "graphql-yoga";
import {v4 as uuidv4} from 'uuid';
import db from "./db";

//resolvers 
const resolvers = {
    Query: {
        users(parent, args, { db }, info){
            console.log(db)
            if(args.query){
                return db.users.filter(u => {
                    const lowerCased = u.name.toLowerCase();
                    const lowerQuery = args.query.toLowerCase();
                    const present = lowerCased.indexOf(lowerQuery, 0) >= 0;
                    
                    return present;
                })
            }
            return db.users;
        },  
        posts(parent, args, { db }, info){
            if(args.query){
                const lowerCasedQuery = args.query.toLowerCase();
                return db.posts.filter(p => {
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
        comments(parent, args, { db }, info){
            return db.comments;
        }
    },
    Mutation:{
        createUser(parent, args, { db }, info){
            const emailTaken = db.users.some(u => u.email === args.email);

            if(emailTaken){
                throw new Error('email taken')
            }

            const newUser = {
                ...args.data,
                id: uuidv4(),
            }

           db.users.push(newUser);

            return newUser;
        },
        deleteUser(parent, args, { db }, info){
            const indexOf = db.users.findIndex(u => u.id === args.id);
            if(indexOf < 0){
                throw new Error(`user id ${args.id} does not exist`)
            }
            else{
                const deletedUsers = db.users.splice(indexOf, 1);

                let userPosts = db.posts.filter(p => p.author === args.id);
                db.posts = db.posts.filter(p => p.author !== args.id);

                comments = db.comments.filter(c => c.author !== args.id || !(userPosts.find(p => p.id === c.post)));
                console.log(comments);
                return deletedUsers[0];
            }
        },
        createPost(parent, args, { db }, info){
            const authorExists = db.users.some(u => u.id === args.data.author);
            if(authorExists){
                const post =  {
                    ...args.data,
                        id: uuidv4(),
                }
                db.posts.push(post);
                return post; 
            }else{
                throw new Error(`user id ${args.author} does not exist`)
            }
        },
        deletePost(parent, args, { db }, info){
            const indexOf = db.posts.findIndex(p => p.id === args.id);

            if(indexOf < 0){
                throw new Error(`post id ${args.id} does not exist`);
            }

            comments = db.comments.filter(c => c.post !== args.id);

            const deletedPost = db.posts.splice(indexOf, 1);

            return deletedPost[0];
        },
        createComment(parent, args, { db }, info){
            const postExists = db.posts.some(p => p.id == args.data.post);
``
            if(postExists){
                const authorExists = db.users.some(u => u.id === args.data.author);
                if(authorExists){

                    const comment =  {  
                        ...args.data,
                        id: uuidv4(),
                    }

                    db.comments.push(comment);

                    return comment;
                }else{
                    throw new Error(`user with id ${args.author} does not exist`);
                }
            }
            else{
                throw new Error(`post with id ${args.post} does not exist`);
            }
        },
        deleteComment(parent, args, { db }, info){
            const indexOf = db.comments.findIndex(c => c.id === args.id);

            if(indexOf < 0){
                throw new Error(`comment with id ${args.id} does not exist`);
            }

            const deletedComments = db.comments.splice(indexOf,1);
            return deletedComments[0];
        }
    },
    Post:{
        author(parent, args, { db }, info){
            const user = db.users.find(u => u.id === parent.author);
            return user;
        },
        comments(parent, args, { db }, info){
            const postComments = db.comments.filter(c => c.post === parent.id);
            return postComments;
        }
    }, 
    User:{
        posts (parent, args, { db }, info) {
            returndb.posts.filter(p => p.author === parent.id);
        }, 
        comments(parent, args, { db }, info){
            return db.comments.filter(c => c.author === parent.id)
        }
    },
    Comment:{
        author(parent, args, { db }, info){
            returndb.users.find(u => u.id === parent.author)
        },
        post(parent, args, { db }, info){
            const _post =db.posts.find(p => p.id = parent.post);
            return _post
        }
    }
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: resolvers,
    context: {
        db
    }
});

server.start(() => {
    console.log('server is up');
})