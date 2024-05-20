const Datastore = require('nedb');

global.testDb = new Datastore();

beforeEach((done) => {
    global.testDb.remove({}, {multi: true}, () => {
        global.testDb.loadDatabase(done);
    });
});
