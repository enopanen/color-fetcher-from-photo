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

<h1>Upload an Image to Find Its Dominant Colors</h1>
<input type="file" id="imageInput">
<div id="result"></div>

<script>
  function rgbToHex(r, g, b) {
    r = Math.round(r);
    g = Math.round(g);
    b = Math.round(b);
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
  }

  function colorDistance(color1, color2) {
    return Math.sqrt(
      Math.pow(color1[0] - color2[0], 2) +
      Math.pow(color1[1] - color2[1], 2) +
      Math.pow(color1[2] - color2[2], 2)
    );
  }

  function kMeans(colors, k = 3) {
    let centroids = colors.slice(0, k);
    let clusters = [];

    for (let i = 0; i < k; i++) {
      clusters[i] = [];
    }

    colors.forEach(color => {
      let minDistance = Infinity;
      let clusterIndex = 0;

      centroids.forEach((centroid, index) => {
        const distance = colorDistance(color, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          clusterIndex = index;
        }
      });

      clusters[clusterIndex].push(color);
    });

    centroids = clusters.map(cluster =>
      cluster.reduce((acc, color) => {
        acc[0] += color[0];
        acc[1] += color[1];
        acc[2] += color[2];
        return acc;
      }, [0, 0, 0])
    );

    centroids.forEach((sum, index) => {
      const count = clusters[index].length;
      centroids[index] = [sum[0] / count, sum[1] / count, sum[2] / count];
    });

    return centroids;
  }

  function isVibrant([r, g, b]) {
    return r > 50 && g > 50 && b > 50;
  }

  function displaySwatches(colors) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Dominant Colors: ';
    
    colors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = color;
      swatch.innerHTML = `<br>${color}`;
      resultDiv.appendChild(swatch);
    });
  }

  function getDominantColors(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorMap = {};

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const rgb = `${r},${g},${b}`;

      colorMap[rgb] = (colorMap[rgb] || 0) + 1;
    }

    const sortedColors = Object.entries(colorMap).sort((a, b) => b[1] - a[1]);
    const rgbColors = sortedColors.map(([color]) => color.split(',').map(Number));

    const vibrantColors = rgbColors.filter(isVibrant);
    const dominantColors = kMeans(vibrantColors.length > 0 ? vibrantColors : rgbColors);
    const hexColors = dominantColors.map(color => rgbToHex(...color));

    displaySwatches(hexColors);
  }

  document.getElementById('imageInput').addEventListener('change', function() {
    const file = this.files[0];
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(e) {
      img.src = e.target.result;
      img.onload = function() {
        getDominantColors(img);
      };
    };

    reader.readAsDataURL(file);
  });
</script>
