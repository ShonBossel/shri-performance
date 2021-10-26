function addDays(date, days) {
	let tempMas = date.split('-');
	let newDay = Number(tempMas[2]) + days;
	tempMas[2] = newDay;
	result = tempMas.join('-');
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
// show metrics for few days
function showMetricByPeriod(data, page, startDate, endDate) {
	let result = [];
	while (endDate >= startDate) {
		calcMetricsByDate(data, page, startDate);
		startDate = addDays(startDate, 1);
	}
}

// show user session
function showSession() {
}

// compare metric in different срезах
function compareMetric() {
}

// any other scenaries, которые считаете полезными


// Пример
// добавить метрику за выбранный день
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

	table.dns = addMetricByDate(data, page, 'DNS', date);
	table.tcp = addMetricByDate(data, page, 'TCP', date);
	table.ssl = addMetricByDate(data, page, 'SSL', date);
	table.ttfb = addMetricByDate(data, page, 'TtFB', date);
	table.pageLoadTime = addMetricByDate(data, page, 'PageLoadTime', date);
	table.compressionSavings = addMetricByDate(data, page, 'CompressionSavings', date);

	console.table(table);
};

fetch('https://shri.yandex/hw/stat/data?counterId=D8F28E50-3339-11EC-9EDF-9F95580795B1')
	.then(res => res.json())
	.then(result => {
		let data = prepareData(result);

		calcMetricsByDate(data, 'send test', '2021-10-26');
		
		// добавить свои сценарии, реализовать функции выше
		console.log('------------------------------------');
	//	showMetricByPeriod(data, 'send test', '2021-10-21', '2021-10-26');

	});
