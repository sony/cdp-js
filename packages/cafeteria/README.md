# cafeteria

## About Cafeteria

CDP SDK modules development bed.


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
        tasks/                  // task scripts directory.
        tests/                  // tests scripts directory.
        www/                    // target repository. compiled source and resource are set here.


### How to setup

    $ npm run setup

### How to development

* build

```
$ cordova build [platform] [--release]
```

* test

```
$ npm test
```


* update dependencies

```
$ npm run update
```


* only cdp modules update

```
$ npm run update:cdp
```


### How to use

Please see the following documentation.

- [English/英語](docs/en)
- [Japanese/日本語](docs/ja)


## License

Copyright 2016 Sony Corporation  
Copyright 2017 Sony Network Communications Inc.  

Licensed under the Apache License, Version 2.0 (the "License");  
you may not use this file except in compliance with the License.  
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software  
distributed under the License is distributed on an "AS IS" BASIS,  
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  
See the License for the specific language governing permissions and  
limitations under the License.
