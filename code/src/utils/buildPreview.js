export const buildPreview = (html, css, js) => {
  return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <style>${css}</style>
  </head>
  <body>
  ${html}

  <script>
  try {
    ${js}
  } catch (err) {
    const e = document.createElement('pre')
    e.style.color = 'red'
    e.textContent = err
    document.body.appendChild(e)
  }
  </script>

  </body>
  </html>
  `;
};
