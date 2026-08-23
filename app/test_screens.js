require('@babel/register')({
  presets: ['babel-preset-expo'],
  extensions: ['.js', '.jsx', '.json']
});

const screens = [
  'AuthScreen',
  'DashboardScreen',
  'JobsScreen',
  'ResumeLabScreen',
  'TemplatesScreen',
  'MockTestScreen',
  'AIChatScreen',
  'ApplicationsScreen',
  'ProfileScreen',
  'NotificationsScreen',
  'SettingsScreen',
  'CoverLetterScreen',
  'RoadmapScreen',
  'RoleExplorerScreen',
  'SalaryCalculatorScreen',
  'FlashcardsScreen',
  'LiveInterviewerScreen',
  'AdminAnalyticsScreen'
];

for (const name of screens) {
  try {
    require(`./src/screens/${name}`);
    console.log(`OK: ${name}`);
  } catch (err) {
    console.log(`FAIL: ${name} -> ${err.message.split('\n')[0]}`);
  }
}
