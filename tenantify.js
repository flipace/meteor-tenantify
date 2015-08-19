Tenantify = {};

Tenantify._headers = false;
Tenantify._tenantCollection = false;
Tenantify._tenantField = '_tenantId'; // the tenant field name in the tenant collection

Tenantify.tenantIdentifyMethod = TENANTIFY_TYPE_SUBDOMAIN;

Tenantify._readyCallbacks = [];
Tenantify._currentTenantId = false;

Tenantify.setTenantCollection = function(collection, field) {
	this._tenantCollection = collection;
	this._tenantField = field;
}

Tenantify.collection = function(collection, options) {
	var defaults = {
		tenantField: Tenantify._tenantField,
		denyForNonTenant: true
	};

	var tenantifyOptions = options;

	tenantifyOptions = _.extend(defaults,tenantifyOptions);

	collection.before.find(function(userId, selector, options) {		
		selector = selector || {};
		options = options || {};
		
		var tenantId = Tenantify._currentTenantId || Tenantify.getTenantId();

		if(tenantId) {
			selector[tenantifyOptions.tenantField] = tenantId;
		} else if(tenantifyOptions.denyForNonTenant) {
			selector[tenantifyOptions.tenantField] = 'disallowed';
		}
	});

	collection.before.insert(function(userId, doc) {	
		var tenantId = Tenantify._currentTenantId || Tenantify.getTenantId();

		if(tenantId) {
			doc[tenantifyOptions.tenantField] = tenantId;
		} else if(tenantifyOptions.denyForNonTenant) {
			doc[tenantifyOptions.tenantField] = 'disallowed';
		}
	});
}

Tenantify.getTenantId = function(method) {
	// if a tenantId is already set, return it
	if(Tenantify._currentTenantId)
		return Tenantify._currentTenantId;

	// get the tenant id by using one of the given methods
	switch(this.tenantIdentifyMethod) {
		case TENANTIFY_TYPE_SUBDOMAIN: 
			if(this._headers) {
				var host = splitHostname(this._headers.host);

				if(typeof(host.subdomain) !== undefined && host.subdomain != '') {
					// it's a subdomain. let's find the tenant id
					var tenantData = Tenantify._tenantCollection.findOne({ subdomain: host.subdomain });
					
					if(tenantData) {
						Tenantify._currentTenantId = tenantData._id;
						return tenantData._id;
					}
				}
			}
			break;
		default: 
			return false;
			break;
	}

	return false;
}

Tenantify.setTenantId = function(id) {
	Tenantify._currentTenantId = id;
}

Tenantify.onReady = function(fn) {
	this._readyCallbacks.push(fn);
}

if(Meteor.isServer) {
	Meteor.methods({
		'flipace:tenantify/setHeaders': function(connection) {
			var runCallbacks = true;

			// if the new host is different than the previous one, we
			// reset the tenantId
			if(Tenantify._headers.host != connection.httpHeaders) {
				Tenantify._currentTenantId = false;
			}

			// save the headers for tenantify
			Tenantify._headers = connection.httpHeaders;

			if(runCallbacks) {
				var removeFromCallbacks = [];

				_.each(Tenantify._readyCallbacks, function(fn, i) {
					fn();

					removeFromCallbacks.push(i);
				});
			}
		}
	});

	Meteor.onConnection(function(conn) {
	    Meteor.call('flipace:tenantify/setHeaders', conn)
	});
}

Meteor.methods({
	'flipace:tenantify/setTenantId': function(id) {
		Tenantify.setTenantId(id);
	}
});

/**
 * Common functions
 */

function splitHostname(hostname) {
    var result = {};
    var regexParse = new RegExp('([a-z\-0-9]{2,63})\.([a-z\.]{2,5})$');
    var urlParts = regexParse.exec(hostname);

    if(urlParts) {
	    result.domain = urlParts[1];
	    result.type = urlParts[2];
	    result.subdomain = hostname.replace(result.domain + '.' + result.type, '').slice(0, -1);

	    if(result.subdomain.indexOf('.') > -1) {
	    	result.subdomain = result.subdomain.split('.')[0];
	    }
	}


	return result;
}