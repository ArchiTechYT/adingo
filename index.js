const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const Replicate = require("replicate");
const fs = require('fs');
const { v1: uuidv1 } = require('uuid');
require('dotenv').config()

var bodyParser = require('body-parser')
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
    userAgent: "https://www.npmjs.com/package/create-replicate",
});

// Define your Replicate model here
const model = "jagilley/controlnet-seg:f967b165f4cd2e151d11e7450a8214e5d22ad2007f042f2f891ca3981dbfba0d";

let imgurl = '';

const promptStrMap = {
    'Scandistyle': 'white oak wood floor, cinematic, minimalist apartment bedroom, modernism furnishings, beige and white tone, fabric,natural sunlight, Photograph, contemporary living room, soft light of morning, integration matte stone features wall, unified color scheme of soothing white tones, creating a white and inviting atmosphere, full height window with balcony, a minimalist bed and furniture',
    'Jaapanesestyle': 'bedroom, industrial vibe, raw and rugged elements with sleek, modern accents. Incorporate metal, exposed concrete. Consider minimalist furniture, vintage lighting fixtures, and urban-inspired decor to complete the look.',
    'Naturalstyle': 'bedroom, natural vibe',
    'Aegeanstyle': 'bedroom, Aegean style'
};

app.get('/', (req, res) => {
    res.render('index', { imgurl });
});

// Express route handling "Love It" button click
app.get('/report', (req, res) => {
    const aiResultImageURL = req.query.image; // Retrieve image URL from query parameter
    res.render('report', { aiResultImageURL }); // Render love-it-page.ejs and pass image URL
});


app.post('/', async (req, res) => {

    console.log(req.body);
    const action = req.body ? req.body.action : undefined;

    if (action === 'generate') {
        const selectedStyle = req.body ? req.body.style : undefined;

        if (!selectedStyle || !promptStrMap[selectedStyle]) {
            return res.status(400).json({ error: 'Missing style or invalid style parameter' });
        }

        const promptStr = promptStrMap[selectedStyle];

        // Retrieve budget and timeline ranges from the request body
        const budgetRange = parseFloat(req.body.budget[1]); // Convert to float and extract upper bound
        const timelineRange = parseInt(req.body.timeline[1]); // Convert to integer and extract upper bound
        console.log(budgetRange)
        console.log(timelineRange)
        // Generate image based on different combinations of budget and timeline
        let image = '';
        if (budgetRange >= 0 && budgetRange < 10000) {
            if (timelineRange > 3 && timelineRange <= 6) {
                if (selectedStyle === 'Scandistyle') {
                    image = '/images/a.jpg';
                } else if (selectedStyle === 'Aegeanstyle') {
                    image = '/images/b.jpg';
                } else if (selectedStyle === 'Japanesestyle') {
                    image = '/images/c.jpg';
                }
            } else if (timelineRange > 6 && timelineRange <= 12) {
                if (selectedStyle === 'Scandistyle') {
                    image = '/images/d.jpg';
                } else if (selectedStyle === 'Aegeanstyle') {
                    image = '/images/e.jpg';
                } else if (selectedStyle === 'Japanesestyle') {
                    image = '/images/f.jpg';
                }
            }
        } else if (budgetRange >= 10000 && budgetRange <= 20000 && timelineRange <= 3) {
            if (selectedStyle === 'Scandistyle') {
                image = '/images/g.jpg';
            } else if (selectedStyle === 'Aegeanstyle') {
                image = '/images/h.jpg';
            }
        }
        console.log(image)
        res.json({ imgurl: image }); // Respond with single image URL

    } else if (action === 'clear') {
        imgurl = '';
        console.log('Image cleared');
        res.json({ imgurl });
    } else {
        console.log('Invalid action received:', action);
        res.status(400).json({ error: 'Invalid action' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
