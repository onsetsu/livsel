mini.Module(
	"src/signalslot"
)
.requires(

)
.defines(function() {
	// ------
	// Signal
	// ------
	Signal = function()
	{
		var slots = [];
		
		// Call all connected slots with given arguments.
		this.emit = function()
		{
			// save slot, if they would be disconnected during execution
			var tempSlots = [];
			for (var index in slots)
			{
				tempSlots.push(slots[index]);
			}
			
			for(var index in tempSlots) {
				try {
					tempSlots[index].execute.apply(tempSlots[index], arguments);
				} catch (e) {}
			}
			return this;
		};

		// Connect given slots if they are not already connected.
		this.connect = function()
		{
			for (slotIndex in arguments)
			{
				var slot = arguments[slotIndex];
				if (slots.indexOf(slot) === -1)
				{
					slots.push(slot);
				}
			}
			return this;
		};

		// Disconnect given slots if they are connected.
		this.disconnect = function()
		{
			for (slotIndex in arguments)
			{
				var slot = arguments[slotIndex];
				var index = slots.indexOf(slot);
				if(index !== -1)
				{
					slots.splice(index, 1);
				}
			}
			return this;
		};

		// Disconnect all connected slots.
		this.disconnectAll = function()
		{
			slots = [];
			return this;
		};
	};

	// ----
	// Slot
	// ----
	Slot = function(slotContext, slotMethod)
	{
		this.execute = function()
		{
			slotMethod.apply(slotContext, arguments);
		};
	};
});
