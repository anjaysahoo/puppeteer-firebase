/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const scrapeWebsite = require('./pptr');

exports.scrape = functions
    .runWith({
        timeoutSeconds: 120,
        memory: '512MB' || '2GB',
    })
    .region('us-central1')
    .https.onRequest(async (req, res) => {
        const stories = await scrapeWebsite();
        res.type('html').send(stories.join('<br>'));
    });

exports.scrapingSchedule = functions.pubsub
    .schedule('09:00')
    .timeZone('America/New_York')
    .onRun(async (context) => {
        const stories = await scrapeWebsite();
        console.log('The NYT headlines are scraped every day at 9 AM EST', stories);
        return null;
    });
