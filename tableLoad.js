function translateMonth(language, id) {
	var czech = ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec', 'Celkem'];
	var english = ['January','February','March','April','May','June','July','August','September','October','November','December', 'Total'];
	if (id > 0 < 14) {
		switch (language){
			case 'cs':
				return czech[id-1];
			case 'en':  
				return english[id-1];
		}
	}
	return id;
}

function tableCreate(language) {
	// Parent element - to which is table generated
  	var body = document.getElementById('table_create_div');

  	// Data file URL
  	var fileUrl = 'http://localhost:8888/file.txt';

	// Variables for later use
    var rawFile = new XMLHttpRequest();
  	var allTextLines;

  	// Open file and load lines 
	rawFile.open("GET", fileUrl, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
            	loaded = true;
                var allText = rawFile.responseText;
                allTextLines = allText.split('\n');
            }
        }
    }
    rawFile.send(null);

	// check if any line is present
    if (allTextLines.length > 0) {
    	// table parts variables
    	var tbl;
    	var tbdy;
    	var thead;
    	var tableTotal = 0;

    	// if any tr elements are added, table must be rendered
    	var elementAdded = false;

    	// itering through data file lines, splitting them by ';'
    	for (var line = 0; line < allTextLines.length; line++) {
    		var lineSplit = allTextLines[line].split(';');

    		// if length is 1 - YEAR head is generated
    		if (lineSplit.length == 1) {
    			if (elementAdded) {
					// add final count
					var tr = document.createElement('tr');

					var td = document.createElement('td');
					td.style.width = "100%";
			    	td.style.borrderBottom = "1px solid #E6E6E6";
			    	td.style.fontWeight = "bold";
    				td.style.fontSize = "12pt";
			    	td.appendChild(document.createTextNode(translateMonth(language,13)));
					tr.appendChild(td);

					td = document.createElement('td');
					td.style.whiteSpace = "nowrap";
			    	td.style.height = "36px";
			    	td.style.borderBottom = "1px solid #E6E6E6";
			    	td.style.textAlign = "center";
			    	td.style.fontWeight = "bold";
    				td.style.fontSize = "12pt";
			    	td.appendChild(document.createTextNode(((tableTotal>0)?'+ ':'- ') + String(tableTotal).replace(/-/g,'') + ' %'));
					tr.appendChild(td);

					tbdy.appendChild(tr);

	    			// append table together
					tbl.appendChild(thead);
					tbl.appendChild(tbdy);
					body.appendChild(tbl);

					elementAdded = false;
					tableTotal = 0;
	    		}
    			// creating table
				tbl = document.createElement('table');
				tbl.style.marginLeft = "auto";
				tbl.style.marginRight = "auto";
				tbl.classList.add('data-table-stat');

				// creating table head
				thead = document.createElement('thead');
				var theadth = document.createElement('th');
				theadth.setAttribute('colspan', '2');
				var theadtr = document.createElement('tr');
				var inputElement = document.createElement('a');
				inputElement.setAttribute('href', ('#' + 'table' + line));
				inputElement.setAttribute('data-parent', ('#' + 'table' + line));
				inputElement.setAttribute('data-toggle', 'collapse');
				inputElement.classList.add('table-header-stats');
				inputElement.appendChild(document.createTextNode(lineSplit[0]));
				theadth.appendChild(inputElement);
				theadtr.appendChild(theadth);
				thead.appendChild(theadtr);

				//create table body
				tbdy = document.createElement('tbody');
				tbdy.setAttribute('id', ('table' + line));
				tbdy.style.display = "block";
			// if length is 2 - month and data are generated
    		} else if (lineSplit.length == 2) {
    			var tr = document.createElement('tr');
				for (var j = 0; j < 2; j++) { // column count
				    var td = document.createElement('td');
				    if (j == 0) { // month element
				    	td.style.width = "100%";
				    	td.style.borrderBottom = "1px solid #E6E6E6";
				    	td.appendChild(document.createTextNode(translateMonth(language,lineSplit[j])));
				    } else { // data element
				    	// ADD TO COUNT - FINAL COUNT (+/-), remove %
				    	td.style.whiteSpace = "nowrap";
				    	td.style.height = "36px";
				    	td.style.borderBottom = "1px solid #E6E6E6";
				    	td.style.textAlign = "center";
				    	var tableValue = lineSplit[j];
				    	if (tableValue.includes('%')) {
				    		var numberValue = tableValue.replace('+','');
				    		numberValue = numberValue.replace(',','.');
				    		if (numberValue.includes('-')) {
				    			numberValue = numberValue.replace(/-/g, '');
				    			numberValue = parseFloat(numberValue) * (-1);
				    		}
				    		tableTotal += parseFloat(numberValue);
				    	}
				    	td.appendChild(document.createTextNode(tableValue));
				    }
				    tr.appendChild(td)       
				}
				tbdy.appendChild(tr);
				elementAdded = true;
    		}
		}
		// add final count
		var tr = document.createElement('tr');

		var td = document.createElement('td');
		td.style.width = "100%";
    	td.style.borrderBottom = "1px solid #E6E6E6";
    	td.style.fontWeight = "bold";
		td.style.fontSize = "12pt";	
    	td.appendChild(document.createTextNode(translateMonth(language,13)));
		tr.appendChild(td);

		td = document.createElement('td');
		td.style.whiteSpace = "nowrap";
    	td.style.height = "36px";
    	td.style.borderBottom = "1px solid #E6E6E6";
    	td.style.textAlign = "center";
    	td.style.fontWeight = "bold";
    	td.style.fontSize = "12pt";
    	td.appendChild(document.createTextNode(((tableTotal>0)?'+ ':'- ') + String(tableTotal).replace(/-/g,'') + ' %'));
		tr.appendChild(td);

		tbdy.appendChild(tr);

		// append table together
		tbl.appendChild(thead);
		tbl.appendChild(tbdy);
		body.appendChild(tbl);
    }
}