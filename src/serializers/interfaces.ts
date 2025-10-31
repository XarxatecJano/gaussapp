export interface ISerializer<TModel, TOutput> {
  serialize(model: TModel): TOutput;
}

export interface IDeserializer<TInput, TModel> {
  deserialize(data: TInput): TModel;
}