let db = {};

db.update = function(collection, object) {
	if (!object.id) {
		let e =  new Error('[DB][UPDATE] Object does not have ID to replace (update)');
		e.obj = object;
		throw e;
	}

	let replacer = { id: object.id };
	return collection.findOneAndReplace(replacer, object).then(res => {
		if(res.lastErrorObject && !res.lastErrorObject.updatedExisting) {
			return collection.insertOne(object);
		}
	});
};

db.updateMany = function(collection, objects) {
	let p = [];

	objects.forEach(obj => {
		p.push(db.update(collection, obj));
	});

	return Promise.all(p);
};

module.exports = db;
