//This function adds 'days'-days to current 'date'
function addDays(date, days) {
	let tempMas = date.split('-');
	let newDay = new Date(Number(tempMas[0]), Number(tempMas[1]), Number(tempMas[2])+days);
	let result = [newDay.getFullYear(), newDay.getMonth(), newDay.getDate()].join('-');
	return result;
  }

function quantile(arr, q) {
    const sorted = arr.sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;

    if (sorted[base + 1] !== undefined) {
        return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
    } else {
        return Math.floor(sorted[base]);
    }
};

function prepareData(result) {
	return result.data.map(item => {
		item.date = item.timestamp.split('T')[0];

		return item;
	});
}

// TODO: to realize
//This function shows metric for few days one table by one (each table for each day)
function showMetricByPeriod(data, page, startDate, endDate) {
	console.log(`List of metrics for for few days from ${startDate} till ${endDate}:`);
	while (endDate >= startDate) {
		calcMetricsByDate(data, page, startDate);
		startDate = addDays(startDate, 1);
	}
}

//This function shows metric for few days as total values (in one table)
function showAllMetricByPeriod(data, page, startDate, endDate) {
	console.log(`Total metrics for few days from ${startDate} till ${endDate}:`);
	let table = {};
	
	table.dns = addMetricByFewDays(data, page, 'DNS', startDate, endDate);
	table.tcp = addMetricByFewDays(data, page, 'TCP', startDate, endDate);
	table.ssl = addMetricByFewDays(data, page, 'SSL', startDate, endDate);
	table.ttfb = addMetricByFewDays(data, page, 'TtFB', startDate, endDate);
	table.pageLoadTime = addMetricByFewDays(data, page, 'PageLoadTime', startDate, endDate);
	table.compressionSavings = addMetricByFewDays(data, page, 'CompressionSavings', startDate, endDate);

	console.table(table);
}

// show user session
function showSession(data, date, user, id) {
	console.log(`Session information for user "${user}" on ${date}:`);

	let sampleData = data
					.filter((item) => item.date == date && item.additional.user == user && (id ? item.sessionId == id: true))
					.map(item => {
						return { 
							'Date': item.date,
							'SessionId': item.sessionId,
							'User': item.additional.user,
							'Platform': item.additional.platform,
							'Operating System': item.additional.operatingSystem,
							'Browser': item.additional.browser,
							'Browser Version': item.additional.browserVersion,
							'Agent': item.additional.browser,
						}
					});
	console.table(sampleData);
}

// compare metric in different срезах
function compareMetric() {
}

// any other scenaries, которые считаете полезными


// Пример
// This function adds metric for chosen date
function addMetricByDate(data, page, name, date) {
	let sampleData = data
					.filter(item => item.page == page && item.name == name && item.date == date)
					.map(item => item.value);

	let result = {};

	result.hits = sampleData.length;
	result.p25 = quantile(sampleData, 0.25);
	result.p50 = quantile(sampleData, 0.5);
	result.p75 = quantile(sampleData, 0.75);
	result.p95 = quantile(sampleData, 0.95);

	return result;
}

//This function adds metric for chosen date interval
function addMetricByFewDays(data, page, name, startDate, endDate) {
	let sampleData = data
					.filter(item => item.page == page && item.name == name && item.date >= startDate && item.date <= endDate)
					.map(item => item.value);

	let result = {};

	result.hits = sampleData.length;
	result.p25 = quantile(sampleData, 0.25);
	result.p50 = quantile(sampleData, 0.5);
	result.p75 = quantile(sampleData, 0.75);
	result.p95 = quantile(sampleData, 0.95);

	return result;
}
// рассчитывает все метрики за день
function calcMetricsByDate(data, page, date) {
	console.log(`All metrics for ${date}:`);

	let table = {};
	// table.connect = addMetricByDate(data, page, 'connect', date);
	// table.ttfb = addMetricByDate(data, page, 'ttfb', date);
	// table.load = addMetricByDate(data, page, 'load', date);
	// table.square = addMetricByDate(data, page, 'square', date);
	// table.load = addMetricByDate(data, page, 'load', date);
	// table.generate = addMetricByDate(data, page, 'generate', date);
	// table.draw = addMetricByDate(data, page, 'draw', date);

	console.log('Perfomance Timing Metrics:');
	table.dns = addMetricByDate(data, page, 'DNS', date);
	table.tcp = addMetricByDate(data, page, 'TCP', date);
	table.ssl = addMetricByDate(data, page, 'SSL', date);
	table.ttfb = addMetricByDate(data, page, 'TtFB', date);
	table.pageLoadTime = addMetricByDate(data, page, 'PageLoadTime', date);
	table.compressionSavings = addMetricByDate(data, page, 'CompressionSavings', date);

	console.table(table);

	table = {};

	console.log('Paint Timing Metrics:');
	

	console.table(table);
};

fetch('https://shri.yandex/hw/stat/data?counterId=D8F28E50-3339-11EC-9EDF-9F93000295B1')
	.then(res => res.json())
	.then(result => {
		let data = prepareData(result);

		calcMetricsByDate(data, 'send test', '2021-10-27');
		
		// добавить свои сценарии, реализовать функции выше
		console.log('------------------------------------');
		showSession(data, '2021-10-27', 'User', 'User-pochemypotomy123');
	//	showMetricByPeriod(data, 'send test', '2021-10-24', '2021-10-27');


		console.log(addDays('2021-10-27', 5));
	});
