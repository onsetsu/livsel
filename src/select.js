mini.Module(
	"src/select"
)
.requires(
	"src/class",
	"src/signalslot"
)
.defines(function() {
	(function(window, undefined) {
		
		var LivingSelection = Class.subclass({
			initialize: function(type, query) {
				this.type = type;
				this.query = query || function() { return true; };
				this._arr = [];
				
				// Hook into instance creation and deletion.
				var updateSelection = new Slot(this, this.update);
				type.instanceCreated.connect(updateSelection);
				type.instanceModified.connect(updateSelection);
				type.instanceDeleted.connect(updateSelection);

				this.update();
			},
			update: function() {
				var objects = this.type.getInstances();
				
				this._arr.length = 0;
				for(var i = 0; i < objects.length; i++) {
					if(this.query(objects[i]))
						this._arr.push(objects[i]);
				};
			},
			length: function() { return this._arr.length; }
			/*
			 * TODO: continuous methods
			 * map, filter, reduce, pluck, group
			 * 
			 * accessing functions
			 * contains, each
			 * 
			 * TODO: data/object join
			 * enter, exit
			 */
			// 
			// 
		}, {
			
		});
		
		window.select = function(type, query) {
			return new LivingSelection(type, query);
		};
		
		// Add convenient method to call select directly on a Class.
		window.Class.addClassMethod("select", function(query) {
			return window.select(this, query);
		});
		
	})(window);
});
