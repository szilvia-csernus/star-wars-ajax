function getData(url, callback) {
	const xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			callback(JSON.parse(this.responseText));
		}
	};

	xhr.open('GET', url );
	xhr.send();
}

function getTableHeaders(obj) {
	var tableHeaders = [];

	Object.keys(obj).forEach(function (key) {
		tableHeaders.push(`<td>${key}</td>`);
	});

	return `<tr>${tableHeaders}</tr>`;
}

function generatePaginationButtons(next, prev) {
    if (next && prev) {
		return `<button onclick="writeToDocument('${prev}')">Previous</button>
         <button onclick="writeToDocument('${next}')">Next</button>`
    } else if (next && !prev) {
        return `<button onclick="writeToDocument('${next}')">Next</button>`
    } else if (!next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>`
    }
}

function writeToDocument(url) {
	var tableRows = [];
	var el = document.getElementById('data');

	getData(url, function (data) {
        let pagination;
        if (data.next || data.previous) {
            pagination = generatePaginationButtons(data.next, data.previous)
        }
		data = data.results;
		const tableHeaders = getTableHeaders(data[0]);

		data.forEach(function (item) {
			const dataRow = [];
			Object.keys(item).forEach(function (key) {
				const rowData = item[key].toString();
				const truncatedData = rowData.substring(0, 15);
				dataRow.push(`<td>${truncatedData}</td>`);
			});
			tableRows.push(`<tr>${dataRow}</tr>`);
		});
        // The REGEX at the end replaces trailing commas with empty strings.
		el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g,"");
	});
}
