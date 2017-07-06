# cdp-js

[![CircleCI](https://circleci.com/gh/CDP-Tokyo/cdp-js.svg?style=svg&circle-token=d0e6dcfd2fc69c799fa6f150e46a5ca14a085020)](https://circleci.com/gh/CDP-Tokyo/cdp-js)

## What is cdp-js

This monorepo contains cdp library modules.


### Repository structure

Folder and file structure of this repository is the following list.

    root/
        dist/                                       // for internal release modules directory
        docs/                                       // specification documents for this libraries
        packages/                                   // 3rd party library modules
        tests/                                      // test for task scripts


### How to install (for internal release)

* npm

        $ npm install git+http://scm.sm.sony.co.jp/gitlab/cdp-jp/cdp-js.git

### How to setup

If you want to use newest version, you can build the modules yourself as follow steps.

1. clone this repository

2. build the modules

        $ npm run setup
        $ npm run update

2. pick up from the `release` directory.

        root/
            dist/
                cdp.js             js modules for dev.
                cdp.min.js         js modules for release with versioned.
                cdp.min.map        js map file.
                @types/
                     cdp.d.ts      d.ts file for this module.

3. setup bower module manualy to your project.


### How to use
Please see the following documentation.

- [English/英語](docs/en)
- [Japanese/日本語](docs/jp)

## Release Notes
Please see the following link.

- [Release Notes](RELEASENOTE.md)


## License

Copyright 2016 Sony Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
