const fs = require('fs-extra');
const xlsxReporter = require('./utils/xlsxReporter');
// Fallback report script (required for early exits)
const fallbackReportPath = './mega_report.xlsx';

exports.config = {
    runner: 'local',
    specs: [
        process.env.WDIO_CI_SPEC || './tests/**/*.test.js'
    ],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        // In GHA, emulator uses port 4723, debug APK path provided via env
        'appium:app': process.env.APK_PATH || undefined,
        // Timeout buffers since we have mega specs
        'appium:newCommandTimeout': 240,
    }],
    logLevel: 'error',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 99999999 // mega test needs insane timeout
    },
    
    // Hooks
    onPrepare: function (config, capabilities) {
        xlsxReporter.startRun();
    },
    
    afterTest: function(test, context, { error, result, duration, passed, retries }) {
        // Parse category from test title (e.g. "[Functional] TC-X...")
        let category = 'Uncategorized';
        const match = test.title.match(/^\[(.*?)\]/);
        if (match) category = match[1];
        
        xlsxReporter.recordTest(
            category,
            test.title,
            duration,
            passed ? 'passed' : 'failed',
            error ? error.message : null
        );
    },
    
    after: function (result, capabilities, specs) {
        // Intercept fatal WDIO/Appium crashes to still report
        if (result !== 0 && xlsxReporter.results.length === 0) {
             xlsxReporter.recordTest('Fatal', 'Appium/Session Setup Crashed', 20, 'failed', 'Session init fatal error');
        }
    },
    
    onComplete: async function(exitCode, config, capabilities, results) {
        await xlsxReporter.generateReport(fallbackReportPath);
        console.log(`Report generated at ${fallbackReportPath}`);
        // Can call generateHtmlReport.js here if needed
    }
}
