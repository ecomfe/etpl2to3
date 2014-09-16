
var Command = require('./Command');

/**
 * Import命令节点类
 *
 * @constructor
 * @param {string} value 命令节点的value
 */
function ImportCommand( value ) {
    if ( !/^\s*([a-z0-9_-]+)\s*$/i.test( value ) ) {
        throw new Error( 'Invalid ' + this.type + ' syntax: ' + value );
    }

    this.name = RegExp.$1;
    Command.call( this, value );
}


require('../util/inherits')(ImportCommand, Command);
Command.Types['import'] = ImportCommand;

