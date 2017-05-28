function search(query, cb) {
	$.ajax({
	  type: "POST",
	  url: "/search",
	  data: { "query": query },
	  success: cb,
	  dataType: "json"
	});
}

