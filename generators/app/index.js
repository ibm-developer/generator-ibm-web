/*
 © Copyright IBM Corp. 2018
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

'use strict';
const Generator = require('yeoman-generator');
const dep = require('./templates/dependencies.json');
const reactDep = require('./templates/react/dependencies.json');
const angularJsDep = require('./templates/angularjs/dependencies.json');
const Handlebars = require('handlebars');

const scripts = dep.scripts;
const angularJsScripts = angularJsDep.scripts;

const devDependencies = dep.devDependencies;
const angularJsDevDependencies = angularJsDep.devDependencies;
const defaultNodeVersion = "^8.11.0";

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);

		this.framework = opts.framework;
		this.nodeVersion = opts.nodeVersion || defaultNodeVersion;

		if (typeof (opts.bluemix) === 'string') {
			this.bluemix = JSON.parse(opts.bluemix || "{}");
		} else {
			this.bluemix = opts.bluemix;
		}

		if (opts.cloudContext) {
			this.opts = opts.cloudContext
			this.opts.libertyVersion = opts.libertyVersion
		} else {
			this.opts = opts
		}

		this.humanNameLanguage = {
			"NODE": "NodeJS",
			"SWIFT": "Swift",
			"JAVA": "Java",
			"PYTHON": "Python",
			"DJANGO": "Django",
			"GO": "Go"
		};
	}

	paths() {
		this.sourceRoot();
		this.templatePath('index.js');
	}

	prompting() {
		let prompts = [];
		if (this.bluemix === undefined) {
			this.bluemix = {};
			prompts.push({
				type: 'input',
				name: 'name',
				message: 'Your project name'
			});
			prompts.push({
				type: 'list',
				name: 'framework',
				message: 'What framework are you using',
				choices: [
					"None",
					"React",
					"AngularJS"
				]
			});
			prompts.push({
				type: 'list',
				name: 'language',
				message: 'What language are you using',
				choices: [
					"SWIFT",
					"NODE",
					"JAVA",
					"PYTHON",
					"DJANGO",
					"GO"
				]
			});

			prompts.push({
				type: 'input',
				name: 'nodeVersion',
				when: answers => answers.language === 'NODE',
				message: 'Specify the verison of node that you wish to use.'
			});

		}

		return this.prompt(prompts).then(this._processAnswers.bind(this));
	}

	_processAnswers(answers) {

		this.bluemix.backendPlatform = answers.language || this.bluemix.backendPlatform;
		this.framework = answers.framework || this.framework;
		this.bluemix.name = answers.name || this.bluemix.name;
		this.nodeVersion = answers.nodeVersion || this.nodeVersion;
	}

	write() {
		switch (this.framework) {
			case "None":
				this._generateBasic();
				break;
			case "React":
				this._generateReact();
				break;
			case "AngularJS":
				this._generateAngularJS();
				break;
			default:
				this._generateBasic();
				break;
		}
	}

	_generateBasic() {

		// Replace server test with Web specific test.
		if (this.bluemix.backendPlatform === 'NODE') {
			this.fs.copyTpl(
				this.templatePath('basic/test-server.js'),
				this.destinationPath('test/test-server.js'), {}
			);

			this.fs.copyTpl(
				this.templatePath('basic/node/index.html'),
				this.destinationPath('public/index.html'), {
					applicationName: this.bluemix.name,
					language: this.humanNameLanguage[this.bluemix.backendPlatform]
				}
			);
			this.fs.copyTpl(
				this.templatePath('basic/node/404.html'),
				this.destinationPath('public/404.html'), {}
			);
			this.fs.copyTpl(
				this.templatePath('basic/node/500.html'),
				this.destinationPath('public/500.html'), {}
			);
		}

		else if (this.bluemix.backendPlatform === 'GO') {
			this.fs.copyTpl(
				this.templatePath('basic/go'),
				this.destinationPath('public'), {}
			);
		}

		else {
			this.fs.copyTpl(
				this.templatePath('basic/python/index.html'),
				this.destinationPath('public/index.html'), {
					applicationName: this.bluemix.name,
					language: this.humanNameLanguage[this.bluemix.backendPlatform]
				}
			);
			this.fs.copyTpl(
				this.templatePath('basic/python/404.html'),
				this.destinationPath('public/404.html'), {}
			);
			this.fs.copyTpl(
				this.templatePath('basic/python/500.html'),
				this.destinationPath('public/500.html'), {}
			);
		}

	}

	_generateReact() {

		// Replace server test with Web specific test.
		this.fs.copyTpl(
			this.templatePath('react/test-server.js'),
			this.destinationPath('test/test-server.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('react/Procfile-dev'),
			this.destinationPath('Procfile-dev'), {}
		);

		this.fs.copyTpl(
			this.templatePath('react/Procfile-debug'),
			this.destinationPath('Procfile-debug'), {}
		);


		this.fs.copyTpl(
			this.templatePath('react/webpack.common.js'),
			this.destinationPath('webpack.common.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('react/webpack.dev-proxy.js'),
			this.destinationPath('webpack.dev-proxy.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('react/webpack.dev-standalone.js'),
			this.destinationPath('webpack.dev-standalone.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('react/webpack.prod.js'),
			this.destinationPath('webpack.prod.js'), {}
		);

		if (!this.fs.exists(this.destinationPath('package.json'))) {
			this._writeHandlebarsFile('package.json', 'package.json', {
				applicationName: this.bluemix.name,
				language: this.bluemix.backendPlatform,
				nodeVersion: this.nodeVersion
			});
		}

		this._augmentPackageJSON({ react: true });

		this.fs.copyTpl(
			this.templatePath('react/client'),
			this.destinationPath('client'), {}
		);

	}

	_generateAngularJS() {

		// Replace server test with Web specific test.
		this.fs.copyTpl(
			this.templatePath('angularjs/test-server.js'),
			this.destinationPath('test/test-server.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('angularjs/webpack.common.js'),
			this.destinationPath('webpack.common.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('angularjs/webpack.dev-proxy.js'),
			this.destinationPath('webpack.dev-proxy.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('angularjs/webpack.dev-standalone.js'),
			this.destinationPath('webpack.dev-standalone.js'), {}
		);

		this.fs.copyTpl(
			this.templatePath('angularjs/webpack.prod.js'),
			this.destinationPath('webpack.prod.js'), {}
		);

		if (!this.fs.exists(this.destinationPath('package.json'))) {
			this._writeHandlebarsFile('package.json', 'package.json', {
				applicationName: this.bluemix.name,
				language: this.bluemix.backendPlatform,
				nodeVersion: this.nodeVersion
			});
		}

		this._augmentPackageJSON({ angularjs: true });

		this.fs.copyTpl(
			this.templatePath('angularjs/client/app.js'),
			this.destinationPath('client/app.js'), {}
		);
		this.fs.copyTpl(
			this.templatePath('angularjs/client/component.html'),
			this.destinationPath('client/component.html'), {}
		);
		this.fs.copyTpl(
			this.templatePath('angularjs/client/default.css'),
			this.destinationPath('client/default.css'), {}
		);
		this.fs.copyTpl(
			this.templatePath('angularjs/client/index.html'),
			this.destinationPath('client/index.html'), {}
		);

		this.fs.copyTpl(
			this.templatePath('angularjs/client/404.html'),
			this.destinationPath('public/404.html'), {}
		);

		this.fs.copyTpl(
			this.templatePath('angularjs/client/500.html'),
			this.destinationPath('public/500.html'), {}
		);

	}

	_augmentPackageJSON(options) {
		let packageFile = this.fs.read(this.destinationPath('package.json'), { defaults: "{}" });
		let packageFileJSON;

		try {
			packageFileJSON = JSON.parse(packageFile);
		} catch (err) {
			packageFileJSON = {};
		}

		if (packageFileJSON.devDependencies === undefined) {
			packageFileJSON.devDependencies = {};
		}

		packageFileJSON.scripts = Object.assign(packageFileJSON.scripts, scripts);
		packageFileJSON.devDependencies = Object.assign(packageFileJSON.devDependencies, devDependencies);

		if (options !== undefined && options.react) {
			packageFileJSON.scripts = Object.assign(packageFileJSON.scripts, reactDep.scripts);
			packageFileJSON.devDependencies = Object.assign(packageFileJSON.devDependencies, reactDep.devDependencies);
		}

		if (options !== undefined && options.angularjs) {
			packageFileJSON.devDependencies = Object.assign(packageFileJSON.devDependencies, angularJsDevDependencies);
			packageFileJSON.scripts = Object.assign(packageFileJSON.scripts, angularJsScripts);
		}

		this.fs.writeJSON(this.destinationPath('package.json'), packageFileJSON, null, 4);
	}

	_writeHandlebarsFile(templateFile, destinationFile, data) {
		let template = this.fs.read(this.templatePath(templateFile));
		let compiledTemplate = Handlebars.compile(template);
		let output = compiledTemplate(data);
		this.fs.write(this.destinationPath(destinationFile), output);
	}


};
