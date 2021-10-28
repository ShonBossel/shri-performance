//This function return user's Operation System
//If you want to see information about Operation System on each page, uncomment comments with console.log()

function BrowserInfo() {
    this.browserName  = navigator.appName;
    this.fullVersion  = '' + parseFloat(navigator.appVersion); 
    this.majorVersion = parseInt(navigator.appVersion, 10);
    this.detailInfo = '';
    this.cookie = (navigator.cookieEnabled) ? true : false
    this.mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(navigator.appVersion) ? true : false;
}

BrowserInfo.prototype.getBrowserInfo = function() {
    const nAgent = navigator.userAgent;
    let nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgent.indexOf("Opera")) != -1) {
        this.browserName = "Opera";
        this.fullVersion = nAgent.substring(verOffset + 6);
        if ((verOffset=nAgent.indexOf("Version")) != -1) {
            this.fullVersion = nAgent.substring(verOffset + 8);
        }
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgent.indexOf("MSIE")) != -1) {
        this.browserName = "Microsoft Internet Explorer";
        this.fullVersion = nAgent.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset=nAgent.indexOf("Chrome")) != -1) {
        this.browserName = "Chrome";
        this.fullVersion = nAgent.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset=nAgent.indexOf("Safari")) != -1) {
        this.browserName = "Safari";
        this.fullVersion = nAgent.substring(verOffset + 7);
        if ((verOffset=nAgent.indexOf("Version")) != -1) {
            this.fullVersion = nAgent.substring(verOffset + 8);
        }
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset=nAgent.indexOf("Firefox")) != -1) {
        this.browserName = "Firefox";
        this.fullVersion = nAgent.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ( (nameOffset=nAgent.lastIndexOf(' ') + 1) < (verOffset=nAgent.lastIndexOf('/')) ) {
        this.browserName = nAgent.substring(nameOffset, verOffset);
        this.fullVersion = nAgent.substring(verOffset + 1);
        if (this.browserName.toLowerCase() == this.browserName.toUpperCase()) {
            this.browserName = navigator.appName;
        }
    }
    // Trim the fullVersion string at semicolon/space if present
    if ((ix=this.fullVersion.indexOf(";")) != -1) {
    this.fullVersion = this.fullVersion.substring(0, ix);
    }
    if ((ix=this.fullVersion.indexOf(" ")) != -1) {
    this.fullVersion = this.fullVersion.substring(0, ix);
    }

    this.majorVersion = parseInt('' + this.fullVersion, 10);
    if (isNaN(this.majorVersion)) {
        this.fullVersion  = '' + parseFloat(navigator.appVersion); 
        this.majorVersion = parseInt(navigator.appVersion, 10);
    }

    this.detailInfo +='Browser name  = ' + this.browserName +'Full version  = ' + this.fullVersion + 'Major version = ' + this.majorVersion
                    + 'navigator.appName = ' + navigator.appName  + 'navigator.userAgent = ' + navigator.userAgent;

    // console.log('Browser Info:');
    // console.log('Browser: ', this.browserName, ';');
    // console.log('Version: ', this.fullVersion, ';');
    // console.log('Cookie enabled: ', this.cookie, ';');
    // console.log('Mobile: ', this.mobile, '.');


    return {browserName: this.browserName,
            browserFullVersion: this.fullVersion,
            browserMajorVersion: this.majorVersion,
            browserDetailInfo: this.detailInfo,
            browserCookie: this.cookie,
            mobile: this.mobile};
};

