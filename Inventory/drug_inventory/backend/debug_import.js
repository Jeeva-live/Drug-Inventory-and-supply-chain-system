try {
    console.log('Loading app...');
    const app = require('./src/app');
    console.log('App loaded successfully');
} catch (error) {
    console.error('Error loading app:', error);
}
