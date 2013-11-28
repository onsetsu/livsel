mini.Module(
	"src/class"
)
.requires(
	"src/signalslot"
)
.defines(function() {

	(function(window, undefined) {
		
		var subClassing = false;
		
		var inheritsFrom = function(superClass)
		{
			// Manage new object and call initialize.
			var childClass = function(/* arguments */) {
				if(!subClassing) {
					// Initialize function is to be called, when a new object is created.
					this.initialize.apply(this, arguments);
					this.Class.addInstance(this);
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
			
			// TODO: add final attribute instead of using addMethod.
			//childClass.addMethod("class", childClass);
			//childClass.class = childClass;
			childClass.addMethod("Class", childClass);
			childClass.Class = childClass;
			
			// Add signals for listening to object creation and destruction.
			childClass.addClassMethod("instanceCreated", new Signal());
			childClass.addClassMethod("instanceModified", new Signal());
			childClass.addClassMethod("instanceDeleted", new Signal());
			
			// Introduce list of instances.
			childClass.instances = [];
			
			return childClass;
		};
		
		var createClass = function(superClass, methods, staticMethods) {
			methods = methods || {};
			staticMethods = staticMethods || {};
			
			// Actually create the new class.
			var newClass = inheritsFrom(superClass);

			// Attach all given methods to the class prototype.
			for(var methodName in methods) {
				newClass.addMethod(methodName, methods[methodName]);
			};
			
			// Attach static methods to the class (object) itself.
			for(var staticMethodName in staticMethods) {
				newClass.addClassMethod(staticMethodName, staticMethods[staticMethodName]);
			};
			
			return newClass;
		};
		
		/**
		 * Hidden class ProtoObject provides basic functionality for all objects in the library.
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
			.addClassMethod("getInstances", function() {
				return this.instances;
			})
			.addClassMethod("addInstance", function(instance) {
				if(this !== Class)
				{
					this.superClass.addInstance(instance);
				}
				this.instances.push(instance);
				this.instanceCreated.emit(instance);
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
					this.instanceDeleted.emit(instance);
				}
				else
				{
					// TODO: error if no match
				}
			})
			.addMethod("destroy", function() {
				this.Class.removeInstance(this);
			});

	})(window);
	
});
