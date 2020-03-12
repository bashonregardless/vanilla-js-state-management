export default {
  clone: function() {
	return Object.create(this);
  },
  create: function(opt) {
	var derived = this.clone();
	derived.init(opt);
	return derived;
  },
  init: function(opt) {
	Object.getOwnPropertyNames(opt).forEach(function(p) {
	  Object.defineProperty(this, p, Object.getOwnPropertyDescriptor(opt, p));
	}, this);
  }
};

//var Pasher = Proto.create({ // "subclass" Proto
//  init: function(opt) {
//	if ("name" in opt) this._name = opt.name;
//  },
//  _name: "",
//  get name() { return this._name; }
//});
