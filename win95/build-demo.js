// build-demo.js — genera win95/demo/ con CSS y JS minificados e inlineados
const fs   = require('fs')
const path = require('path')
const { minify: minifyJS } = require('terser')
const CleanCSS = require('clean-css')

const OUT = path.join(__dirname, 'demo')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT)

async function build() {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')
  const css  = fs.readFileSync(path.join(__dirname, 'css/style.css'), 'utf8')
  const js   = fs.readFileSync(path.join(__dirname, 'js/app.js'), 'utf8')

  const minCSS = new CleanCSS({ level: 2 }).minify(css).styles

  const minJS = (await minifyJS(js, {
    compress: { passes: 2 },
    mangle: { toplevel: true },
    output: { comments: false },
  })).code

  // Reemplaza los links externos por estilos/scripts inlineados
  const result = html
    .replace(/<link rel="stylesheet" href="css\/style\.css" \/>/, `<style>${minCSS}</style>`)
    .replace(/<script src="js\/app\.js"><\/script>/, `<script>${minJS}</script>`)

  fs.writeFileSync(path.join(OUT, 'index.html'), result)
  console.log('✓ demo/index.html generado')
}

build().catch(console.error)
