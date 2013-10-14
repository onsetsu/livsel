TestCase("testClass", sinon.testCase({
	setUp: function() 
	{
		this.subObject = Scarlet.Object.subclass(function() {});
		this.subSubObject = this.subObject.subclass(function() {});
		this.subSubSubObject = this.subSubObject.subclass(function() {});
	},
	
	tearDown: function()
	{
	},
		
	// define new simple namespaces
	"testSupportSubclassing": function()
	{
		var Subclass = Scarlet.Object.subclass(function(aNumber) {
			this.aNumber = aNumber;
		});
		Subclass.addMethod("add", function(a){
			return this.aNumber + a;
		});
		
		var expectedNumber = 42;
		var subObject = new Subclass(expectedNumber);

		assertEquals(subObject.aNumber, expectedNumber);
		assertEquals(42 + 17, subObject.add(17));
	},
	
	// The definition of a class should be chainable.
	"testChainableClassDefinition": function()
	{
		var Subclass = Scarlet.Object
			.subclass(function(aNumber) {
				this.aNumber = aNumber;
			})
			.addMethod("add", function(a){
				return this.aNumber + a;
			})
			.addMethod("sub", function(a){
				return this.aNumber - a;
			});
		
		var expectedNumber = 42;
		var addedNumber = 17;
		var subObject = new Subclass(expectedNumber);

		assertEquals(subObject.aNumber, expectedNumber);
		assertEquals(expectedNumber + addedNumber, subObject.add(addedNumber));
		assertEquals(expectedNumber - addedNumber, subObject.sub(addedNumber));
		
		// Scarlet.Object should not be affected.
		var obj = new Scarlet.Object();
		assertUndefined(obj.sub);
	},
	
	// The instances of subclass should call the super class' constructor before its own.
	"testChainableConstructors": function()
	{
		var spy = sinon.spy();
		var subSpy = sinon.spy();
		var subSubSpy = sinon.spy();

		var Sub = Scarlet.Object.subclass(function() {
			this.parent();
			spy();
		});
		var SubSub = Sub.subclass(function() {
			this.parent();
			subSpy();
		});
		var SubSubSub = SubSub.subclass(function() {
			this.parent();
			subSubSpy();
		});

		new SubSubSub();
		sinon.assert.calledOnce(spy);
		sinon.assert.calledOnce(subSpy);
		sinon.assert.calledOnce(subSubSpy);
		sinon.assert.callOrder(spy, subSpy, subSubSpy);
	},
	
	// The instances of subclass should call the super class' constructor before its own.
	"testGetSet": function()
	{
		var obj = new (Scarlet.Object
			.subclass(function(){ this.parent(); })
			.subclass(function(){ this.parent(); })
		)();
		obj.set("foo", 42);
		assertEquals(42, obj.get("foo"));
	},
	
	// In child object methods you can call the parents method.
	"testCallParentMethod": function()
	{
		var addedValue = 17;
		var actualValue = 42;
		
		var spy = sinon.spy();
		var subSubClass = Scarlet.Object.subclass(function() {
			this.parent(arguments);
		}).subclass(function(){
			this.parent(arguments);
		}).addMethod("set", function(name, value) {
			this.parent(name, value + addedValue);
		});
		
		var subSubObject = new subSubClass();
		subSubObject.set("actualValue", actualValue);
		assertEquals(actualValue + addedValue, subSubObject.get("actualValue"));
	},
	
	// In each object a reference to the corresponding class should be given.
	"testSupportClassAttribute": function()
	{
		var obj = new Scarlet.Object();
		assertSame(Scarlet.Object, obj.class);

		var subObj = new this.subObject();
		assertSame(this.subObject, subObj.class);

		var subSubObj = new this.subSubObject();
		assertSame(this.subSubObject, subSubObj.class);
	},
	
	// Static methods should be available using the class atrribute.
	"testClassesShouldSupportStaticMethods": function()
	{
		this.subObject.addClassMethod("double", function(a) {
			return 2*a;
		});
		
		var subObj = new this.subObject();
		assertEquals(4, subObj.class.double(2));

		var subSubObj = new this.subSubObject();
		assertEquals(this.subSubObject, subSubObj.class);
		assertEquals(6, subSubObj.class.double(3));
	},
	
	// Scarlet.Object should use initialize as constructor method.
	"testScarletObjectShouldUseInitializeAsConstructorMehtod": function()
	{
		assertNotUndefined(new Scarlet.Object().initialize);
		assertNotUndefined(new this.subObject().initialize);
	},
	
	// Scarlet.Object should use initialize as constructor method.
	"testMultipleChainableInititializes": function()
	{
		var subClass = Scarlet.Object
			.subclass(function() { this.parent(); this.a = 1; })
			// this b should be overwritten
			.subclass(function() { this.parent(); this.b = 2; })
			.subclass(function() { this.parent(); this.b = 3; })
			;
		
		var subObject = new subClass();
		assertEquals(1, subObject.a);
		assertEquals(3, subObject.b);
	},
	
	// If no initialize is given, a standard implementation should be chosen to call the parent initialize.
	"testNoInitializeGiven": function()
	{
		var subClass = Scarlet.Object
			.subclass(function() { this.parent(); this.a = 1; })
			// this b should be overwritten
			.subclass()
			;
		
		var subObject = new subClass();
		assertEquals(1, subObject.a);
	},
	
	// After initialize of a newly created Object was called, a signal for the instance creation should be fired.
	// Signal should emit the created object.
	"testInstanceCreatedSignal": function()
	{
		var initializeSpy = sinon.spy();
		var slotSpy = sinon.spy();

		var subClass = Scarlet.Object.subclass(function() { this.parent(); initializeSpy.apply({}, arguments); });
		var slot = new Scarlet.Slot({}, slotSpy);
		subClass.instanceCreated.connect(slot);
		
		var expectedArg1 = "hello";
		var expectedArg2 = "test";
		
		var actualObject = new subClass(expectedArg1, expectedArg2);

		sinon.assert.calledOnce(initializeSpy);
		sinon.assert.calledOnce(slotSpy);
		sinon.assert.callOrder(initializeSpy, slotSpy);
		sinon.assert.calledWith(initializeSpy, expectedArg1, expectedArg2);
		sinon.assert.calledWith(slotSpy, actualObject);
	}
	
}));
