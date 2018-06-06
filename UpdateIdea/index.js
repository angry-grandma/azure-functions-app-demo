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
            let idea = ({
                id,
                name,
                description,
                color
            } = req.body);
            let ideaId = parseInt(req.params.id);
            db
                .collection('Ideas')
                .findOneAndUpdate({
                        id: ideaId
                    }, {
                        $set: {
                            id: idea.id,
                            name: idea.name,
                            description: idea.description,
                            color: idea.color
                        }
                    },
                    (err, ideas) => {
                        if (err) {
                            context.log.error("There was an issue with updating the object");
                            database.close();
                            context.done();
                        }
                        context.res = {
                            body: idea
                        };
                        database.close();
                        context.done();
                    }
                );
        }
    );
};