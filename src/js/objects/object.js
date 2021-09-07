import Build from '../build';
import gameObjectList from '../game-object-list';
import { $ } from '../util';

export default function GameObject(props) {
  this.w = props.w ?? 1;
  this.h = props.h ?? 1;
  this.d = props.d ?? 1;
  this.x = props.x ?? 0;
  this.y = props.y ?? 0;
  this.z = props.z ?? 0;
  this.rx = props.rx ?? 0;
  this.ry = props.ry ?? 0;
  this.rz = props.rz ?? 0;
}

/**
 * Update a game object to change it's position, recalculate lighting, etc.
 * @param  {[type]} elapsed               [description]
 * @param  {[type]} lights                [description]
 */
GameObject.prototype.update = function (elapsed, lights) {
  this.model.update(elapsed, lights);
};

/**
 * Add the shape to the gameworld by appending it's element to the DOM
 */
GameObject.prototype.spawn = function () {
  this.model.spawn();
  this.update();
};

/* eslint-disable no-nested-ternary */
// TODO: Move ui.createBuildBarHTML to here, or move this to there, or somewhere else?
GameObject.prototype.createSelectedObjectHTML = function () {
  return `
    <div>
      <b>${this.tag}</b>
      <div>M:${this.cost}${this.population ? ` | Pop:${this.population}` : ''}${this.power < 0 ? ` | Use ϟ${-this.power}` : this.power > 0 ? ` | Gen ϟ${this.power}` : ''}</div>
    </div>
    <div>
      ${this.desc}
    </div>
  `;
};

/**
 * Make this game object the selected one
 * @return {[type]} [description]
 */
GameObject.prototype.select = function (select) {
  if (!select) {
    this.selected = select;
    this.model.element.classList.toggle('select', select);
    $('.ui-panel--btns').setAttribute('aria-hidden', false);
    $('.ui-panel__build-info').classList.add('ui-panel__build-info--select');
    $('.ui-panel__build-info').innerHTML = this.createSelectedObjectHTML();
    $('.ui-panel__build-list').innerHTML = '<div></div>';
  }
};

/**
 * Make this game object the selected one
 * @return {[type]} [description]
 */
GameObject.prototype.hover = function (hover) {
  if (!Build.currentItem) {
    this.hovered = hover;
    this.model.element.classList.toggle('hover', hover);
  }
};

/**
 * Add select and hover event listeners the GameObject
 * Assuming all game objects should have event listeners for clicking on them?
 * @return {[type]} [description]
 */
GameObject.prototype.addSelectEventListeners = function () {
  // Assumes every side of the shape should be used for selection
  this.model.sides.forEach((side) => {
    side.element.addEventListener('mouseover', () => {
      this.hover(true);
    });

    side.element.addEventListener('mouseleave', () => {
      this.hover(false);
    });

    side.element.addEventListener('click', () => {
      // You're building something not selecting, do nothing
      if (Build.currentItem) return;

      // Deselect every other GameObject in the list
      gameObjectList.forEach((item) => {
        if (this !== item && item.select) {
          item.select(false);
        }
      });

      // Select this object if it's not already selected
      if (!this.selected) this.select(true);
    });

    side.element.addEventListener('dblclick', () => {
      gameObjectList.forEach((item) => {
        if (this.tag === item.tag && item.select) {
          item.select(true);
        }
      });
    });
  });
};

GameObject.prototype.kill = function () {
  this.model.element?.remove();

  if (this.connectedTo) {
    this.connectedTo.connectedTo = undefined;
  }

  gameObjectList.remove(this);
  // TODO (if space) remove mouse & click event listeners to prevent memory leak
};
