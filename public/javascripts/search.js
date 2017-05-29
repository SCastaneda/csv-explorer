function search(query, cb) {

	var body = {
		"query": query
	};

	if(session !== undefined) {
		body.session = session;
	} else {
		// check if the window.location has a hash defined
		var hash = window.location.hash.replace("#", "");
		if(hash.length > 0) {
			session = hash;
			body.session = session;
		}
	}

	if(session === undefined || session.length === 0) {
		$("#results").html("Please upload a csv file before attempting to search");
	} else {

		$.ajax({
		  type: "POST",
		  url: "/search",
		  data: body,
		  success: cb,
		  dataType: "json"
		});
	}
}

function populateTable(data) {
	console.log(data);

	var tableData = "";

	for(var i = 0; i < data.length; i++) {
		var row = '<tr id="result-' + i + '"> '
	        + '<th scope="row">' + data[i].id + '</th>'
	        + '<td>' + data[i].name + '</td>'
	        + '<td>' + data[i].age + '</td>'
	        + '<td>' + data[i].address + '</td>'
	        + '<td>' + data[i].team + '</td>'
	        + '</tr>';

		tableData = tableData + row;
	}

	$('#results').html(tableData);
	}

$('#searchButton').on('click', function(){
  $('#searchField').trigger("enterKey");
});

$('#searchField').bind("enterKey",function(e){
  var query = $(this).val();

  	if(query.length > 0) {
		search(query, function(data) {
		    populateTable(data);
		});
   	}
});

$('#searchField').keyup(function(e){
    if(e.keyCode == 13)
    {
        $(this).trigger("enterKey");
    }
});
