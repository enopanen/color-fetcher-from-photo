

<h1>Upload an Image to Find Its Dominant Colors</h1>
<input type="file" id="imageInput">

<div id="result"></div>

<script>
  // Function to convert RGB to HEX
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
  }

  // Function to get the dominant colors of an image
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
    const topColors = sortedColors.slice(0, 3).map(([color]) => {
      const [r, g, b] = color.split(',').map(Number);
      return rgbToHex(r, g, b);
    });

    document.getElementById('result').innerHTML = `Dominant Colors: ${topColors.join(', ')}`;
  }

  // Handle image upload
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

