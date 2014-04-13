
function progress(margin, width, height, tag) {
	this.margin = margin;
    this.width = width - margin.left - margin.right;
    this.height = height - margin.top - margin.bottom;
    this.tag = tag;
    this.svg = d3.select(tag)
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    this.bar_width = this.width * 0.8;
    this.bar_height = 20;
}

progress.prototype = {
	update : function() {
		var self = this;
		sent_id = my_annotator.sent_id;
		phrase_id = my_annotator.phrase_id;
		num_sents = main_sents.length;
		num_phrases = main_sents[sent_id].phrases.length;
		
		self.svg.selectAll("rect").remove();
		self.svg.selectAll("text").remove();
		
		var sent_prog = d3.scale.linear()
			.domain([0, num_sents])
			.range([0, this.bar_width]);
		
		var phrase_prog = d3.scale.linear()
			.domain([0, num_phrases])
			.range([0, this.bar_width]);
		
		self.svg
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", self.bar_width)
			.attr("height", self.bar_height)
			.attr("fill", "steelblue")
			.attr("opacity", "0.3");
		
		self.svg
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", sent_prog(sent_id + 1))
			.attr("height", self.bar_height)
			.attr("fill", "steelblue")
			.attr("opacity", "0.6");
		
		self.svg
			.append("rect")
			.attr("x", 0)
			.attr("y", self.bar_height + 2)
			.attr("width", self.bar_width)
			.attr("height", self.bar_height)
			.attr("fill", "steelblue")
			.attr("opacity", "0.3");
		
		self.svg
			.append("rect")
			.attr("x", 0)
			.attr("y", self.bar_height + 2)
			.attr("width", phrase_prog(phrase_id + 1))
			.attr("height", self.bar_height)
			.attr("fill", "steelblue")
			.attr("opacity", "0.6");
		
		self.svg
			.append("text")
			.text(self.sentProgText(sent_id, num_sents))
			.attr("x", 10)
			.attr("y", 14)
			.attr("text-anchor", "left")
			.style("font-size", "14px")
			.style("font-weight", "normal");
		
		self.svg
			.append("text")
			.text(self.phraseProgText(phrase_id, num_phrases))
			.attr("x", 10)
			.attr("y", self.bar_height + 16)
			.attr("text-anchor", "left")
			.style("font-size", "14px")
			.style("font-weight", "normal");
	},
	sentProgText : function (sent_id, num_sents) {
		return (sent_id + 1) + "/" + num_sents + " sentences";
	},
	phraseProgText : function (phrase_id, num_phrases) {
		if (main_task === "question") {
			return (phrase_id + 1) + "/" + num_phrases + " phrases";
		}
		return (phrase_id + 1) + "/" + num_phrases + " questions";
	}
};

