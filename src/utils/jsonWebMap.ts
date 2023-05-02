import type { LngLatLike } from 'maplibre-gl'
import type { SelectableItem } from './layerSelector'

export interface Parameters {
  /**
   * Map default center coordinates
   */
  center?: LngLatLike
  /**
   * Map default zoom level
   */
  zoom?: number
  /**
   * Layers with popup
   */
  popupLayerIds?: string[]
  /**
   * Selectable layers organization
   */
  selectableItems?: SelectableItem[]
  /**
   * Title of the map
   */
  title?: string
  /**
   * Subtitle of the map
   */
  subtitle?: string
}
