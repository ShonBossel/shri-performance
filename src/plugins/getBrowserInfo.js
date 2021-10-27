function getbrowserInfo() {
    let nVer = navigator.appVersion;
    let nAgent = navigator.userAgent;
    let browserName  = navigator.appName;
    let fullVersion  = ''+parseFloat(navigator.appVersion); 
    let majorVersion = parseInt(navigator.appVersion,10);
    let nameOffset, verOffset, ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgent.indexOf("Opera"))!=-1) {
        browserName = "Opera";
        fullVersion = nAgent.substring(verOffset+6);
        if ((verOffset=nAgent.indexOf("Version"))!=-1) {
            fullVersion = nAgent.substring(verOffset+8);
        }
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgent.indexOf("MSIE"))!=-1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgent.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset=nAgent.indexOf("Chrome"))!=-1) {
        browserName = "Chrome";
        fullVersion = nAgent.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset=nAgent.indexOf("Safari"))!=-1) {
        browserName = "Safari";
        fullVersion = nAgent.substring(verOffset+7);
        if ((verOffset=nAgent.indexOf("Version"))!=-1) {
            fullVersion = nAgent.substring(verOffset+8);
        }
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset=nAgent.indexOf("Firefox"))!=-1) {
        browserName = "Firefox";
        fullVersion = nAgent.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ( (nameOffset=nAgent.lastIndexOf(' ')+1) < (verOffset=nAgent.lastIndexOf('/')) ) {
        browserName = nAgent.substring(nameOffset,verOffset);
        fullVersion = nAgent.substring(verOffset+1);
        if (browserName.toLowerCase()==browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // Trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1) {
    fullVersion=fullVersion.substring(0,ix);
    }
    if ((ix=fullVersion.indexOf(" "))!=-1) {
    fullVersion=fullVersion.substring(0,ix);
    }

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
        fullVersion  = ''+parseFloat(navigator.appVersion); 
        majorVersion = parseInt(navigator.appVersion,10);
    }

    // mobile version
    let mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);
    if (!mobile) {
        mobile = false;
    }

    return {all: '' +'Browser name  = '+browserName +'Full version  = '+fullVersion + 'Major version = '+majorVersion
                    +'navigator.appName = '+navigator.appName  +'navigator.userAgent = '+navigator.userAgent+'<br>',
            name: browserName,
            fullVersion: fullVersion,
            mobileVersion: mobile
            };
}

const browser = getbrowserInfo();

console.log('Browser Info:');
console.log('Browser: ', browser.name, ';');
console.log('Version: ', browser.fullVersion, ';');
console.log('Mobile: ', browser.mobileVersion, '.')