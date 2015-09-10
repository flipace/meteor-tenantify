// Write your tests here!
// Here is an example.
Teams = new Meteor.Collection('teams');
Projects = new Meteor.Collection('projects');

if(Meteor.isServer) {
	Teams.remove({});
	Projects.remove({});

	var teamId = Teams.insert({
		name: 'Testteam',
		subdomain: 'test'
	});

	var otherTeamId = Teams.insert({
		name: 'Other team',
		subdomain: 'other'
	});

	var projectId = Projects.insert({
		teamId: teamId,
		name: 'ProjectA'
	});

	var otherProjectId = Projects.insert({
		teamId: otherTeamId,
		name: 'ProjectB'
	});
}

Tinytest.add('Tenantifies tenant collection should be the same as you provide as a parameter in setTenantConnection.', function (test) {
	Tenantify.setTenantCollection(Teams, '_id');
  	test.equal(Teams, Tenantify._tenantCollection);
});

if(Meteor.isServer) {
	Tinytest.addAsync('Tenantifies headers should be the connection headers on the server.', function (test, onComplete) {
		var connectionMock = {
			httpHeaders: {
				host: 'test.tenantify.io'
			}
		};

		Meteor.call('flipace:tenantify/setHeaders', connectionMock, function(err, res) {
			test.equal(res.host, connectionMock.httpHeaders.host);

			onComplete();
		});
	});
}

Tinytest.addAsync('Only current tenant data should be found in tenantified collections.', function(test, onComplete) {
	Tenantify.setTenantCollection(Teams, '_id');
	Tenantify.collection(Projects, { tenantField: 'teamId' });

	var connectionMock = {
		httpHeaders: {
			host: 'test.tenantify.io'
		}
	};

	Meteor.call('flipace:tenantify/setHeaders', connectionMock, function(err, res) {
		var testTeamProjects = Projects.find({}).fetch();

		test.length(testTeamProjects, 1, 'There must be 1 project available for the team on subdomain "test.*".');

		onComplete();
	});
});
