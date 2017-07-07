# cordova-plugin-cdp-nativebridge

## What is Native Bridge

The libraries provides easier way to implement connection between JavaScript and Native code than the cordova original framework.


## About cordova-plugin-cdp-nativebridge/cdp.nativebridge

`cordova-plugin-cdp-nativebridge`: cordova plugin module which achieves generic Native Bridge function.

`cdp.nativebridge`: The js module for which utilize cordova-plugin-cdp-nativebridge.


### Repository structure
Folder and file structure of this repository is the following list.

    root/
        dev/                                        // Folder contains development bed projects for this libraries
        dist/                                       // [Bower module] bower distribution modules here.
        docs/                                       // Folder contains specification documents for this libraries
        release/                                    // built modules here.
        src/                                        // *[Plugin module] the plugin native source directory.
        www/                                        // *[Plugin module] the plugin js source directory.
        tests/                                      // *[Plugin module] the plugin jasmine test plugin directory.
        plugin.xml                                  // *[Plugin module] cordova plugin.xml file.
        bower.json                                  // [Bower module] the bower module settings file.

 `*` The case of master branch is empty.

### How to install

cordova-plugin-cdp-nativebridge

        $ npm install -g cordova
        $ cordova plugin add cordova-plugin-cdp-nativebridge

cdp.nativebridge.js

        $ npm install -g bower
        $ bower install https://github.com/sony/cordova-plugin-cdp-nativebridge.git


### How to build the modules

If you want to use newest version, you can build the modules yourself as follow steps.

1. build the modules

        $ cd dev
        $ npm install
        $ grunt deploy

2. pick up from the `release` directory.

        root/
            release/
                modules/                            js bower modules here.
                     include/                       d.ts files here.
                     jquery/                        jquery here.
                     sony/
                        cdp/                        cdp modules here.
                            scripts/
                                cdp.nativebridge.js *: nativebridge module.
                                cdp.promise.js         dependency module.
                plugins/
                    com.sony.cdp.plugin.nativebridge/  cordova plugin
                        src/
                        www/
                        plugin.xml

3. install cordova plugin

        copy release directory to somewhere. ex: temp dir
        
        $ cd <%your project root%>
        $ cordova plugin add <%temp%>/plugins/com.sony.cdp.nativebridge

4. setup bower module manualy to your project.

### How to use
Please see the following documentation.

- [English/英語](docs/en)
- [Japanese/日本語](docs/jp)

## Release Notes
Please see the following link.

- [Release Notes](RELEASENOTE.md)


## License

Copyright 2015, 2016 Sony Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
