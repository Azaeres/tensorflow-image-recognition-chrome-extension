import 'babel-polyfill';
import * as tf from '@tensorflow/tfjs';
import { IMAGENET_CLASSES } from './imagenet_classes';

const MOBILENET_MODEL_PATH =
  'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';
const IMAGE_SIZE = 224;
const TOPK_PREDICTIONS = 10;
const CLASS_COUNT = 1000;

const IMAGE_SRC_ARR = [
  ImagePkg(
    'Spiral animation',
    'http://www.benhalsall.com/wp-content/uploads/2017/01/Spiral-Loop.gif'
  ),
  ImagePkg(
    'Jennifer Lawrence',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUcLNL78hxONtnZn5vqfJ2aPS8YfHHjSB8CkJcgJrbMxeygbSaGg'
  ),
  ImagePkg(
    'Model',
    'https://tse1.mm.bing.net/th?id=OIP.e6LC9mv3-shh8daY1CJJUwHaEK&pid=15.1&P=0&w=340&h=192'
  ),
  ImagePkg(
    'Swimming',
    'https://images.unsplash.com/photo-1496672541024-d5ffffdfa045?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1673be41c776e0c5c58a320f79469b82&auto=format&fit=crop&w=400&q=60'
  ),
  ImagePkg('Tesla Cat', 'https://r.hswstatic.com/w_907/gif/tesla-cat.jpg'),
  ImagePkg(
    'Taylor Swift Gang',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRnjw__jZZiaAPmxKupjFZGGVgBtiNtXF0w8YVRg8xgJ1-ZrJu'
  ),
  ImagePkg(
    'Bora Bora',
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b16763e034eaaf931f271fc16dd60069&w=1000&q=80'
  )
];

const backend = (() => {
  // Maps localStorage backend value => tensorflow backend value
  switch (localStorage.getItem('TF_BACKEND')) {
    case 'CPU':
      return 'cpu';
      break;
    case 'WEBGL':
    default:
      return 'webgl';
  }
})();
tf.setBackend(backend);

class BackgroundProcessing {
  constructor() {
    const meta = {
      userAgent: navigator && navigator.userAgent,
      tensorflow: tf.version,
      backend: tf.getBackend()
    };
    console.info('User agent:', meta.userAgent);
    console.info('Tensorflow.js', meta.tensorflow);
    console.info(
      `To generate the prediction report using the CPU backend, run: __useCpuBackend()`
    );
    console.info(
      `To generate the prediction report using the WebGL backend, run: __useWebGlBackend()`
    );
    this.loadModel().then(async () => {
      console.info('Generating report using backend:', meta.backend);
      const batchImages = await this.loadBatchImages(IMAGE_SRC_ARR);
      const predictions = await this.predictBatch(batchImages);
      const output = { meta };
      predictions.forEach((item, i) => {
        output[`${IMAGE_SRC_ARR[i].desc}: ${IMAGE_SRC_ARR[i].src}`] = item;
      }, {});
      console.info('Opening report in separate tab...');
      chrome.tabs.create({
        url: `data:application/json,${JSON.stringify(output, null, 2)}`
      });
    });
    // Attach tensorflow to the window so it's available to inspect from the console.
    window.__tf = tf;

    // Provides a tool that sets the backend to `cpu` and reloads.
    window.__useCpuBackend = () => {
      localStorage.setItem('TF_BACKEND', 'CPU');
      chrome &&
        chrome.runtime &&
        chrome.runtime.reload &&
        chrome.runtime.reload();
    };
    // Provides a tool that sets the backend to `webgl` and reloads.
    window.__useWebGlBackend = () => {
      localStorage.setItem('TF_BACKEND', 'WEBGL');
      chrome &&
        chrome.runtime &&
        chrome.runtime.reload &&
        chrome.runtime.reload();
    };
  }

  async loadModel() {
    console.log('Loading model...');
    const startTime = performance.now();
    this.model = await tf.loadModel(MOBILENET_MODEL_PATH);
    this.model.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();

    const totalTime = Math.floor(performance.now() - startTime);
    console.log(`Model loaded and initialized in ${totalTime}ms...`);
  }

  async loadImage(src) {
    return new Promise(resolve => {
      var img = document.createElement('img');
      img.onerror = function(e) {
        resolve(null);
      };
      img.onload = function(e) {
        if (
          (img.height && img.height > 128) ||
          (img.width && img.width > 128)
        ) {
          // Set image size for tf!
          img.width = IMAGE_SIZE;
          img.height = IMAGE_SIZE;
          resolve(img);
        }
        // Let's skip all tiny images
        resolve(null);
      };
      img.src = src;
    });
  }

  async predictBatch(imgElements) {
    const logits = tf.tidy(() => {
      const offset = tf.scalar(127.5);
      const batchedArray = imgElements.map(imgElement => {
        const img = tf.fromPixels(imgElement).toFloat();
        const normalized = img.sub(offset).div(offset);
        return normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
      });
      const batched = tf.concat(batchedArray, 0);
      return this.model.predictOnBatch(batched);
    });

    const data = await logits.data();
    // `data` includes predictions for every category/class.
    // Since there are 1000 categories here, that means there are 1000 entries
    //  per image in the batch. 1000 classes * 7 images => 7000 entries
    // `[...data]` is used below to convert a `Float32Array` to an array that can
    //   contain mixed types.
    return mapN([...data], CLASS_COUNT, (chunk, index) => {
      const predictionsPerChunk = chunk
        .map((prob, i) => {
          const result = {
            probability: prob,
            className: IMAGENET_CLASSES[i]
          };
          return result;
        })
        .sort((a, b) => b.probability - a.probability)
        .slice(0, TOPK_PREDICTIONS);
      return predictionsPerChunk;
    });
  }

  async loadBatchImages(srcArray) {
    const imageArray = srcArray.map(({ src }) => {
      return this.loadImage(src);
    });
    return Promise.all(imageArray);
  }
}

var bg = new BackgroundProcessing();

// Iterates over chunks of size N (nChunkSize).
// Calls `fn` for each chunk.
// Assumes the count of data entries is a multiple of N.
function mapN(data, nChunkSize, fn) {
  let result = [];
  let chunkIndex = 0;
  for (let dataIndex = 0; dataIndex < data.length; dataIndex += nChunkSize) {
    const subset = data.slice(dataIndex, dataIndex + nChunkSize);
    result = [...result, fn(subset, chunkIndex++)];
  }
  return result;
}

function ImagePkg(desc, src) {
  return { desc, src };
}
