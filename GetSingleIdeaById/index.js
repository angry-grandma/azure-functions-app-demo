const MongoClient = require('mongodb').MongoClient;
const auth = require('../shared/index');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    MongoClient.connect(
        process.env.DBUrl, {
            auth: auth
        },
        (err, database) => {
            if (err) {
                context.log.error('Could not connect to database');
                context.done();
            };
            context.log('Connected succesfully');
            const db = database.db(process.env.DBName);
            db
                .collection('Ideas')
                .findOne({ id: parseInt(req.params.id) }, (err, result) => {
                    if (err) {
                        context.log.error("There was an issue with retrieving the objects from DB");
                        database.close();
                        context.done();
                    }
                    delete result._id;
                    context.res = {
                        body: result
                    };
                    database.close();
                    context.done();
                });
        }
    );
};