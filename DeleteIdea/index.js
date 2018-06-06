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
            const db = database.db(process.env.DBName);
            let ideaId = parseInt(req.params.id);
            db
                .collection('Ideas')
                .findOneAndDelete({
                    id: ideaId
                }, (err, result) => {
                    if (err) {
                        context.log.error("There was an issue with updating the object");
                        database.close();
                        context.done();
                    }
                    context.res = {
                        status: 200,
                        body: {
                            message: 'Idea deleted successfully!'
                        }
                    };
                    database.close();
                    context.done();
                });
        }
    );
}