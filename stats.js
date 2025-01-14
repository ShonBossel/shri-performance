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
	console.log(`Total metrics for few days for "${page}" from ${startDate} till ${endDate}:`);

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
	table.fp = addMetricByFewDays(data, page, 'FirstPaint', startDate, endDate);
	table.fcp = addMetricByFewDays(data, page, 'FirstContentfulPaint', startDate, endDate);
	if(page === 'History-page test') {
		table.lex = addMetricByFewDays(data, page, 'LoopExecuting', startDate, endDate);
		table.sid = addMetricByFewDays(data, page, 'StaticImageLoad', startDate, endDate);
	}
	table.fch = addMetricByFewDays(data, page, 'FirstContentfulHeader', startDate, endDate);
	table.fcc = addMetricByFewDays(data, page, 'FirstContentfulContent', startDate, endDate);
	table.lcf = addMetricByFewDays(data, page, 'LastContentfulFooter', startDate, endDate);
	if(page === 'History-page test') {
		table.im1 = addMetricByFewDays(data, page, 'Image1Download', startDate, endDate);
		table.im2 = addMetricByFewDays(data, page, 'Image2Download', startDate, endDate);
		table.im3 = addMetricByFewDays(data, page, 'Image3Download', startDate, endDate);
	}	
	console.table(table);
}

// This function shows user session
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

