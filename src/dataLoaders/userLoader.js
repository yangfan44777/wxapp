import userModel from '../models/userModel.js';
import dataLoaderCreator from './dataLoaderCreator.js';

let userLoader = dataLoaderCreator.create((ids) => userModel._model.find().where('user_id').in(ids).lean().exec(), 'user_id');

export default userLoader;