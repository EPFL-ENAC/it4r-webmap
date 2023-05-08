import type { IControl } from 'maplibre-gl'

/**
 * https://maplibre.org/maplibre-gl-js-docs/api/markers/#icontrol
 */
export class DivControl implements IControl {
  public container?: HTMLDivElement

  constructor(
    private options: {
      id: string
    }
  ) {}

  onAdd() {
    this.container = document.createElement('div')
    this.container.className = 'px-3 py-1'
    this.container.id = this.options.id
    return this.container
  }

  onRemove() {
    this.container?.parentNode?.removeChild(this.container)
    this.container = undefined
  }
}
