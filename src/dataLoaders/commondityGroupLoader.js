import commondityGroupModel from '../models/commondityGroupModel.js';
import dataLoaderCreator from './dataLoaderCreator.js';

let commondityGroupLoader = dataLoaderCreator.create((ids) => commondityGroupModel._model.find().where('_id').in(ids).lean().exec(), '_id');

export default commondityGroupLoader;