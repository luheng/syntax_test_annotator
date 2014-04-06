
var main_sents = [
    {
    	tokens: ["This", "is", "a", "test", "for", "constituents", "."], 
    	phrases : [
    	    { left: 1, right: 6, labels: ["VP"], in_gold : 1, in_pred : 1},
    	    { left: 2, right: 4, labels: ["NP"], in_gold : 1, in_pred : 1},
    	    { left: 2, right: 6, labels: ["NP"], in_gold : 1, in_pred : 1},
    	    { left: 4, right: 6, labels: ["PP"], in_gold : 1, in_pred : 1},
    	]
    }, 
];

var max_num_qs = 1;
var main_task = "question";

my_annotator = new annotator(
		{ top:10, right:10, bottom:10, left:10}, 
		1200, 50, "#annotator");

my_browser = new sent_browser({ top:10, right:10, bottom:10, left:10}, 
		300, 600, "#browser");

$("input, select").keydown(function(e) {
    if (e.keyCode == 40 || e.keyCode == 13) {
        $(this).next('input, select').focus();
    } else if (e.keyCode == 38) {
    	$(this).prev('input, select').focus();
    }
});


d3.json("./data/pred_email00_ptb0221_50kbest.json", function(data) {
	main_sents = data;
	main_sents.forEach(function(d) {
		d.phrases.forEach(function(d2) {
			if (!d2.questions) {
				d2.questions = [];
			}
		});
	});
	my_annotator.init();
	my_annotator.update();
	my_annotator.setAnnotation();
	my_browser.init();
	my_browser.update();
});

/*
stackoverflow example of downloading data 

var obj = {a: 123, b: "4 5 6"};
var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

$('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo('#container');

*/

function load_from() {
	var filename = $("#filepath_input").val();
	main_task = $('input[name="task"]:checked').val();
	d3.json("./data/" + filename, function(data) {
		main_sents = data;
		main_sents.forEach(function(d) {
			d.phrases.forEach(function(d2) {
				if (!d2.questions) {
					d2.questions = [];
				}
			});
		});
		my_annotator.init();
		my_annotator.update();
		my_annotator.setAnnotation();
		my_browser.init();
		my_browser.update();
	});
}

function save_as() {
	my_annotator.getAnnotation();
	var results_data = "text/json;charset=utf-8,"
				+ encodeURIComponent(JSON.stringify(main_sents, null, '\t'));
	var filename = $("#filepath_input").val();
	$('<a href="data:' + results_data + '" download="' + filename + '"> download JSON file </a>').appendTo("body");
	
	d3.selectAll("textarea").remove();
	//$("body").append("<textarea id=\"results\">" + JSON.stringify(main_sents, null, '\t') + "</textarea>");
	//$("#results").focus();
	/*
	$.get("cgi-bin/annotation_processor.py", { 
				data : JSON.stringify(main_sents),
				filename: $("#filepath_input").val()
			},
			function(response) {
				console.log(response);
			});
	*/
}


/*
d3.select("body")
	.on("keydown", function() {
		switch (d3.event.keyCode) {
		case 38 : // up
				my_annotator.toPrev();
				my_browser.update();
				break;
		case 40 : // down
				my_annotator.toNext();
				my_browser.update();
				break;
		default :
			return false;
		}
		console.log(d3.event.keyCode);	
	});*/