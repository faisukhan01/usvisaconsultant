import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/public/images';

const jobs: Array<{ file: string; prompt: string; size: string }> = [
  {
    file: 'about-office.png',
    size: '1344x768',
    prompt:
      'Premium modern visa consultancy office interior, professional consultants in elegant business attire advising smiling clients across a sleek desk, floor-to-ceiling windows with global city skyline, warm golden accent lighting, dark walnut wood panels, world map art on wall, photorealistic, cinematic depth of field, high quality',
  },
  {
    file: 'dest-dubai.png',
    size: '768x1344',
    prompt:
      'Dubai skyline at golden hour with Burj Khalifa towering above, warm amber sunset light, dramatic clouds, photorealistic travel photography, vertical composition, high quality',
  },
  {
    file: 'dest-london.png',
    size: '768x1344',
    prompt:
      'London Big Ben and Houses of Parliament at dusk with warm golden lights, Thames river reflection, moody sky, photorealistic travel photography, vertical composition, high quality',
  },
  {
    file: 'dest-newyork.png',
    size: '768x1344',
    prompt:
      'New York City Manhattan skyline with Empire State Building at sunset, warm golden hour glow, dramatic clouds, photorealistic travel photography, vertical composition, high quality',
  },
  {
    file: 'dest-toronto.png',
    size: '768x1344',
    prompt:
      'Toronto skyline with CN Tower at sunset, warm orange and gold sky, Lake Ontario reflection, photorealistic travel photography, vertical composition, high quality',
  },
  {
    file: 'dest-sydney.png',
    size: '768x1344',
    prompt:
      'Sydney Opera House and Harbour Bridge at golden sunset, warm light on white sails, sparkling harbour water, photorealistic travel photography, vertical composition, high quality',
  },
  {
    file: 'dest-schengen.png',
    size: '768x1344',
    prompt:
      'Paris Eiffel Tower at golden sunrise, warm amber sky, elegant Parisian rooftops, soft mist, photorealistic travel photography, vertical composition, high quality',
  },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const zai = await ZAI.create();

  const results = await Promise.all(
    jobs.map(async (job) => {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await zai.images.generations.create({
            prompt: job.prompt,
            size: job.size,
          });
          const base64 = response.data[0].base64;
          if (!base64) throw new Error('no image data');
          const buffer = Buffer.from(base64, 'base64');
          const out = path.join(OUT_DIR, job.file);
          fs.writeFileSync(out, buffer);
          return `OK ${job.file} (${(buffer.length / 1024).toFixed(0)} KB)`;
        } catch (e) {
          if (attempt === 2) return `FAIL ${job.file}: ${e.message}`;
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
      return `FAIL ${job.file}`;
    })
  );

  console.log(results.join('\n'));
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
