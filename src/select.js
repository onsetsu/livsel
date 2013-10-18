mini.Module(
	"src/select"
)
.requires(
	"src/class"
)
.defines(function() {
	(function(window, undefined) {
		
		var LivingSelection = Class.subclass({
			initialize: function(type, query) {
				this.type = type;
				this.query = query;
				this._arr = [];
				
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
			// TODO: map, filter, reduce, pluck
			// TODO: enter, exit (data join)
		}, {
			
		});
		
		window.select = function(type, query) {
			return new LivingSelection(type, query);
		};
		
	})(window);
});
