// netlify/functions/get-sermons.js
const fetch = require('node-fetch');

// This is your YouTube API Key. It's safer here than in the frontend.
const API_KEY = 'AIzaSyDpqZ10WjmQ7bE4hmIkSShhRsFQGqThO58'; 
// Channel's playlist ID
const PLAYLIST_ID = 'UU9RmaPmtfVYWJuYig1Q_k3Q';
// Channel ID
const CHANNEL_ID = 'UC9RmaPmtfVYWJuYig1Q_k3Q';

exports.handler = async (event, context) => {
    try {
        let videoId = null;
        let videoTitle = null;

        // Try to find an active live stream first
        let liveUrl = `https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&maxResults=1&key=${API_KEY}`;
        let response = await fetch(liveUrl);
        let data = await response.json();

        if (data.items && data.items.length > 0) {
            videoId = data.items[0].id.videoId;
            videoTitle = data.items[0].snippet.title;
        } else {
            // If not live, find the single most recently uploaded video
            let latestUrl = `https://www.googleapis.com/youtube/v3/search?part=id,snippet&channelId=${CHANNEL_ID}&order=date&type=video&maxResults=1&key=${API_KEY}`;
            response = await fetch(latestUrl);
            data = await response.json();
            
            if (data.items && data.items.length > 0) {
                videoId = data.items[0].id.videoId;
                videoTitle = data.items[0].snippet.title;
            }
        }

        // Fetch the recent sermons from the playlist
        const sermonsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=10&key=${API_KEY}`;
        const sermonsResponse = await fetch(sermonsUrl);
        const sermonsData = await sermonsResponse.json();

        // Filter and get the first 6 sermons as before
        const displayedVideoIds = new Set();
        const sermonsToDisplay = [];
        for (const item of sermonsData.items) {
            const currentVideoId = item.snippet.resourceId.videoId;
            if (!displayedVideoIds.has(currentVideoId) && item.snippet.liveBroadcastContent !== 'live') {
                displayedVideoIds.add(currentVideoId);
                sermonsToDisplay.push({
                    title: item.snippet.title,
                    videoId: currentVideoId,
                    thumbnailUrl: item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : null
                });
            }
            if (sermonsToDisplay.length >= 6) break;
        }

        // Return the combined data
        return {
            statusCode: 200,
            body: JSON.stringify({
                liveVideo: {
                    videoId,
                    videoTitle
                },
                sermons: sermonsToDisplay
            })
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch data." })
        };
    }
};