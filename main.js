
main_sents = [
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

main_sents.forEach(function(d) {
	d.phrases.forEach(function(d2) {
		d2.questions = [];
	});
});

my_annotator = new annotator(
		{ top:10, right:10, bottom:10, left:10}, 
		1000, 100, "#annotator");

my_browser = new sent_browser({ top:10, right:10, bottom:10, left:10}, 
		300, 600, "#browser");

my_annotator.update();
my_browser.update();

$("input, select").keydown(function(e) {
    if (e.keyCode == 40 || e.keyCode == 13) {
        $(this).next('input, select').focus();
    } else if (e.keyCode == 38) {
    	$(this).prev('input, select').focus();
    }
});

function save_as() {
	$.get("cgi-bin/annotation_processor.py", { 
				data : JSON.stringify(main_sents),
				filename: $("#filepath_input").val()
			},
			function(response) {
				console.log(response);
			});
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