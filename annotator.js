
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
		
		// reset input status
		if (main_task === "question") {
			for (var i = 1; i <= max_num_qs; i++) {
				$("#q" + i).prop('disabled', false);
				$("#a" + i).prop('disabled', true);
				$('#next_button').prop('disabled', (this.phrase_id ==
					main_sents[this.sent_id].phrases.length - 1));
			}
		} else {
			for (var i = 1; i <= max_num_qs; i++) {
				$("#q" + i).prop('disabled', true);
				$("#a" + i).prop('disabled', false);
				$('#next_button').prop('disabled', (this.phrase_id ==
					main_qlist[this.sent_id].length - 1));
			}
		}
		// reset button status
		$('#prev_button').prop('disabled', (this.phrase_id == 0));
		$('#ps_button').prop('disabled', (this.sent_id == 0));
		$('#ns_button').prop('disabled', (this.sent_id == main_sents.length - 1));
		
		var pid = main_task === "question" ? this.phrase_id :
					main_qlist[this.sent_id][this.phrase_id];
		var phrase = main_sents[self.sent_id].phrases[pid];
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
		
		my_progress.update();
	},
	getAnnotation : function() {
		var pid = main_task === "question" ? this.phrase_id :
			main_qlist[this.sent_id][this.phrase_id];
		var phrase = main_sents[this.sent_id].phrases[pid];
		if (main_task === "question") {
			phrase.questions = [];
			for (var i = 1; i <= max_num_qs; i++) {
				phrase.questions.push($("#q" + i).val());
			}
		} else {
			phrase.answers = [];
			for (var i = 1; i <= max_num_qs; i++) {
				phrase.answers.push($("#a" + i).val());
			}
		}
	},
	setAnnotation : function() {
		var pid = main_task === "question" ? this.phrase_id :
			main_qlist[this.sent_id][this.phrase_id];
		var phrase = main_sents[this.sent_id].phrases[pid];
		for (var i = 1; i <= max_num_qs; i++) {
			$("#q" + i).val(i <= phrase.questions.length ? phrase.questions[i - 1] : "");
			$("#a" + i).val(i <= phrase.answers.length ? phrase.answers[i - 1] : "");
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
		/*if (this.phrase_id == 0) {
			return;
		}*/
		this.getAnnotation();
		this.phrase_id --;
		this.update();
		this.setAnnotation();
		my_browser.update();
		my_progress.update();
		$("#q1").focus();
	},
	getNext : function() {
		/*if (this.phrase_id == main_sents[this.sent_id].phrases.length - 1) {
			return;
		}*/
		this.getAnnotation();
		this.phrase_id ++;
		this.update();
		this.setAnnotation();
		my_browser.update();
		my_progress.update();
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
		my_progress.update();
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
		my_progress.update();
		$("#q1").focus();
	}
};