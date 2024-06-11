import { Map } from 'maplibre-gl';

export abstract class LayerManager<T> {
  
  /**
   * Get the identifier of the managed layer.
   */
  abstract getId(): string;

  /**
   * Add the layer to the map.
   */
  abstract append(map: Map): Promise<void>;

  /**
   * Set the visibility of the layer.
   */
  abstract setVisible(map: Map, visible: boolean): void;

  /**
   * Filter the layer.
   */
  abstract filter(map: Map, filter: T): void;
 
}