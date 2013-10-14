TestCase("testSignalslot", sinon.testCase({
	setUp: function() 
	{	
	},

	tearDown: function()
	{
	},

	// Scarlet.Signal .
	"testSignalAPI": function()
	{
		var firstSignal = new Scarlet.Signal();
		var secondSignal = new Scarlet.Signal();
		
		var foo = 1;
		var firstSlot = new Scarlet.Slot({}, function() { foo *= 2; });
		var secondSlot = new Scarlet.Slot({}, function() { foo *= 3; });

		var spySlot1 = this.spy(firstSlot, "execute");
		var spySlot2 = this.spy(secondSlot, "execute");
		
		var emitArgument = "blub";
		firstSignal
			.connect(firstSlot);
		secondSignal
			.connect(firstSlot)
			.connect(secondSlot)
			.emit(emitArgument);
		sinon.assert.calledOnce(spySlot1);
		sinon.assert.calledOnce(spySlot2);
		sinon.assert.callOrder(spySlot1, spySlot2);
		sinon.assert.calledWith(spySlot1, emitArgument);
		sinon.assert.calledWith(spySlot2, emitArgument);
		assertEquals(2 * 3, foo);
		//assert(spySlot1.calledBefore(spySlot2), "slots were not called in the order they were connected.");
	}
	
}));