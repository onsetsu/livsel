mini.Module(
	"src/class"
)
.requires(
	"src/signalslot"
)
.defines(function() {

	(function(window, undefined) {
		
		var subClassing = false;
		
		var inheritsFrom = function(childInitialize, superClass)
		{
			// Manage new object and call initialize.
			var childClass = function(/* arguments */) {
				if(!subClassing) {
					this.class.addInstance(this);
					this.initialize.apply(this, arguments);
					this.class.instanceCreated.emit(this);
				};
			};
			
			subClassing = true;
			var chain = new Function();
			subClassing = false;
			chain.prototype = superClass.prototype;
			childClass.prototype = new chain();
			// enable static method inheritance
			childClass.__proto__ = superClass;
			// Add readable static superclass reference.
			childClass.superClass = superClass;
			childClass.prototype.constructor = chain;
			// TODO: find other name for parent reference
			childClass.prototype.parent = superClass.prototype;
			
			// Use default implementation if no initialize was given.
			childInitialize = childInitialize || function(/* arguments */) { this.parent(arguments); };
			// Initialize function is to be called, when a new object is created.
			childClass.addMethod("initialize", childInitialize);
			
			// TODO: add final attribute instead of using addMethod.
			childClass.addMethod("class", childClass);
			
			childClass.addClassMethod("instanceCreated", new Signal());
			// Introduce list of instances.
			childClass.instances = [];
			
			return childClass;
		};
		
		var createClass = function(superClass, methods, staticMethods) {
			methods = methods || {};
			staticMethods = staticMethods || {};
			var childConstructor = methods.initialize || function(/* arguments */) { this.parent(arguments); };
			
			var newClass = inheritsFrom(childConstructor, superClass);
			
			for(var methodName in methods) {
				if(methodName !== "initialize")
					newClass.addMethod(methodName, methods[methodName]);
			};
			
			for(var staticMethodName in staticMethods) {
				newClass.addClassMethod(staticMethodName, staticMethods[staticMethodName]);
			};
			
			return newClass;
		};
		
		/**
		 * Hidden class provides basic functionality for all objects in the library.
		 * 
		 */
		var ProtoObject = function protoConstructor() {};

		ProtoObject.addClassMethod = function(methodName, method) {
			this[methodName] = method;
			return this;
		};
		
		ProtoObject
			.addClassMethod("subclass", function(methods, staticMethods) {
				return createClass(this, methods, staticMethods);
			})
			.addClassMethod("addMethod", function(methodName, method) {
				var superCallName = "parent";
				var fnTest = /xyz/.test(function(){xyz;}) ? new RegExp(/\bparent\b/) : /.*/;
				
				var parent = {};
				parent[methodName] = this.prototype[methodName]; // save original function
				
				if( 
					typeof method === "function" &&
					typeof(parent[methodName]) == "function" && 
					fnTest.test(method)
				) {
					this.prototype[methodName] = (function(name, fn){
						return function() {
							var tmp = this[superCallName];
							this[superCallName] = parent[name];
							var ret = fn.apply(this, arguments);			 
							this[superCallName] = tmp;
							return ret;
						};
					})(methodName, method);
				} else {
					this.prototype[methodName] = method;
				}
				return this;
			});
		
		ProtoObject.prototype.class = ProtoObject;

		
		Class = ProtoObject
			.subclass({
				initialize: function constructor() {
					this.__cache = {};
				}
			})
			.addMethod("set", function(name, value) {
				this.__cache[name] = value;
				return this;
			})
			.addMethod("get", function(name) {
				return this.__cache[name];
			});
		
		Class
			.addClassMethod("addInstance", function(instance) {
				if(this !== Class)
				{
					this.superClass.addInstance(instance);
				}
				this.instances.push(instance);
			})
			.addClassMethod("removeInstance", function(instance) {
				if(this !== Class)
				{
					this.superClass.removeInstance(instance);
				}
				var index = this.instances.indexOf(instance);
				if(index !== -1)
				{
					this.instances.splice(index, 1);
				}
				else
				{
					// TODO: error if no match
				}
			})
			.addMethod("destroy", function() {
				this.class.removeInstance(this);
			});

	})(window);
	
});
