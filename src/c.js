'use strict';

function Person(){}

Person.prototype.setName = function(name){
    this.name = name;
};

Person.prototype.getName = function(){
    return this.name;
}

