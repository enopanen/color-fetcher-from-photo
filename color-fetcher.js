
  <title>Dominant Color Finder</title>
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


<h1>Upload an Image to Find Its Dominant Colors</h1>
<input type="file" id="imageInput">
<div id="result"></div>

<script>
  const colorGroups = {
    "Black": ["#000000", "#1a1a1a"],
    "Blue": ["#0000cc", "#1E90FF"],
    "Bronze": ["#b87333", "#DAA520"],
    "Brown": ["#8b4513", "#A52A2A"],
    "Burgundy": ["#6a0dad", "#960018"],
    "Charcoal": ["#2c3e50", "#36454F"],
    "Dark Gray": ["#696969", "#A9A9A9"],
    "Gold": ["#daa520", "#FFD700"],
    "Gray": ["#696969", "#B0B0B0"],
    "Green": ["#006400", "#00FF00"],
    "Magenta": ["#ff00cc", "#FF1493"],
    "Mauve": ["#c17e91", "#D8BFD8"],
    "Navy Blue": ["#000066", "#191970"],
    "Ochre": ["#cc5500", "#C36241"],
    "Orange": ["#ff6600", "#FF8C00"],
    "Peach": ["#ffc08a", "#FFDAB9"],
    "Pink": ["#ff66b2", "#FF69B4"],
    "Purple": ["#660066", "#9932CC"],
    "Red": ["#cc0000", "#FF4500"],
    "Rust": ["#8b0000", "#DA2C43"],
    "Taupe": ["#3d2b1f", "#918151"],
    "Teal": ["#006666", "#20B2AA"],
    "White": ["#f0f0f0", "#FFFFFF"],
    "Yellow": ["#cccc00", "#FFD700"],
    "Beige": ["#e6d8ad", "#FAEBD7"],
    "Ivory": ["#ffffe0", "#FFF5E1"],
    "Tan": ["#c19a6b", "#F4A460"]
  };
  
  
   function findClosestColorGroup(hex) {
    let closestGroup = "Unknown";
    let minDistance = Infinity;

    Object.keys(colorGroups).forEach(group => {
      colorGroups[group].forEach(color => {
        const distance = colorDistance(hex, color);
        if (distance < minDistance) {
          minDistance = distance;
          closestGroup = group;
        }
      });
    });

    return closestGroup;
  }

  function colorDistance(hex1, hex2) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function displaySwatches(swatches) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = 'Dominant Colors: ';
    
    Object.values(swatches).forEach(swatch => {
      if (swatch) {
        const hex = swatch.getHex();
        const colorGroup = findClosestColorGroup(hex);
        const div = document.createElement('div');
        div.className = 'color-swatch';
        div.style.backgroundColor = hex;
        div.innerHTML = `<br>${colorGroup}`;
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

