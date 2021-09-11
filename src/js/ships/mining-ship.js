import Sidewinder from '../shapes/sidewinder';
import Ship from './ship';

const info = {
  tag: 'MiningShip',
  desc: 'Mining ship',
  className: 'mining ship',
  cost: 1,
  unlock: true,
};

export default function MiningShip({ x, y, z, parent }) {
  this.model = new Sidewinder({
    w: 40,
    d: 20,
    h: 10,
    x,
    y,
    z,
    className: info.className,
  });

  // TODO: Spawn only in empty bays? Not bay 0?
  Ship.call(this, { x, y, z, parent, ...info });

  // TODO: Swap the "3" for an ID number or string
  this.model.sides[2].element.dataset.text = this.id;
}

Object.assign(MiningShip, info);
MiningShip.prototype = Object.create(Ship.prototype);
MiningShip.prototype.constructor = MiningShip;
