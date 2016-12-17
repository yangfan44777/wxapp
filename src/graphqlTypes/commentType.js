import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import UserType from './userType.js';

let CommentType = new GraphQLObjectType({
    name: 'CommentType',
    fields: {
        id: {
            type: GraphQLString
        },
        user: {
        	type: UserType,
            resolve: function (comment, args) {
                return {
                    nickname: comment.user
                };
            }
        },
        content: {
        	type: GraphQLString
        },
        comment_date: {
        	type: GraphQLString
        },
        reply: {
        	type: GraphQLString
        },
        reply_date: {
        	type: GraphQLString
        }
    }
});
export default CommentType;