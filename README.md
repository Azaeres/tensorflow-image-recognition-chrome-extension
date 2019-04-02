# tensorflow-image-recognition-chrome-extension

This fork is to demonstrate a bug with the Tensorflow.js library.
Conditions to reproduce:
* On Chromebook, ChromeOS extension.
* WebGL backend only.
* Batch image predictions only (the first prediction in each batch is consistently correct).

**Instructions:**

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
  To open a report generated against the CPU backend, run the following in the extension's background page console:

```js
__useCpuBackend()
```

- To open a report generated against the WebGL backend, run the following in the extension's background page console:

```js
__useWebGlBackend()
```

On a Chromebook, compare prediction results between the WebGL report and the CPU. For example, I'm getting the following:

```json
{
"meta":{
"userAgent":"Mozilla/5.0(X11;CrOSx86_6411151.113.0)AppleWebKit/537.36(KHTML,likeGecko)Chrome/71.0.3578.127Safari/537.36",
"tensorflow":{
"tfjs-core":"1.0.3",
"tfjs-data":"1.0.3",
"tfjs-layers":"1.0.3",
"tfjs-converter":"1.0.3",
"tfjs":"1.0.3"
},
"backend":"webgl"
},
"TeslaCat:https://r.hswstatic.com/w_907/gif/tesla-cat.jpg":[
{
"probability":0.16494502127170563,
"className":"velvet"
},
{
"probability":0.09491492062807083,
"className":"windowscreen"
},
{
"probability":0.05020033195614815,
"className":"theatercurtain,theatrecurtain"
},
{
"probability":0.04693294316530228,
"className":"digitalclock"
},
{
"probability":0.037753134965896606,
"className":"spaceheater"
},
{
"probability":0.03272269293665886,
"className":"windowshade"
},
{
"probability":0.02653188817203045,
"className":"honeycomb"
},
{
"probability":0.024251466616988182,
"className":"doormat,welcomemat"
},
{
"probability":0.023848969489336014,
"className":"strainer"
},
{
"probability":0.02221301943063736,
"className":"dishrag,dishcloth"
}
]}
```

```json
{
"meta":{
"userAgent":"Mozilla/5.0(X11;CrOSx86_6411151.113.0)AppleWebKit/537.36(KHTML,likeGecko)Chrome/71.0.3578.127Safari/537.36",
"tensorflow":{
"tfjs-core":"1.0.3",
"tfjs-data":"1.0.3",
"tfjs-layers":"1.0.3",
"tfjs-converter":"1.0.3",
"tfjs":"1.0.3"
},
"backend":"cpu"
},
"TeslaCat:https://r.hswstatic.com/w_907/gif/tesla-cat.jpg":[
{
"probability":0.5521813631057739,
"className":"Egyptiancat"
},
{
"probability":0.10373528301715851,
"className":"tabby,tabbycat"
},
{
"probability":0.07581817358732224,
"className":"tigercat"
},
{
"probability":0.06736601144075394,
"className":"Siamesecat,Siamese"
},
{
"probability":0.05536174029111862,
"className":"schipperke"
},
{
"probability":0.031074585393071175,
"className":"groenendael"
},
{
"probability":0.014214071445167065,
"className":"Bostonbull,Bostonterrier"
},
{
"probability":0.013818344101309776,
"className":"lynx,catamount"
},
{
"probability":0.006884398404508829,
"className":"Scotchterrier,Scottishterrier,Scottie"
},
{
"probability":0.006883499212563038,
"className":"carton"
}
]}
```

Note that the CPU report features the predictions we expect, and the WebGL report does not. In my tests, the first predictions in the batch actually match correctly, but all other predictions do not. The example above is not the full batch; it's just one item that's been hand-selected from a batch.

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
