import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from 'graphql';

let UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: {
        user_id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        },
        location: {
            type: new GraphQLList(GraphQLString)
        },
        address: {
            type: new GraphQLList(GraphQLString)
        },
        postcode: {
            type: new GraphQLList(GraphQLString)
        },
        orders: {
            type: new GraphQLList(GraphQLString)
        }
    }
});
export default UserType;