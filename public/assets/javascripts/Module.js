Module.prototype = Object.create(Object.prototype);
Module.prototype.constructor = Module;

function Module(){

    this.exports = {};

}

Module.prototype.require = function(asset,path){

    let module = new Module();
    let r = new XMLHttpRequest();

    r.open('get',`${asset}${path}.js`,false);
    r.onloadend = () => module.wrap(r.responseText)(module,module.require,asset);
    r.send();

    return module.exports;

};

Module.prototype.wrap = function(code){

    return new Function(`return function(module,require,asset){${code}}`)();

};