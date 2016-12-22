import commondityModel from '../models/commondityModel.js';
import dataLoaderCreator from './dataLoaderCreator.js';

let commondityLoader = dataLoaderCreator.create((ids) => commondityModel._model.find().where('_id').in(ids).lean().exec());

export default commondityLoader;