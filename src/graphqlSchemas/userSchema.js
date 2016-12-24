import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLInt
} from 'graphql';

import UserModel from '../models/userModel.js';
import PhoneCodeModel from '../models/phoneCodeModel.js';
import UserType from '../graphqlTypes/userType.js';
import userLoader from '../dataLoaders/userLoader.js';
import cache from '../cacheModule/main.js';


let UserQueryRoot = new GraphQLObjectType({
    name: 'UserQueryRoot',
    fields: {
        User: {
            type: UserType,
            args: {
                /* 微信openid */
                user_id: {
                    type: GraphQLString
                }
            },
            resolve: (root, {user_id}) => userLoader.load(user_id)
        }
    }
});

let UserMutationRoot = new GraphQLObjectType({
    name: 'UserMutationRoot',
    fields: {
        user: {
            type: UserType,
            description: 'create new user.',
            args: {
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
                },
                registercode: {
                    type: GraphQLString 
                }
            },
            resolve: (_, args) => {
                let userData = {};
                for (let key in args) {
                    userData[key] = args[key];
                }

                /* 注册逻辑 */
                if (userData.registercode) {
                    let time = +new Date();
                    return PhoneCodeModel.findOneAndRemove({
                        openid: userData.user_id,
                        code: userData.registercode,
                        phone: userData.phone,
                        expire: {$gt: time}
                    }).then(phoneCode => {
                        if (phoneCode) {
                            return UserModel.create(userData);
                        }
                        return new Error("REG_FAIL");
                    });
                }

                /* 修改逻辑 */
                return UserModel.findOneAndUpdate({user_id: userData.user_id}, userData)
                .then((data) => {
                    userLoader.clearCache(userData.user_id);
                    return data;
                });
            }
        }
    }
});

let schema = new GraphQLSchema({
    query: UserQueryRoot,
    mutation: UserMutationRoot
});

export default schema;