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
		
		var selection = select(subClass, function() { return true; });

		assertEquals(expectedCount, selection.length());
	})
}));
