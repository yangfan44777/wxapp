import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList
} from 'graphql';

import CommentType from './commentType.js';
import CommondityType from './commondityType.js';
import commondityLoader from '../dataLoaders/commondityLoader.js';
import underscore from 'underscore';

let CommondityGroupType = new GraphQLObjectType({
    name: 'CommondityGroupType',
    fields: {
        _id: {
            type: GraphQLString
        },
        name: {
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
            }
        },
        type: {
            type: new GraphQLList(GraphQLString)
        },
        detail_pics: {
            type: new GraphQLList(GraphQLString),
            args: {
                size: {
                    type: GraphQLString
                }
            }
        },
        comments: {
            type: new GraphQLList(CommentType)/*,
            resolve: (_) => _.comments_id.map((id) => commentLoader.load(id))*/

        },

        /*  */
        sku: {
            type: new GraphQLList(CommondityType),
            args: {
                ids: {
                    type: new GraphQLList(GraphQLString)
                }
            },
            resolve: (_, {ids}) => {
                ids = ids ? underscore.intersection(ids, _.sku) : _.sku;
                return ids.map((id) => commondityLoader.load(id));
            }
        }
    }
});


export default CommondityGroupType;
