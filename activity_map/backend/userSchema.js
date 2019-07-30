const {buildSchema} = require("graphql")
const schema = buildSchema(`
    type User {
        id: String!
        pw: String!
    }

    type Comment {
        content: String!
        postID: String!
        author: String!
        date: String!
    }

    type Mutation {
        createUser(id: String!, pw: String!): String
        createComment(content: String!, postID: String!, author: String!, date: String!): Boolean
        likePost(postID: String!, liker: String!): Int
    }

    type Query {
        login(id: String!, pw: String!): String
        comments(postID: String!): [Comment]
        totalGeoJson: Int
        geoJSON(page: Int, limit: Int): String
        likesCount(postID: String!): Int
    }
`)
module.exports = schema



