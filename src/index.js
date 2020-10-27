import ImageField from 'Images/field.png';

const canvas = document.getElementById('viewport');
const context = canvas.getContext('2d');

const image = new Image();
image.src = ImageField;
image.onload = () => {
  context.drawImage(image, 0, 0, 300, 400);
};
