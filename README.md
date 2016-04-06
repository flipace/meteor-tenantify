[![Stories in Ready](https://badge.waffle.io/flipace/meteor-tenantify.png?label=ready&title=Ready)](https://waffle.io/flipace/meteor-tenantify)
tenantify
=========

tenantify is a meteor package which allows you to easily
limit collection queries based on a given key-value pair in each document.

This allows you to easily setup multi-tenancy.

***WARNING: v1.0.0 removed all subdomain/header specific code so tenantify is now
only a query limiter package. If you want to have subdomain multi-tenancy, you'll have to
implement the functionality for handling different subdomains on your own now.***

Requirements
-------------

tenantify is only tested with nginx.

Configuration
-------------
tenantify uses a very simple and straightforward way
to define collections which should be "tenantified".

First, tell tenantify in which collection you save your tenant ids. This is straightforward:

	Tenantify.setTenantCollection(Teams, '_id');

`Teams` is the collection in which I have all my tenants. The `_id` field should be used as the tenant id.

When using the **subdomain-based** tenant system, you'll want to have a field with the key 'subdomain' which contains the `String` value of the subdomain for this tenant.

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
