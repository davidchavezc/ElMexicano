    async function loadImages() {
      const res = await fetch('/media');
      const data = await res.json();
      const select = document.getElementById('imageSelect');
      select.innerHTML = '<option value="">Selecciona una imagen</option>';
      data.images.forEach(img => {
        const opt = document.createElement('option');
        opt.value = img;
        opt.textContent = img;
        select.appendChild(opt);
      });
    }

    function showImage() {
      const imgName = document.getElementById('imageSelect').value;
      const imgTag = document.getElementById('previewImg');
      if (imgName) {
        imgTag.src = '/img/' + imgName;
        imgTag.style.display = 'block';
      } else {
        imgTag.style.display = 'none';
      }
    }

    window.onload = loadImages;