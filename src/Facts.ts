/** Facts.ts */
import { Properties, Property as PropertyEntity, Relation as RelationEntity, Relations } from './Entities';
type ActionCodes = 'clear'|'assign'|'insert'|'remove';

/** OfScalar
 * Updates the value of a scalar-bearing property entity in persistent storage
 */
export type OfScalar<
  PersistentEntityIdentifier, 
  AnchorType extends Record<symbol, PersistentEntityIdentifier>, 
  ValueType
> = PropertyEntity<PersistentEntityIdentifier, AnchorType, ValueType> & {
    assign?: ValueType;
    clear?: {};
}

/** OfSet
 * Updates the value of a set-bearing property entity in persistent storage
 */
export type OfSet<
  PersistentEntityIdentifier, 
  AnchorType extends Record<symbol, PersistentEntityIdentifier>, 
  ValueType
> = PropertyEntity<PersistentEntityIdentifier, AnchorType, ValueType> & {
    assign?: Set<ValueType>;
    clear?: {};
    remove?: Set<ValueType>;
    insert?: Set<ValueType>;
}

/** OfSequence
 * Updates the value of a sequence-bearing property entity in persistent storage
 */
export type OfSequence<
  PersistentEntityIdentifier, 
  AnchorType extends Record<symbol, PersistentEntityIdentifier>, 
  ValueType,
> = PropertyEntity<PersistentEntityIdentifier, AnchorType, ValueType> & {
    assign?: Array<ValueType>;
    clear?: {};
    remove?: Array<ValueType>;
    append?: { after: ValueType|undefined, values: Array<ValueType> };
    prepend?: { before: ValueType|undefined, values: Array<ValueType> };
}

/** OfRelation
 * Updates the value of a scalable relation entity in persistent storage
 */
export type OfRelation<
  PersistentEntityIdentifier, 
  AnchorType extends Record<symbol, PersistentEntityIdentifier>, 
  EntryType extends Omit<Record<symbol, PersistentEntityIdentifier>, keyof AnchorType>
> = RelationEntity<PersistentEntityIdentifier, AnchorType, EntryType> & {
    assign?: Array<EntryType>; // removes all existing entries then assigns the to the entries provided
    clear?: {}; // removes all existing entries
    remove?: Array<EntryType>; // removes selected entries
    insert?: Array<EntryType>; // inserts additional entries
}

export interface Any<
  PersistentEntityIdentifier, 
  AnchorType extends Record<symbol, PersistentEntityIdentifier>,
  ValueType
> {
  scalar?: OfScalar<PersistentEntityIdentifier, AnchorType, any>,
  set?: OfSet<PersistentEntityIdentifier, AnchorType, any>,
  sequence?: OfSequence<PersistentEntityIdentifier, AnchorType, any>,
  relation?: ValueType extends Record<symbol, PersistentEntityIdentifier> ? OfRelation<PersistentEntityIdentifier, AnchorType, any> : undefined,
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
  PersistentEntityIdentifier
> {
    anchor: Record<symbol, PersistentEntityIdentifier>,
    properties: Properties<symbol>, // for every property entity being accessed, a descriptor and binding for that entity
    relation: Relations<symbol>,    // for every relation entity being accessed, a descriptor and binding for that entity
    facts: Any<PersistentEntityIdentifier, any, any>[] // present or future state of the entities included in this.properties and this.relations
}
