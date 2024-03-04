import Replicate from "replicate";
import dotenv from "dotenv";
dotenv.config();

// JSDOM
import JSDOM from "jsdom";

// INDEX.HTML
import express from "express";
import path from "path";
const app = express();
const port = 3000;

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
  // res.render("index.html", { imageURL });
  const imgTag = `<img src="${imageURL}" alt="Image">`;
  console.log(imgTag);
  res.render("./public/index.html", { imgTag });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// PROMPT CONVERTOR
const minimalist =
  "white oak wood floor, cinematic, minimalist apartment bedroom, modernism furnishings, beige and white tone, fabric,natural sunlight, Photograph, contemporary living room, soft light of morning, integration matte stone features wall, unified color scheme of soothing white tones, creating a white and inviting atmosphere, full height window with balcony, a minimalist bed and furniture";
const industrial =
  "bedroom, industrial vibe, raw and rugged elements with sleek, modern accents. Incorporate metal, exposed concrete. Consider minimalist furniture, vintage lighting fixtures, and urban-inspired decor to complete the look.";
const artdedco = "";

// REPLICATE CODE
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: "https://www.npmjs.com/package/create-replicate",
});
const model =
  "jagilley/controlnet-seg:f967b165f4cd2e151d11e7450a8214e5d22ad2007f042f2f891ca3981dbfba0d";
const promptStr = industrial; // TO BE UPDATED

const input = {
  image:
    "https://replicate.delivery/pbxt/JzqJT0IKIqr5ivqi5vnWeFctz52kTlhnBqR2OcK1NJYFsfYx/a-room-at-the-beach.jpeg",
  scale: 1, // default: 9
  prompt: promptStr,
  a_prompt: "canon EOS 5d, best quality, extremely detailed",
  n_prompt: "mirror, complicated pattern, chandelier, artificial lighting, rug",
  ddim_steps: 5, // default: 100
  num_samples: "1",
  image_resolution: "512",
  detect_resolution: 512,
};

console.log({ model, input });
console.log("Running...");
const output = await replicate.run(model, { input });
console.log("Done!", output);

// console.log("Image : ", output[1]);
const imageURL = output[1];
console.log("ImageURL: ", imageURL);
