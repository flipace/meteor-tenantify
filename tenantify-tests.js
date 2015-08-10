// Write your tests here!
// Here is an example.
Tinytest.add('setTenantCollection', function (test) {
	var testCollection = new Mongo.Collection('test');
	Tenantify.setTenantCollection(testCollection, '_id');
  	test.equal(testCollection, Tenantify._tenantCollection);
});
