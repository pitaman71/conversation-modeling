/** Facts.ts */
import { Properties, Property as PropertyEntity, Relation as RelationEntity, Relations } from './Entities';
type ActionCodes = 'clear'|'assign'|'insert'|'remove';

/** Property
 * Updates the value of a scalable property entity in persistent storage
 */
export interface Property<
  PersistentEntityIdentifier, 
  AnchorType extends Record<symbol, PersistentEntityIdentifier>, 
  ValueType,
  EntityType extends PropertyEntity<PersistentEntityIdentifier, AnchorType, ValueType>
> {
    entity: EntityType; // fully qualified name of the corresponding property descriptor
    action: ActionCodes; // action to take on the persistent store
    values: ValueType[]
}

/** Relation
 * Updates the value of a scalable relation entity in persistent storage
 */
export interface Relation<
  PersistentEntityIdentifier, 
  AnchorType extends Record<symbol, PersistentEntityIdentifier>, 
  EntryType extends Omit<Record<symbol, PersistentEntityIdentifier>, keyof AnchorType>,
  EntityType extends RelationEntity<PersistentEntityIdentifier, AnchorType, EntryType>
> {
    entity: EntityType; // fully qualified name of the corresponding relation descriptor
    action: ActionCodes; // action to take on the persistent store
    entries: EntryType[]; // binds the remaining object symbols of the property descriptor to a persistent object
}

/** Stream
 * A data dictionary comprising property and relation desriptors, 
 * an anchor binding symbols to entities in persistent storage, 
 * and a collection of property and relation facts which use anchor bindings 
 * as well as descriptors from the data dictionary.
 * 
 * @property properties named collection of bound scalable property entities in persistent store
 * @property relations a named collection of bound scalable relation entities in persistent store
 * for any 0 <= i < Stream.facts.length, there must exist a pn such that Stream.facts[i].entity === Stream.properties[pn] or Stream.facts[i].entity === Stream.relations[pn]
 */
export interface Stream<
  PersistentEntityIdentifier, 
  AnchorType extends Record<symbol, PersistentEntityIdentifier>,
  PropertiesType extends Properties<symbol>,
  RelationsType extends Relations<symbol>
> {
    anchor: AnchorType,
    properties: PropertiesType,
    relation: RelationsType,
    facts: (Property<any, any , any, any>|Relation<any, any, any, any>)[];
}
