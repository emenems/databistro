# data bistro

[databistro.eu](www.databistro.eu) blog source code

## Technologies

* [FastAPI](https://fastapi.tiangolo.com) backend
* [Next.js](http://nextjs.org) framework
* [Vercel](http://vercel.com/templates) deployment
* [Tremor](https://www.tremor.so/docs/getting-started/installation) dashboard components
* [Tailwind](https://tailwindcss.com) CSS

## Templates used

* Frontend template [blog-starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter)
* Backend tempalte [nextjs-fastapi](https://github.com/digitros/nextjs-fastapi)

## How to run

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
git clone https://github.com/emenems/databistro

cd databistro

npm install

npm run dev
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000). The backend will be accessible on [http://localhost:8000](http://localhost:8000)

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## How to add posts

1. add new markdown file to `_posts` folder
2. add new blog assests (images) to `public/assets/blog/images/<blogName>`
3. if a datablog with components, crete them in the `src/app/_components` folder
4. if a datablog, import & use the `src/app/_components/<blogName>/page.tsx` component in `src/app/posts/[slug]/page.tsx` file 
