import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList
} from 'graphql';

let CommondityType = new GraphQLObjectType({
    name: 'CommondityType',
    fields: {
        _id: {
            type: GraphQLString
        },
        title: {
            type: GraphQLString
        },
        price: {
            type: GraphQLFloat
        },
        pic: {
            type: GraphQLString,
            args: {
                size: {
                    type: GraphQLString
                }
            },
            resolve: (_, {size}) => size + ' size pic'
        },
        detail_pics: {
            type: new GraphQLList(GraphQLString),
            args: {
                size: {
                    type: GraphQLString
                }
            },
            resolve: (_, {size}) => [size + ' size pic1', size + ' size pic2']
        },
        state: {
            type: GraphQLInt
        },
        count_rest: {
            type: GraphQLInt
        },
        count_sold: {
            type: GraphQLInt
        }
    }
});


export default CommondityType;
