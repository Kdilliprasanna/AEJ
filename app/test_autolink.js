try {
  require('expo-modules-autolinking');
  console.log('REQUIRE SUCCESS!');
} catch (e) {
  const match = e.message.match(/Cannot find module '([^']+)'/);
  console.log('EXACT MISSING MODULE:', match ? match[1] : e.message);
}
