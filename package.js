Package.describe({
  name: 'flipace:tenantify',
  version: '0.1.0',
  summary: 'easily setup multi tenancy for your meteor app',
  git: 'https://github.com/flipace/meteor-tenantify',
  documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.3');

    api.use([
        'underscore',
        'gadicohen:headers',
        'matb33:collection-hooks'
    ]);

    api.addFiles('server.js', 'server');
    api.addFiles('client.js', 'client');
    api.addFiles('tenantify.js');

    api.export('Tenantify');
});

Package.onTest(function(api) {
    api.use([
      'autopublish',
      'insecure',
      'tinytest',
      'flipace:tenantify',
    ]);

    api.addFiles('tenantify-tests.js');
});
