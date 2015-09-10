Meteor.startup(function() {
    Tenantify._headers = { host: window.location.hostname };
});
