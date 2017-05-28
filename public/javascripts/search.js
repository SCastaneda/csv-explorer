function search(query, cb) {
	$.ajax({
	  type: "POST",
	  url: "/search",
	  data: { "query": query },
	  success: cb,
	  dataType: "json"
	});
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
