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

	console.log('Perfomance & Navigation Timing Metrics:');
	let table = {};	
	table.dns = addMetricByFewDays(data, page, 'DNS', startDate, endDate);
	table.tcp = addMetricByFewDays(data, page, 'TCP', startDate, endDate);
	table.ssl = addMetricByFewDays(data, page, 'SSL', startDate, endDate);
	table.ttfb = addMetricByFewDays(data, page, 'TtFB', startDate, endDate);
	table.pageLoadTime = addMetricByFewDays(data, page, 'PageLoadTime', startDate, endDate);
	table.compressionSavings = addMetricByFewDays(data, page, 'CompressionSavings', startDate, endDate);

	console.table(table);

	console.log('Paint Timing Metrics:');
	table = {};
	table.lex = addMetricByFewDays(data, page, 'LoopExecuting', startDate, endDate);
	table.sid = addMetricByFewDays(data, page, 'StaticImageLoad', startDate, endDate);
	table.fch = addMetricByFewDays(data, page, 'FirstContentfulHeader', startDate, endDate);
	table.fcc = addMetricByFewDays(data, page, 'FirstContentfulContent', startDate, endDate);
	table.lcf = addMetricByFewDays(data, page, 'LastContentfulFooter', startDate, endDate);
	table.im1 = addMetricByFewDays(data, page, 'Image1Download', startDate, endDate);
	table.im2 = addMetricByFewDays(data, page, 'Image2Download', startDate, endDate);
	table.im3 = addMetricByFewDays(data, page, 'Image3Download', startDate, endDate);
	
	console.table(table);
}

// This function shows user session
function showSession(data, date, user, id/* = true*/) {
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

// This function compares metric in different sclices and shows info of each browser in each table
function compareMetric(data, page, date) {
	console.log('Comparsion of metrics of different browsers:');
	//CHANGE THIS!!!! Not needed to view one type of browser for few times
	let browsers = [...new Set(data.map(item => item.additional.browser))];

	for (let browser of browsers) {
		console.log(`Metrics information in browser "${browser}":`);
		calcMetricsByDate(data, page, date, browser);
	}
}

// This function compares metric of different platform types and shows info in one table
function comparePlatformTypeMetric(data, page, date) {
	console.log('Comparsion of metrics of different platform types:')
	let platformTypes = [...new Set(data.map(item => item.additional.mobile? 'mobile' : 'desktop'))];
	
	for (let platformType of platformTypes) {
		console.log(`Metrics information for ${platformType}-version:`);
		calcMetricsByDate(data, page, date, platformType);
	}
}


// Example
// This function adds metric for chosen date
function addMetricByDate(data, page, name, date, browser/* = true*/) {
	let sampleData;
	if(browser === 'desktop' || browser === 'mobile') {
		const platformType = browser;
		sampleData = data
					.filter(item => item.page == page && item.name == name && item.date == date && platformType == item.additional.mobile)
					.map(item => item.value);
	}
	else {
		sampleData = data
					.filter(item => item.page == page && item.name == name && item.date == date && (browser ? item.additional.browser==browser: true))
					.map(item => item.value);
	}

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
function calcMetricsByDate(data, page, date, browser) {
	console.log(`All metrics for ${date}:`);

	let table = {};
	console.log('Perfomance & Navigation Timing Metrics:');
	table.dns = addMetricByDate(data, page, 'DNS', date, browser);
	table.tcp = addMetricByDate(data, page, 'TCP', date, browser);
	table.ssl = addMetricByDate(data, page, 'SSL', date, browser);
	table.ttfb = addMetricByDate(data, page, 'TtFB', date, browser);
	table.pageLoadTime = addMetricByDate(data, page, 'PageLoadTime', date, browser);
	table.compressionSavings = addMetricByDate(data, page, 'CompressionSavings', date, browser);

	console.table(table);

	table = {};
	console.log('Paint Timing Metrics:');
	table.lex = addMetricByDate(data, page, 'LoopExecuting', date, browser);
	table.sid = addMetricByDate(data, page, 'StaticImageLoad', date, browser);
	table.fch = addMetricByDate(data, page, 'FirstContentfulHeader', date, browser);
	table.fcc = addMetricByDate(data, page, 'FirstContentfulContent', date, browser);
	table.lcf = addMetricByDate(data, page, 'LastContentfulFooter', date, browser);
	table.im1 = addMetricByDate(data, page, 'Image1Download', date, browser);
	table.im2 = addMetricByDate(data, page, 'Image2Download', date, browser);
	table.im3 = addMetricByDate(data, page, 'Image3Download', date, browser);	

	console.table(table);
};

fetch('https://shri.yandex/hw/stat/data?counterId=D8F28E50-3339-11EC-9EDF-9F93055895B1')
	.then(res => res.json())
	.then(result => {
		let data = prepareData(result);

	//Metrics for Home-page
		calcMetricsByDate(data, 'Home-page test', '2021-10-29');
		//console.log('------------------------------------');
//This will show metrics data in each table for each day inside interval from 25.10.21 till 28.10.21
		//showMetricByPeriod(data, 'Home-page test', '2021-10-25', '2021-10-28');
		//console.log('------------------------------------');
//This will show metrics data in one total table for all days inside interval from 25.10.21 till 28.10.21
		//showAllMetricByPeriod(data, 'Home-page test', '2021-10-25', '2021-10-28');
		//console.log('------------------------------------');
//This will show metrics data for "User" with id "User-pochemypotomy123" for 28.10.21
		//showSession(data, '2021-10-28', 'User', 'User-pochemypotomy123');
		//console.log('------------------------------------');
//This will show comparsion metrics for users browsers each in separate table for 28.10.21
		//compareMetric(data, 'Home-page test', '2021-10-28');
		//console.log('------------------------------------');
//This will show comparsion metrics for different types of platform (mobile & desktop)
		//comparePlatformTypeMetric(data, "Home-page test", '2021-10-28');
		//console.log('************************************');

		//Metrics for History-page
		calcMetricsByDate(data, 'History-page test', '2021-10-29');
		//console.log('------------------------------------');
//This will show metrics data in each table for each day inside interval from 25.10.21 till 28.10.21
		//showMetricByPeriod(data, 'History-page test', '2021-10-25', '2021-10-28');
		//console.log('------------------------------------');
//This will show metrics data in one total table for all days inside interval from 25.10.21 till 28.10.21
		//showAllMetricByPeriod(data, 'History-page test', '2021-10-25', '2021-10-28');
		//console.log('------------------------------------');
//This will show metrics data for "User" with id "User-pochemypotomy123" for 28.10.21
		//showSession(data, '2021-10-28', 'User', 'User-pochemypotomy123');
		//console.log('------------------------------------');
//This will show comparsion metrics for users browsers each in separate table for 28.10.21
		//compareMetric(data, 'History-page test', '2021-10-28');
		//console.log('------------------------------------');
//This will show comparsion metrics for different types of platform (mobile & desktop)
		//comparePlatformTypeMetric(data, "History-page test", '2021-10-28');
		//console.log('************************************');
	});