// This function compares metric in different sclices and shows info of each browser in each table
function compareMetric(data, page, date) {
	console.log('Comparsion of metrics of different browsers:');
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
function addMetricByDate(data, page, name, date, browser) {
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

//This function returns metric for images downloading
function calcImageDownloadMetrics(data, page = 'Gallery-page test', date, browser) {
	console.log(`Metrics of images downloading on "${page}" for ${date}:`);
	
	let table = {};
	table.im1 = addMetricByDate(data, page, 'ImageZemlyaTemnotaLoading', date, browser);
	table.im2 = addMetricByDate(data, page, 'ImageGalaktikaLoading', date, browser);
	table.im3 = addMetricByDate(data, page, 'ImageAtmosferaLoading', date, browser);
	table.im4 = addMetricByDate(data, page, 'ImageZemlyAtmosferaLoading', date, browser);
	table.im5 = addMetricByDate(data, page, 'ImagePlanetaDnemLoading', date, browser);
	table.im6 = addMetricByDate(data, page, 'ImageKosmosAstroLoading', date, browser);
	table.im7 = addMetricByDate(data, page, 'ImageEkzoplanetaLoading', date, browser);
	table.im8 = addMetricByDate(data, page, 'ImageAtmosferaNochLoading', date, browser);
	table.im9 = addMetricByDate(data, page, 'ImageKosmosPlanetaLoading', date, browser);
	table.im10 = addMetricByDate(data, page, 'ImageKosmosLoading', date, browser);
	table.im11 = addMetricByDate(data, page, 'ImageKosmicheskoeProstranstvoLoading', date, browser);
	table.im12 = addMetricByDate(data, page, 'ImageVselennayaLoading', date, browser);
	table.im13 = addMetricByDate(data, page, 'ImageTemnotaLoading', date, browser);
	table.im14 = addMetricByDate(data, page, 'ImageSaturnLoading', date, browser);
	table.im15 = addMetricByDate(data, page, 'ImageAtmosferaNeboLoading', date, browser);
	table.imtot = addMetricByDate(data, page, 'TotalImagesLoading', date, browser);
	console.table(table);
}

// This function returns Larjest Contentful Paint metrics
function calcLCP(data, page, date) {
	console.log(`Larjest Contentful Delay on "${page}" for ${date}:`);

	let table = {};
	table.lcp = addMetricByDate(data, page, 'LCP', date);
	console.table(table);
}

// Calculate all metrics for day
function calcMetricsByDate(data, page, date, browser) {
	console.log(`All metrics for "${page}" on ${date}:`);

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
	table.fp = addMetricByDate(data, page, 'FirstPaint', date, browser);
	table.fcp = addMetricByDate(data, page, 'FirstContentfulPaint', date, browser);
	if(page === 'History-page test') {
		table.lex = addMetricByDate(data, page, 'LoopExecuting', date, browser);
		table.sid = addMetricByDate(data, page, 'StaticImageLoad', date, browser);
	}
	table.fch = addMetricByDate(data, page, 'FirstContentfulHeader', date, browser);
	table.fcc = addMetricByDate(data, page, 'FirstContentfulContent', date, browser);
	table.lcf = addMetricByDate(data, page, 'LastContentfulFooter', date, browser);
	if(page === 'History-page test') {
		table.im1 = addMetricByDate(data, page, 'Image1Download', date, browser);
		table.im2 = addMetricByDate(data, page, 'Image2Download', date, browser);
		table.im3 = addMetricByDate(data, page, 'Image3Download', date, browser);
	}
	console.table(table);
};

fetch('https://shri.yandex/hw/stat/data?counterId=D8F28E50-3339-11EC-9EDF-9F93055895B1')
	.then(res => res.json())
	.then(result => {
		let data = prepareData(result);

	//Metrics for default Send-page
		calcMetricsByDate(data, 'send test', '2021-10-31');
	console.log('************************************');
	
	//Metrics for Home-page
		calcMetricsByDate(data, 'Home-page test', '2021-10-31');
		console.log('------------------------------------');
//This will show metrics data in each table for each day inside interval from 28.10.21 till 31.10.21
		showMetricByPeriod(data, 'Home-page test', '2021-10-28', '2021-10-31');
		console.log('------------------------------------');
//This will show metrics data in one total table for all days inside interval from 28.10.21 till 31.10.21
		showAllMetricByPeriod(data, 'Home-page test', '2021-10-28', '2021-10-31');
		console.log('------------------------------------');
//This will show metrics data for "User" with id "User-1" for 31.10.21
		showSession(data, '2021-10-31', 'User', 'User-1');
		console.log('------------------------------------');
//This will show comparsion metrics for users browsers each in separate table for 31.10.21
		compareMetric(data, 'Home-page test', '2021-10-31');
		console.log('------------------------------------');
//This will show comparsion metrics for different types of platform (mobile & desktop) for 31.10.21
		comparePlatformTypeMetric(data, "Home-page test", '2021-10-31');
		console.log('------------------------------------');
//This will show metrics data for Larjest Contentfull Paint on 31.10.21
		calcLCP(data, 'Home-page test', '2021-10-31');
	console.log('************************************');

		//Metrics for History-page
		calcMetricsByDate(data, 'History-page test', '2021-10-31');
		console.log('------------------------------------');
//This will show metrics data in each table for each day inside interval from 28.10.21 till 31.10.21
		showMetricByPeriod(data, 'History-page test', '2021-10-28', '2021-10-31');
		console.log('------------------------------------');
//This will show metrics data in one total table for all days inside interval from 28.10.21 till 31.10.21
		showAllMetricByPeriod(data, 'History-page test', '2021-10-28', '2021-10-31');
		console.log('------------------------------------');
//This will show metrics data for "User" with id "User-1" for 31.10.21
		showSession(data, '2021-10-31', 'User', 'User-1');
		console.log('------------------------------------');
//This will show comparsion metrics for users browsers each in separate table for 31.10.21
		compareMetric(data, 'History-page test', '2021-10-31');
		console.log('------------------------------------');
//This will show comparsion metrics for different types of platform (mobile & desktop) for 31.10.21
		comparePlatformTypeMetric(data, "History-page test", '2021-10-31');
		console.log('------------------------------------');
//This will show metrics data for Larjest Contentfull Paint on 31.10.21
		calcLCP(data, 'Home-page test', '2021-10-31');
	console.log('************************************');

		//Metrics for Gallery-page
		calcMetricsByDate(data, 'Gallery-page test', '2021-10-31');
		console.log('------------------------------------');
//This will show metrics data in each table for each day inside interval from 28.10.21 till 31.10.21
		showMetricByPeriod(data, 'Gallery-page test', '2021-10-28', '2021-10-31');
		console.log('------------------------------------');
//This will show metrics data in one total table for all days inside interval from 28.10.21 till 31.10.21
		showAllMetricByPeriod(data, 'Gallery-page test', '2021-10-28', '2021-10-31');
		console.log('------------------------------------');
//This will show metrics data for "User" with id "User-1" for 31.10.21
		showSession(data, '2021-10-31', 'User', 'User-1');
		console.log('------------------------------------');
//This will show comparsion metrics for users browsers each in separate table for 31.10.21
		compareMetric(data, 'Gallery-page test', '2021-10-31');
		console.log('------------------------------------');
//This will show comparsion metrics for different types of platform (mobile & desktop) for 31.10.21
		comparePlatformTypeMetric(data, "Gallery-page test", '2021-10-31');
		console.log('------------------------------------');
//This will show metrics for loading images from Internet for 31.10.21
		calcImageDownloadMetrics(data, 'Gallery-page test', '2021-10-31');
		console.log('------------------------------------');
//This will show metrics data for Larjest Contentfull Paint on 31.10.21
		calcLCP(data, 'Home-page test', '2021-10-31');
	console.log('************************************');
	});
