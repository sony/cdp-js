# cdp-ui-listview

## What is this module

* TODO:


### Repository structure
Folder and file structure of this repository is the following list.

    root/
        docs/           // specification documents for this libraries
        external/       // 3rd party library modules
        src/            // development sources for this libraries
        tests/          // test scripts for this libraries


### How to install

* npm

        $ npm install @cdp/ui-listview


### How to build the module

If you want to use newest version, you can build the modules yourself as follow steps.

1. build the modules

        $ npm install
        $ npm run package

2. pick up from the `dist` directory.

        root/
            dist/
                cdp.ui.listview.js             js modules for dev.
                cdp.ui.listview.min.js         js modules for release with versioned.
                cdp.ui.listview.min.js.map     js map file.
                @types/
                     cdp.ui.listview.d.ts      d.ts file for this module.

### How to test the module

CI command as following.

        $ npm install -g testem
        $ npm install
        
        $ npm run ci

LINT command as following.
        
        $ npm install
        
        $ npm run lint


### How to use
Please see the following documentation.

- [English/英語](docs/en)
- [Japanese/日本語](docs/jp)

## Release Notes
Please see the following link.

- [Release Notes](RELEASENOTE.md)


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
