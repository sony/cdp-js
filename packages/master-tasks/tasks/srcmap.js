/* eslint-env node, es6 */
'use strict';
const fs                = require('fs');
const path              = require('path');
const convert           = require('convert-source-map');
const SourceMapConsumer = require('source-map').SourceMapConsumer;
const SourceNode        = require('source-map').SourceNode;

///////////////////////////////////////////////////////////////////////
// exports methods:

// get sourceNode from inline-source-map file
function getNodeFromScriptFile(scriptfile) {
    if (fs.existsSync(scriptfile)) {
        try {
            return SourceNode.fromStringWithSourceMap(
                getScriptFromFile(scriptfile),
                new SourceMapConsumer(getMapFromScriptFile(scriptfile))
            );
        } catch (error) {
            console.error('getNodeFromScriptFile() error: ' + error);
            return new SourceNode();
        }
    } else {
        return new SourceNode();
    }
}

// get sourceNode from script and map files
function getNodeFromFiles(scriptFile, mapFile) {
    if (fs.existsSync(scriptFile) && fs.existsSync(mapFile)) {
        try {
            return SourceNode.fromStringWithSourceMap(
                getScriptFromFile(scriptFile),
                new SourceMapConsumer(getMapFromMapFile(mapFile))
            );
        } catch (error) {
            console.error('getNodeFromFiles() error: ' + error);
            return new SourceNode();
        }
    } else {
        return new SourceNode();
    }
}

// get sourceNode from code
function getNodeFromCode(code) {
    if (convert.mapFileCommentRegex.test(code)) {
        try {
            return SourceNode.fromStringWithSourceMap(
                convertCode2Script(code),
                new SourceMapConsumer(convert.fromComment(code).toObject())
            );
        } catch (error) {
            console.error('getNodeFromCode() error: ' + error);
            const node = new SourceNode();
            node.add(convertCode2Script(code));
            return node;
        }
    } else {
        const node = new SourceNode();
        node.add(convertCode2Script(code));
        return node;
    }
}

// get code with inline-source-map from file SourceNode
function getCodeFromNode(node, renameSources, options) {
    const code_map = getCodeMap(node);
    const rename = renameSources;
    const objMap = code_map.map.toJSON();
    let i, n;

    if (rename) {
        if ('string' === typeof rename) {
            for (i = 0, n = objMap.sources.length; i < n; i++) {
                objMap.sources[i] = rename + objMap.sources[i];
            }
        } else if ('function' === typeof rename) {
            for (i = 0, n = objMap.sources.length; i < n; i++) {
                objMap.sources[i] = rename(objMap.sources[i]);
            }
        } else {
            console.warn('unexpected type of rename: ' + typeof rename);
        }
    }

    return node.toString().replace(/\r\n/gm, '\n') +
        convert.fromObject(objMap)
            .toComment(options)
            .replace(/charset=utf-8;/gm, '')
            .replace('data:application/json;', 'data:application/json;charset=utf-8;');
}

// separate source script and map from file
function separateScriptAndMapFromScriptFile(scriptFile, multiline, mapPath) {
    const node = getNodeFromScriptFile(scriptFile);
    mapPath = mapPath || path.basename(scriptFile) + '.map';
    return {
        script: node.toString().replace(/\r\n/gm, '\n') + (
            multiline
            ? ('/*# sourceMappingURL=' + mapPath + ' */')
            : ('//# sourceMappingURL=' + mapPath)
           ),
        map: JSON.stringify(getCodeMap(node).map.toJSON()),
    };
}

///////////////////////////////////////////////////////////////////////
// private methods:

// // get sourceMap object from inline-source-map file
function getMapFromScriptFile(scriptFile) {
    const code = fs.readFileSync(scriptFile).toString();
    return convert.fromComment(code).toObject();
}

function getMapFromMapFile(mapFile) {
    const json = fs.readFileSync(mapFile).toString();
    return JSON.parse(json);
}

// get code from file
function getScriptFromFile(scriptFile) {
    const code = fs.readFileSync(scriptFile).toString();
    return convertCode2Script(code);
}

// convert to script (non including source-map)
function convertCode2Script(code) {
    // clean source code comment
    return code
        .replace(/\/\/\/ <reference path="[\s\S]*?>/gm, '')
        .replace(convert.mapFileCommentRegex, '');
}

// get code map with path from node
function getCodeMap(node) {
    const code_map = node.toStringWithSourceMap();

    // patch
    node.walkSourceContents(function (sourceFile, sourceContent) {
        if (!code_map.map._sources.has(sourceFile)) {
            code_map.map._sources.add(sourceFile);
        }
    });

    return code_map;
}

module.exports = {
    getNodeFromScriptFile: getNodeFromScriptFile,
    getNodeFromFiles: getNodeFromFiles,
    getNodeFromCode: getNodeFromCode,
    getCodeFromNode: getCodeFromNode,
    separateScriptAndMapFromScriptFile: separateScriptAndMapFromScriptFile,
};
