import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt
} from 'graphql';

import CommondityGroupModel from '../models/commondityGroupModel.js';
import CommondityGroupType from '../graphqlTypes/commondityGroupType.js';
import commondityGroupLoader from '../dataLoaders/commondityGroupLoader.js';

let CommondityGroupRoot = new GraphQLObjectType({
    name: 'CommondityGroupRoot',
    fields: {
        CommondityGroup: {
            type: CommondityGroupType,
            args: {
                id: {
                    type: GraphQLString
                }
            },
            resolve: (root, {id}) => commondityGroupLoader.load(id)
                //return CommondityModel.findById(id);
        },
        CommondityGroups: {
            type: new GraphQLList(CommondityGroupType),
            args: {
                limit: {
                    type: GraphQLInt
                },
                offset: {
                    type: GraphQLInt
                }
            },
            resolve: (root, {limit, offset}, source, fieldsAST) => {
                /* 这里可以分析fieldsAST, 优化返回字段数量 */
                return CommondityGroupModel._model.find({}).limit(limit).skip(offset * limit).exec();
            }
        }
    }
});

let schema = new GraphQLSchema({
  query: CommondityGroupRoot
});

export default schema;