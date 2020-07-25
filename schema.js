const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
const axios = require("axios");

const CustomerType = new GraphQLObjectType({
  name: "customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

//root query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValues, args) {
        return axios
          .get("http://localhost:3000/customers/" + args.id)
          .then((res) => res.data);
      },
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValues, args) {
        return axios
          .get("http://localhost:3000/customers")
          .then((res) => res.data);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValues, args) {
        return axios
          .post("http://localhost:3000/customers", {
            name: args.name,
            email: args.email,
            age: args.age,
          })
          .then((res) => res.data);
      },
    },
    updateCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValues, args) {
        return axios
          .put("http://localhost:3000/customers/" + args.id, {
            name: args.name,
            email: args.email,
            age: args.age,
          })
          .then((res) => res.data);
      },
    },
    deleteCustomer: {
      type: CustomerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValues, args) {
        return axios
          .delete("http://localhost:3000/customers/" + args.id)
          .then((res) => res.data);
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
