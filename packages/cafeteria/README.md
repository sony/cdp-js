# cafeteria

## About Cafeteria

[TODO]


### Repository structure

Folder and file structure of this repository is the following list.

    root/
        app/                    // application development root directory.
            external/           // 3rd party library modules here.
            lib/                // for internal library module development.
            porting/            // platform specific sources are here.
            res/                // for application resources.
            scripts/            // .ts files here.
            stylesheets/        // .scss files here.
            templates/          // templates files are here.
            index.html          // application root file.
        docs/                   // specification documents.
        hooks/                  // cordova hook scripts here.
        plugins/                // installed cordova plugins here.
        platforms/              // native project setting files and sources.
        tests/                  // tests scripts directory.
        www/                    // target repository. compiled source and resource are set here.


### How to setup

    $ npm install

### How to development

* build

    $ cordova build [platform] [--release]

* test

    $ npm test

* update dependencies

    $ npm run update

** only cdp modules

    $ npm run update:cdp


### How to use

Please see the following documentation.

- [English/英語](docs/en)
- [Japanese/日本語](docs/ja)

## Release Notes

[TODO]

## License

Apache-2.0
