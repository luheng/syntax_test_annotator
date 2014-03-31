
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


my_annotator = new annotator(
		{ top:10, right:10, bottom:10, left:10}, 
		1000, 400, "#annotator");

my_annotator.update();
