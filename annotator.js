
function annotator(margin, width, height, tag) {
	this.margin = margin;
	this.width = width - margin.left - margin.right;
    this.height = height - margin.top - margin.bottom;
    this.svg = d3.select(tag)
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    this.init();
}

annotator.prototype = {
	init : function() {
		this.sent_id = 0;
		this.phrase_id = 0;
	},
	clear : function() {
		this.svg.selectAll("text").remove();
	},
	update : function(sid, pid) {
		var self = this;
		self.clear();
		
		self.sent_id = sid;
		self.phrase_id = pid;
		var phrase = main_sents[self.sent_id].phrases[self.phrase_id];
		var tokens = main_sents[self.sent_id].tokens;
		var lid = phrase.left;
		var rid = phrase.right;
		var tdata = [tokens.slice(0, lid).join(" "), 
		             tokens.slice(lid, rid).join(" "),
		             tokens.slice(rid, tokens.length).join(" ")];
		var sizes = [];
		
		self.svg
			.selectAll("text")
			.data(tdata)
			.enter()
			.append("text")
			.text(function(d) {
				return d;
			})
			.attr("text-anchor", "left")
			.style("font-size", "20px")
			.style("fill-opacity", 1e-6);
		
		self.svg.selectAll("text").each(
				function() {
					console.log(this.getComputedTextLength());
					sizes.push(this.getComputedTextLength());
				});
		
		//clear();
		self.svg.selectAll("text").remove();
		
		self.svg
			.selectAll("text")
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
			.style("font-size", "20px")
			.style("fill", function(d, i) {
				return i == 1 ? "red" : "black";
			})
			.style("fill-opacity", 1);
	},
	updateAnnotation : function() {
		
	},
	getPrev : function() {
		console.log("to prev");
		if (this.sent_id == 0 && this.phrase_id == 0) {
			return;
		}
		this.phrase_id --;
		if (this.phrase_id < 0) {
			this.sent_id --;
			this.phrase_id = main_sents[this.sent_id].phrases.length - 1;
		}
		this.update(this.sent_id, this.phrase_id);
		my_browser.update();
	},
	getNext : function() {
		console.log("to next");
		if (this.sent_id == main_sents.length - 1 &&
			this.phrase_id == main_sents[this.sent_id].phrases.length - 1) {
			return;
		}
		this.phrase_id ++;
		if (this.phrase_id == main_sents[this.sent_id].phrases.length) {
			this.sent_id ++;
			this.phrase_id = 0;
		}
		this.update(this.sent_id, this.phrase_id);
		my_browser.update();
	}
};