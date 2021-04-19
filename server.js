var express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP
var { buildSchema } = require('graphql');

// GraphQL schema
var schema = buildSchema(`
    type Query {
        page(id: Int!): Page
        pages(topic: String): [Page]
    },
    type Page {
        id: Int
        name: String
        page_type: String
        description: String
        url: String
        Header: Header
        About: About
        Services: [Services!]
    },
    type Header {
        logo_banner: String
        title : String
        paragraph: String
    },
    type About  {
        paragraph1: String
        paragraph2: String
        paragraph3: String
        invitation: String
        info: String
        author: String
        image: String
    },
    type Services  {
        Service: Service
    },
    type Service  { 
        icon: String
        name: String
        src: String
        page: String
    }
`);

var getData = function(){
    const fs = require('fs')
    const fileContents = fs.readFileSync('./data.json', 'utf8')

    try {
    const data = JSON.parse(fileContents)
    return data
    } catch(err) {
    console.error(err)
    }
  }

var pagesData = getData();

var getPage = function(args) { 
    var id = args.id;
    return pagesData.filter(page => {
        return page.id == id;
    })[0];
}

var root = {
    page: getPage
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', expressGraphQL({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));