// tenantify global
Tenantify = {};

Tenantify._tenantCollection = false;
Tenantify._tenantField = '_tenantId'; // the tenant field name in the tenant collection

Tenantify._tenantIdCache = {};

// functions
Tenantify.setTenantCollection = function(collection, field) {
  this._tenantCollection = collection;

  if (field) {
    this._tenantField = field;
  }
}

Tenantify.collection = function(collection, options) {
  var defaults = {
    tenantField: Tenantify._tenantField,
    denyForNonTenant: true
  };

  var tenantifyOptions = options;

  tenantifyOptions = _.extend(defaults,tenantifyOptions);

  var indexObject = {};
  indexObject[tenantifyOptions.tenantField] = 1;
  collection._ensureIndex(indexObject);

  collection.before.find(function(userId, selector, options) {
    selector = selector || {};
    options = options || {};

    if (selector._ignoreTenantify) {
      delete selector._ignoreTenantify;
      return;
    }

    var tenantId = Tenantify.getTenantId(userId);

    if(tenantId) {
      selector[tenantifyOptions.tenantField] = tenantId;
    } else if(tenantifyOptions.denyForNonTenant) {
      selector[tenantifyOptions.tenantField] = 'disallowed';
    }
  });

  collection.before.insert(function(userId, doc) {
    var tenantId = Tenantify.getTenantId(userId);

    if(tenantId) {
      doc[tenantifyOptions.tenantField] = tenantId;
    } else if(tenantifyOptions.denyForNonTenant) {
      doc[tenantifyOptions.tenantField] = 'disallowed';
    }
  });

  collection.before.update(function(userId, doc) {
    var tenantId = Tenantify.getTenantId(userId);

    if(tenantId) {
      // do
    } else if(tenantifyOptions.denyForNonTenant) {
      modifier = {}
    }
  });
}

Tenantify.getTenantId = function(userId) {
  // if a tenantId is already set, return it
  if(Tenantify._tenantIdCache[userId])
    return Tenantify._tenantIdCache[userId];

  var userData = Meteor.users.findOne(userId);
  var tenantId = userData.profile[Tenantify._tenantField];

  Tenantify._tenantIdCache[userId] = tenantId;

  return tenantId;
}
