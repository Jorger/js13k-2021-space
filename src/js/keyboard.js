import Build from './build';
import camera from './camera';
import gameObjectList from './game-object-list';
import UI from './ui';

const keys = new Set();

export function initKeyboard() {
  document.addEventListener('keydown', (event) => {
    keys.add(event.key.toLowerCase());
  });

  document.addEventListener('keyup', (event) => {
    keys.delete(event.key.toLowerCase());
  });
}

export function doKeyboardInput() {
  if (keys.has('w')) camera.moveY += 1;
  if (keys.has('a')) camera.moveX -= 1;
  if (keys.has('s')) camera.moveY -= 1;
  if (keys.has('d')) camera.moveX += 1;
  if (keys.has('z')) camera.dZoom += 1;
  if (keys.has('x')) camera.dZoom -= 1;
  if (keys.has('escape')) {
    Build.setCurrentItem(false);
    gameObjectList.forEach((gameObject) => gameObject.select?.(false));
    UI.deselectAllBuildBarItems();
  }
}
