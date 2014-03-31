
function annotator(margin, width, height, tag) {
	this.margin = margin;
    this.width = width;
    this.height = height;
    this.svg = d3.select(tag)
		.append("svg")
		.attr("width", this.width + margin.left + margin.right)
		.attr("height", this.height + margin.top + margin.bottom )
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    this.init();
}

annotator.prototype = {
	init : function() {
		this.sent_id = 0;
		this.phrase_id = 0;
	},
	update : function() {
		var self = this;
		var phrase = main_sents[self.sent_id].phrases[self.phrase_id];
		var tokens = main_sents[self.sent_id].tokens;
		var lid = phrase.left;
		var rid = phrase.right;
		var tdata = [tokens.slice(0, lid).join(" "), 
		             tokens.slice(lid, rid).join(" "),
		             tokens.slice(rid, tokens.length).join(" ")];
		var sizes = [];
		
		self.svg
			.selectAll("g.text").remove();
		
		self.svg
			.selectAll("g.text")
			.data(tdata)
			.enter()
			.append("text")
			.text(function(d) {
				return d;
			})
			.attr("text-anchor", "left")
			.style("font-size", "28px")
			.style("fill-opacity", 1e-6);
		
		self.svg.selectAll("text").each(
				function() {
					console.log(this.getComputedTextLength());
					sizes.push(this.getComputedTextLength());
				});
		
		self.svg.selectAll("text").remove();
		
		self.svg
			.selectAll("g.text")
			.data(tdata)
			.enter()
			.append("text")
			.text(function(d) {
				return d;
			})
			.attr("text-anchor", "left")
			.attr("x", function(d, i) {
				return i == 0 ? 0 : 
					(i == 1 ? sizes[0] + 10 : sizes[0] + sizes[1] + 20);
			})
			.attr("y", 50)
			.style("font-size", "28px")
			.style("fill", function(d, i) {
				return i == 1 ? "red" : "black";
			})
			.style("fill-opacity", 1);
		
	}
};