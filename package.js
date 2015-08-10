Package.describe({
  name: 'flipace:tenantify',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use([
    'underscore',
    'gadicohen:headers',
    'matb33:collection-hooks'
  ]);
  
  api.addFiles('constants.js');
  api.addFiles('tenantify.js');

  api.export('Tenantify');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('flipace:tenantify');
  api.addFiles('tenantify-tests.js');
});
