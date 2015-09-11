[![Stories in Ready](https://badge.waffle.io/flipace/meteor-tenantify.png?label=ready&title=Ready)](https://waffle.io/flipace/meteor-tenantify)
tenantify
=========

tenantify is a meteor package which provides support
for (at least) subdomain multi-tenancy within one mongo database.

*i would like to extend its functionality to support multi-db setup too*

Requirements
-------------

tenantify is only tested with nginx.

Configuration
-------------

Setup a nginx server to proxy_pass to your meteor application.

You can do this like that:

    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;

tenantify uses a very simple and straightforward way
to define collections which should be "tenantified".

First, tell tenantify in which collection you save your tenant ids. This is straightforward:

	Tenantify.setTenantCollection(Teams, '_id');

`Teams` is the collection in which I have all my tenants. The `_id` field should be used as the tenant id.

When using the **subdomain-based** tenant system, you'll need to have a field with the key 'subdomain' which contains the `String` value of the subdomain for this tenant.

For example:

	_id    |    name    |    subdomain
	...    |  Client 1  |  client1
	...    |  Client 2  |  client2

To *"tenantify"* a collection, you simple use this command once on the server or the client - depending on your needs.

	Tenantify.collection(Projects, {
		tenantField: '_team_id',
		denyForNonTenant: true
	});

This adds the needed hooks so, every time you use Projects.find({}) afterwards, it's going to automatically add the appropriate tenant clause to the query.

The **denyForNonTenant** option allows you to get the results for all tenants if no tenant could be found. This is probably not needed most of the time, so it's default is **true**.

Contributing
============

Feel free to add issues, pull requests or feature requests.

Credits
============
Patrick Neschkudla

License
============
(MIT)
