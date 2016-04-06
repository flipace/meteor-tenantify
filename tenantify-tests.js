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
