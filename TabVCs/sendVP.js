function initElement()
	{
	  var p = document.getElementById("makeVP");
	  p.onclick = showAlert;
	};

	function showAlert()
	{
		var checkboxes = document.getElementsByClassName('vcAvailable');
		var vals = [];
		for (var i=0, n=checkboxes.length;i<n;i++) 
		{
		    if (checkboxes[i].checked) 
		    {
		        vals.push(checkboxes[i].id);
		    }
		}

		document.write("<div> " + vals  + " </div>");
	}

initElement();