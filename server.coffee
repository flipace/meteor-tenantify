Meteor.methods 'flipace:tenantify/setHeaders': (connection) ->
  # Debug
  if process.env.NODE_ENV == 'development'
  	console.log "New tenantify connection:", connection.httpHeaders.host

  # if the new host is different than the previous one, we
  # reset the tenantId
  if Tenantify._headers.host != connection.httpHeaders
    Tenantify._currentTenantId = false

  # save the headers for tenantify
  Tenantify._headers = connection.httpHeaders

  # run callbacks (= the tenant injection for collections)
  for callback, index in Tenantify._readyCallbacks
    callback()

Meteor.onConnection (conn) ->
  Meteor.call 'flipace:tenantify/setHeaders', conn