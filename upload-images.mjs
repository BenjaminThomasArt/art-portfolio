import { storagePut } from './server/storage.ts';
import fs from 'fs';

async function uploadImages() {
  // Upload Chrysalis I
  const chrysalis1Buffer = fs.readFileSync('/home/ubuntu/upload/Unknown-1.jpeg');
  const chrysalis1Result = await storagePut('gallery/chrysalis-1.jpg', chrysalis1Buffer, 'image/jpeg');
  console.log('Chrysalis I URL:', chrysalis1Result.url);

  // Upload Chrysalis II
  const chrysalis2Buffer = fs.readFileSync('/home/ubuntu/upload/Unknown-3.jpeg');
  const chrysalis2Result = await storagePut('gallery/chrysalis-2.jpg', chrysalis2Buffer, 'image/jpeg');
  console.log('Chrysalis II URL:', chrysalis2Result.url);

  // Upload Candyflip
  const candyflipBuffer = fs.readFileSync('/home/ubuntu/upload/Unknown.png');
  const candyflipResult = await storagePut('shop/candyflip.png', candyflipBuffer, 'image/png');
  console.log('Candyflip URL:', candyflipResult.url);
}

uploadImages();
