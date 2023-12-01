const users = [
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

const posts = [
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

const comments = [
    {
        id: '1',
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

const db = {
    users,
    posts,
    comments
}

export { db as default};
