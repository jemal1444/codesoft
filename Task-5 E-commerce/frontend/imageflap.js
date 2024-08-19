<script>
  let index = 0;
  const images = document.querySelectorAll('.flap img');
  const totalImages = images.length;
  const flap = document.querySelector('.flap');

  function slide() {
    index = (index + 1) % totalImages;
    flap.style.transform = `translateX(-${index * (100 / totalImages)}%)`;
  }

  setInterval(slide, 3000); // Change image every 3 seconds
</script>
