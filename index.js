const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const Replicate = require("replicate");
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
  'min': 'white oak wood floor, cinematic, minimalist apartment bedroom, modernism furnishings, beige and white tone, fabric,natural sunlight, Photograph, contemporary living room, soft light of morning, integration matte stone features wall, unified color scheme of soothing white tones, creating a white and inviting atmosphere, full height window with balcony, a minimalist bed and furniture',
  'mod': 'bedroom, industrial vibe, raw and rugged elements with sleek, modern accents. Incorporate metal, exposed concrete. Consider minimalist furniture, vintage lighting fixtures, and urban-inspired decor to complete the look.',
  'art': '' // Add your ArtDeco prompt here
};

app.get('/', (req, res) => {
  res.render('index', { imgurl });
});

app.post('/', async (req, res) => {
  console.log(req.body)
  const action  = req.body ? req.body.action : undefined;

  if (action === 'generate') {
    const selectedStyle = req.body ? req.body.style : undefined;

    if (!selectedStyle || !promptStrMap[selectedStyle]) {
      return res.status(400).json({ error: 'Missing style or invalid style parameter' });
    }

    const promptStr = promptStrMap[selectedStyle];

    const input = {
      image: "https://replicate.delivery/pbxt/JzqJT0IKIqr5ivqi5vnWeFctz52kTlhnBqR2OcK1NJYFsfYx/a-room-at-the-beach.jpeg",
      scale: 1,
      prompt: promptStr,
      a_prompt: "canon EOS 5d, best quality, extremely detailed",
      n_prompt: "mirror, complicated pattern, chandelier, artificial lighting, rug",
      ddim_steps: 50,
      num_samples: "1",
      image_resolution: "256",
      detect_resolution: 128,
    };

    console.log('Received request to generate image with the following parameters:');
    console.log('Selected Style:', selectedStyle);
    console.log('Prompt String:', promptStr);

    try {
      console.log("Running Replicate...");
      const output = await replicate.run(model, { input });
      const status = output[1];
      console.log('Replicate Status:', status);
      console.log('Image generation complete!');
      imgurl = status;
      res.json({ imgurl });
    } catch (error) {
      console.log('Error during Replicate:', error);
      res.status(500).send("Internal Server Error");
    }
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
