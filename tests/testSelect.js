TestCase("testSelect", sinon.testCase({
	setUp: function() 
	{		
	},
	
	tearDown: function()
	{
	},

	// Select method should be defined.
	testLivSel: sinon.test(function() {
		assertNotUndefined(select);
	}),

	// Select should return the correct number of objects.
	testSelectAmount: sinon.test(function() {
		var subClass = Class.subclass();
		var expectedCount = 4;
		for(var i = 0; i < expectedCount; i++) {
			new subClass();
		}
		
		var selection = select(subClass);

		assertEquals(expectedCount, selection.length());
	}),

	// Select should return the correct number of objects.
	testChangeAmountByCreationAndDestruction: sinon.test(function() {
		var subClass = Class.subclass();
		var subSubClass = subClass.subclass();
		var selection = select(subClass);

		var instances = [];
		var expectedCount = 4;
		for(var i = 0; i < expectedCount; i++) {
			instances.push(new subSubClass());
		}
		assertEquals(expectedCount, selection.length());
		
		// Delete 2 instances.
		instances[1].destroy();
		instances[2].destroy();
		assertEquals(expectedCount - 2, selection.length());
	}),

	// Select should return only objects matching given query.
	testMatchGivenQuery: sinon.test(function() {
		var subClass = Class.subclass({
			initialize: function(param) {
				this.param = param;
			}
		});
		var query = function(subObject) {
			return subObject.param >= 2;
		};
		
		var selection = select(subClass, query);

		var instances = [];
		var numberInstances = 4;
		for(var i = 0; i < numberInstances; i++) {
			instances.push(new subClass(i));
		}
		var expectedCount = 0;
		for(var i = 0; i < numberInstances; i++) {
			if(query(instances[i])) expectedCount++;
		}

		assertEquals(expectedCount, selection.length());
	}),

	// Select operation should be accessible as static method of Class for convenience.
	testConvenientSelect: sinon.test(function() {
		var subClass = Class.subclass();
		
		var query = function(subObject) {
			return subObject.param >= 2;
		};
		
		var expectedNumberOfInstances = 4;
		for(var i = 0; i < expectedNumberOfInstances; i++) {
			new subClass();
		}

		var selection = subClass.select();

		assertEquals(expectedNumberOfInstances, selection.length());
	})
}));
