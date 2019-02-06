# tensorflow-image-recognition-chrome-extension

This fork is to demonstrate a bug with the Tensorflow.js library.
Conditions to reproduce:
* On Chromebook, ChromeOS extension.
* WebGL backend only.
* Batch image predictions only (the first prediction in each batch is consistently correct).

Instructions:

Must be run on a Chromebook to see prediction discrepancies.

```sh
git clone https://github.com/ryancbarry/tensorflow-image-recognition-chrome-extension.git
```

```sh
cd tensorflow-image-recognition-chrome-extension/
```

```sh
npm i
```

```sh
npm run build
```

- Open Google Chrome extensions page: chrome://extensions/

- Enable developer mode

- Click [LOAD UNPACKED]

- Select tensorflow-image-recognition-chrome-extension/dist/ -folder!

- Click the extensions `background page` link.

- It'll open a report generated against the WebGL backend by default.
  To open a report generated against the CPU backend, run:

```js
__useCpuBackend()
```

On a Chromebook, compare prediction results between the WebGL report and the CPU. For example, I'm getting the following:

```json
{
"meta":{
"userAgent":"Mozilla/5.0(X11;CrOSx86_6411151.113.0)AppleWebKit/537.36(KHTML,likeGecko)Chrome/71.0.3578.127Safari/537.36",
"tensorflow":{
"tfjs-core":"0.15.0",
"tfjs-data":"0.2.0",
"tfjs-layers":"0.10.0",
"tfjs-converter":"0.8.0",
"tfjs":"0.15.0"
},
"backend":"webgl"
},
"TeslaCat:https://r.hswstatic.com/w_907/gif/tesla-cat.jpg":[
{
"probability":0.6159740686416626,
"className":"windowscreen"
},
{
"probability":0.26258158683776855,
"className":"windowshade"
},
{
"probability":0.018357258290052414,
"className":"shoji"
},
{
"probability":0.018023479729890823,
"className":"digitalclock"
},
{
"probability":0.014563548378646374,
"className":"electricfan,blower"
},
{
"probability":0.013532050885260105,
"className":"strainer"
},
{
"probability":0.003762525739148259,
"className":"spotlight,spot"
},
{
"probability":0.002997360657900572,
"className":"loudspeaker,speaker,speakerunit,loudspeakersystem,speakersystem"
},
{
"probability":0.0027297139167785645,
"className":"knot"
},
{
"probability":0.002250275108963251,
"className":"radiator"
}
]}
```

```json
{
"meta":{
"userAgent":"Mozilla/5.0(X11;CrOSx86_6411151.113.0)AppleWebKit/537.36(KHTML,likeGecko)Chrome/71.0.3578.127Safari/537.36",
"tensorflow":{
"tfjs-core":"0.15.0",
"tfjs-data":"0.2.0",
"tfjs-layers":"0.10.0",
"tfjs-converter":"0.8.0",
"tfjs":"0.15.0"
},
"backend":"cpu"
},
"TeslaCat:https://r.hswstatic.com/w_907/gif/tesla-cat.jpg":[
{
"probability":0.5521824359893799,
"className":"Egyptiancat"
},
{
"probability":0.10373547673225403,
"className":"tabby,tabbycat"
},
{
"probability":0.07581795752048492,
"className":"tigercat"
},
{
"probability":0.06736607849597931,
"className":"Siamesecat,Siamese"
},
{
"probability":0.05536121129989624,
"className":"schipperke"
},
{
"probability":0.03107449598610401,
"className":"groenendael"
},
{
"probability":0.014213989488780499,
"className":"Bostonbull,Bostonterrier"
},
{
"probability":0.01381840929389,
"className":"lynx,catamount"
},
{
"probability":0.006884293630719185,
"className":"Scotchterrier,Scottishterrier,Scottie"
},
{
"probability":0.0068834926933050156,
"className":"carton"
}
]
}
```

Note that the CPU report features the predictions we expect, and the WebGL report does not.

## Original README

# tensorflow-image-recognition-chrome-extension
Chrome browser extension for using TensorFlow image recognition on web pages

This is a simple test on how to use TensorFlow.js image recognition in Google Chrome extension. This extension is intercepting all image fetch requests made by the browser and pushing them to TensorFlow pretrained ImageNet model (mobilenet_v1_0.25_244) to recognize items in images. The model is downloaded when the extension is started. After that it will start automatically modifying IMG element title (mouse hover text) html attribute to display image URL, original title and prediction results.

It will only run the recognition if width or height of the image is larger than 128px. It fails to update the title sometimes when there is some fancy lazyloading module (or some other js manipulation) used on page or the images are embedded (data:image/png;base64, ...). You can inspect the background page view (on chrome extensions page) to see more information about what is happening behind the scenes.

## How to try it?

```sh
git clone https://github.com/JK0N/tensorflow-image-recognition-chrome-extension.git
```

```sh
cd tensorflow-image-recognition-chrome-extension/
```

```sh
npm i
```

```sh
npm run build
```

- Open Google Chrome extensions page: chrome://extensions/

- Enable developer mode

- Click [LOAD UNPACKED]

- Select tensorflow-image-recognition-chrome-extension/dist/ -folder!

- Hover over images on web pages to display image recognition details.


## Examples

<p>
  <img src="https://raw.githubusercontent.com/JK0N/tensorflow-image-recognition-chrome-extension/master/examples/lion-fish.png" />
  <b>Lion fish</b>
</p>

<p>
  <img src="https://raw.githubusercontent.com/JK0N/tensorflow-image-recognition-chrome-extension/master/examples/hotdog.png" />
  <b>Hot dog</b>
</p>
