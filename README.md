# IBM Web Generator 

[img-bluemix-powered]: https://img.shields.io/badge/bluemix-powered-blue.svg
[url-bluemix]: http://bluemix.net
[url-npm]: https://www.npmjs.com/package/generator-ibm-web
[img-license]: https://img.shields.io/npm/l/generator-ibm-web.svg
[img-version]: https://img.shields.io/npm/v/generator-ibm-web.svg
[img-npm-downloads-monthly]: https://img.shields.io/npm/dm/generator-ibm-web.svg
[img-npm-downloads-total]: https://img.shields.io/npm/dt/generator-ibm-web.svg

[img-travis-master]: https://travis-ci.org/ibm-developer/generator-ibm-web.svg?branch=master
[url-travis-master]: https://travis-ci.org/ibm-developer/generator-ibm-web/branches

[img-coveralls-master]: https://coveralls.io/repos/github/ibm-developer/generator-ibm-web/badge.svg
[url-coveralls-master]: https://coveralls.io/github/ibm-developer/generator-ibm-web

[img-codacy]: https://api.codacy.com/project/badge/Grade/a5893a4622094dc8920c8a372a8d3588?branch=master
[url-codacy]: https://www.codacy.com/app/ibm-developer/generator-ibm-web

## Getting Started with a generated project

1. Run the generator and choose the options:
  `yo web`

1. Select your chosen framework: None, Angular or React

1. Select your chosen language: Swift, Node, Java, Python-Flask or Python-Django

## Frameworks

Frameworks are chosen using the `framework` option at the end of the generator. For example,

```
yo web --framework {None, React, AngularJS}
```

### Basic

In the basic web project, the following files are created and stored in the `public` directory:

- `public/index.html` - Basic landing page with inline CSS and encoded image assets
- `public/404.html` - Basic 404 error page
- `public/500.html` - Basic 500 error page

It is important that the web server is registered to serve files in the `public` directory.

## React

- [react](https://facebook.github.io/react/) - to build user interfaces
- [webpack](https://webpack.github.io/) - bundles your JS modules
  - sass-loader 
  - css-loader
  - style-loader

Web sources for React projects are stored in the `client` directory:

- `client/index.html` - Landing page source
- `client/index.jsx` - Landing page source
- `client/app/App.jsx` - Component injected into landing page body
- `client/404.html` and `client/500.html` - Error page sources
- `client/default.css` - minimized stylesheet with inline encoded images

## AngularJS

Web sources for AngularJS projects are stored in the `client` directory:

- `client/index.html` - Landing page source 
- `client/component.html` - Landing page source
- `client/app.js` - Angular app initialization, config and routing
- `client/404.html` and `client/500.html` - Error page sources
- `client/default.css` - minimized stylesheet with inline encoded images



## Publishing Changes

In order to publish changes, you will need to fork the repository or branch off the `master` branch.

Make sure to follow the [conventional commit specification](https://conventionalcommits.org/) before contributing. To help you with commit a commit template is provide. Run `config.sh` to initialize the commit template to your `.git/config` or use [commitizen](https://www.npmjs.com/package/commitizen)

Once you are finished with your changes, run `npm test` to make sure all tests pass.

Do a pull request against `master`, make sure the build passes. A team member will review and merge your pull request.
Once merged to `master` an auto generated pull request will be created against master to update the changelog. Make sure that the CHANGELOG.md and the package.json is correct before merging the pull request. After the auto generated pull request has been merged to `master` the version will be bumped and published to Artifactory.