
## Adingo prototype 

ControlNet-Segment AI Model : https://replicate.com/jagilley/controlnet-seg?input=nodejs

- open visual studio code
- open terminal and type in :

```console
npx create-replicate --model=jagilley/controlnet-seg
```
- it will bring you to copy and paste your replicate token from its website
- once you paste the token, type in : 

```console
node index.js
```

- then open localhost://3000 in your brower




## my-replicate-app

This is a scaffoled Node.js project structure for running AI models with [Replicate's API](https://replicate.com/docs/get-started/nodejs).

## Usage

To get started, you'll need Node.js 18 or later. The simplest way to install it is using the installer at [nodejs.org](https://nodejs.org/).

Next, grab a Replicate API token from [replicate.com/account](http://replicate.com/account) and set it as an environment variable:
