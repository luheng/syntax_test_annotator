
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
	update : function() {
		var self = this;
		self.clear();
		
		if (main_task === "question") {
			for (var i = 1; i <= max_num_qs; i++) {
				$("#q" + i).prop('disabled', false);
				$("#a" + i).prop('disabled', true);
			}
		} else {
			for (var i = 1; i <= max_num_qs; i++) {
				$("#q" + i).prop('disabled', true);
				$("#a" + i).prop('disabled', false);
			}
		}
		
		var phrase = main_sents[self.sent_id].phrases[self.phrase_id];
		var tokens = main_sents[self.sent_id].tokens;
		var lid = phrase.left;
		var rid = phrase.right;
		var tdata = main_task === "question" ?
					[tokens.slice(0, lid).join(" "), 
		             tokens.slice(lid, rid).join(" "),
		             tokens.slice(rid, tokens.length).join(" ")] :
		            [tokens.join(" "), ];
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
			.style("font-size", "14px")
			.style("fill-opacity", 1e-6);
		
		self.svg.selectAll("text").each(
				function() {
					console.log(this.getComputedTextLength());
					sizes.push(this.getComputedTextLength());
				});
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
			.attr("y", 20)
			.style("font-size", "14px")
			.style("fill", function(d, i) {
				return i == 1 ? "red" : "black";
			})
			.style("fill-opacity", 1);
	},
	getAnnotation : function() {
		console.log("get", this.sent_id, this.phrase_id);
		var phrase = main_sents[this.sent_id].phrases[this.phrase_id];
		phrase.questions = [];
		for (var i = 1; i <= max_num_qs; i++) {
			var qid = "#q" + i;
			phrase.questions.push($(qid).val());
		}
	},
	setAnnotation : function() {
		var qs = main_sents[this.sent_id].phrases[this.phrase_id].questions;
		console.log(this.sent_id, this.phrase_id, qs);
		for (var i = 1; i <= max_num_qs; i++) {
			var qid = "#q" + i;
			var q = i <= qs.length ? qs[i - 1] : "";
			$(qid).val(q);
		}
	},
	jump : function(new_sent_id, new_phrase_id) {
		this.getAnnotation();
		this.sent_id = new_sent_id;
		this.phrase_id = new_phrase_id;
		this.update();
		this.setAnnotation();
		my_browser.update();
		$("#q1").focus();
	},
	getPrev : function() {
		if (//this.sent_id == 0 && 
			this.phrase_id == 0) {
			return;
		}
		this.getAnnotation();
		this.phrase_id --;
		if (this.phrase_id < 0) {
			this.sent_id --;
			this.phrase_id = main_sents[this.sent_id].phrases.length - 1;
		}
		this.update();
		this.setAnnotation();
		my_browser.update();
		$("#q1").focus();
	},
	getNext : function() {
		if (//this.sent_id == main_sents.length - 1 &&
			this.phrase_id == main_sents[this.sent_id].phrases.length - 1) {
			return;
		}
		this.getAnnotation();
		this.phrase_id ++;
		if (this.phrase_id == main_sents[this.sent_id].phrases.length) {
			this.sent_id ++;
			this.phrase_id = 0;
		}
		this.update();
		this.setAnnotation();
		my_browser.update();
		$("#q1").focus();
	},
	getPrevSent : function() {
		if (this.sent_id == 0) {
			return;
		}
		this.getAnnotation();	
		this.sent_id --;
		this.phrase_id = 0;
		this.update();
		this.setAnnotation();
		my_browser.update();
		$("#q1").focus();
	},
	getNextSent : function() {
		if (this.sent_id == main_sents.length - 1) {
			return;
		}
		this.getAnnotation();
		this.sent_id ++;
		this.phrase_id = 0;
		this.update();
		this.setAnnotation();
		my_browser.update();
		$("#q1").focus();
	}
};