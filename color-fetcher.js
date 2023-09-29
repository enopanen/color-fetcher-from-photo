  <script src="https://cdnjs.cloudflare.com/ajax/libs/vibrant.js/1.0.0/Vibrant.min.js"></script>
  <style>
    .color-swatch {
      width: 50px;
      height: 50px;
      display: inline-block;
      margin: 5px;
      text-align: center;
      vertical-align: top;
      font-size: 12px;
    }
  </style>
</head>
<body>

<h1>Upload an Image to Find Its Dominant Colors</h1>
<input type="file" id="imageInput">
<div id="result"></div>

<script>
  function displaySwatches(swatches) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Dominant Colors: ';
    
    Object.values(swatches).forEach(swatch => {
      if (swatch) {
        const color = swatch.getHex();
        const div = document.createElement('div');
        div.className = 'color-swatch';
        div.style.backgroundColor = color;
        div.innerHTML = `<br>${color}`;
        resultDiv.appendChild(div);
      }
    });
  }

  document.getElementById('imageInput').addEventListener('change', function() {
    const file = this.files[0];
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(e) {
      img.src = e.target.result;
      img.onload = function() {
        const vibrant = new Vibrant(img);
        const swatches = vibrant.swatches();
        displaySwatches(swatches);
      };
    };

    reader.readAsDataURL(file);
  });
</script>
