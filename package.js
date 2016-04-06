Package.describe({
  name: 'flipace:tenantify',
  version: '1.0.0',
  summary: 'easily setup multi tenancy for your meteor app',
  git: 'https://github.com/flipace/meteor-tenantify',
  documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.1.0.3');

    api.use([
        'underscore',
        'matb33:collection-hooks@0.8.1'
    ]);

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
