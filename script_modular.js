function getData(url, callback) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.send();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    }
}

function getTableHeader(obj) {
    const headerRow = document.createElement('tr');
    const keysArray = [];
    for (const key in obj[0]) {
        keysArray.push(key);
        const headerEl = document.createElement('th');
        headerEl.innerText = key;
        headerRow.appendChild(headerEl)
    }
    return [headerRow, keysArray]
}

function getTableData(tableRow, keysArray) {
    const row = document.createElement('tr');
    for (const el of keysArray) {
        const tableEl = document.createElement('td');
        // truncate the data to 15 characters
        tableEl.innerText = tableRow[el].toString().substring(0, 15);
        row.appendChild(tableEl);
    }
	return row;
}

function buildTableRows(tableData) {
    console.log(tableData)
    const table = document.createElement('table');

    const [headerRow, keysArray] = getTableHeader(tableData)
    table.appendChild(headerRow);
    for (const row of tableData) {
        const tableRow = getTableData(row, keysArray);
        table.appendChild(tableRow)
    }
    return table
}

function generatePaginationButtons(next, prev) {
    
	if (next && prev) {
		const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => writeToDocument(prev));
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
		nextButton.addEventListener('click', () => writeToDocument(next));
		return [prevButton, nextButton]
	} else if (next && !prev) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
		nextButton.addEventListener('click', () => writeToDocument(next));
		return [nextButton];
	} else if (!next && prev) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
		prevButton.addEventListener('click', () => writeToDocument(prev));
		return [prevButton];
	}
}

function writeToDocument(url) {
    getData(url, function(responseData) {
        let pagination;

        if (responseData.next || responseData.previous) {
            pagination = generatePaginationButtons(responseData.next, responseData.previous);
        }

        console.dir(responseData);
        const resultsData = responseData.results;
        const table = buildTableRows(resultsData);
        const data = document.getElementById('data');

        data.innerHTML = '';
        data.appendChild(table);
        pagination.forEach(button => data.appendChild(button))
    })
}

