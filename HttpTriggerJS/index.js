const MongoClient = require('mongodb').MongoClient;
const auth = require('../shared/index');

module.exports = function (context, req) {
    MongoClient.connect(
        process.env.DBUrl,
        { auth: auth },
        (err, database) => {
            if (err) {
                context.log.error("Cannot connect to database");
                context.done();
            }
            let idea = ({ name, description, color } = req.body);

            var db = database.db(process.env.DBName);

            db.collection('Ideas').insertOne(
                {
                    name: idea.name,
                    description: idea.description,
                    color: idea.color
                },
                (err, result) => {
                    if (err) {
                        context.log.error("There was an issue with writing the new object to the database");
                        context.done();
                    }

                    context.res = {
                        body: idea
                    }
                    database.close();
                    context.done();
                }
            )
        }
    );
};