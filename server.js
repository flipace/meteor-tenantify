Meteor.methods({
    'flipace:tenantify/setHeaders': function(connection) {
      var callback, i, index, len, ref, results;
      if (process.env.NODE_ENV === 'development') {
        console.log("New tenantify connection:", connection.httpHeaders.host);
      }
      if (Tenantify._headers.host !== connection.httpHeaders.host) {
        Tenantify._currentTenantId = false;
      }
      Tenantify._headers = connection.httpHeaders;

      return Tenantify._headers;
    }
});

Meteor.onConnection(function(conn) {
    return Meteor.call('flipace:tenantify/setHeaders', conn);
});
