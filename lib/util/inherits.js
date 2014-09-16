
/**
 * 构建类之间的继承关系
 *
 * @param {Function} subClass 子类函数
 * @param {Function} superClass 父类函数
 */
function inherits(subClass, superClass) {
    var F = new Function();
    F.prototype = superClass.prototype;

    var subProto = subClass.prototype;
    subClass.prototype = new F();
    require('./extend')(subClass.prototype, subProto);

    subClass.prototype.constructor = subClass;
}

module.exports = exports = inherits;
