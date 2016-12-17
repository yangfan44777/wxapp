import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

let UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: {
        id: {
            type: GraphQLString
        },
        head_pic: {
            type: GraphQLString,
            args: {
                size: {
                    type: GraphQLString
                }
            },
            resolve: function (user, args) {
                var size = args['size'];
                return 'pic_url:xxx,size:'+size;
            }
        },
        nickname: {
            type: GraphQLString
        },
        realname: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        },
        location: {
            type: GraphQLString
        },
        address: {
            type: GraphQLString
        }
    }
});
export default UserType;