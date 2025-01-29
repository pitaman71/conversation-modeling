/** Entities.ts */

import { Property as PropertyDescriptor, Relation as RelationDescriptor } from './Descriptors';

/** Property
 * binds a property descriptor (of type Descriptors.Property) to a specific instance of that property in persistent storage
 */
export interface Property<
    PersistentEntityIdentifier, 
    AnchorType extends Record<symbol, PersistentEntityIdentifier>,
    ValueType extends any
> {
    descriptor: PropertyDescriptor<PersistentEntityIdentifier, AnchorType, ValueType>;
    anchor: AnchorType;
}

/** Relation
 * binds a relation descriptor (of type Descriptors.Relation) to a specific instance of that relation in persistent storage
 */
export interface Relation<
    PersistentEntityIdentifier, 
    AnchorType extends Record<symbol, PersistentEntityIdentifier>, 
    EntryType extends Omit<Record<symbol, PersistentEntityIdentifier>, keyof AnchorType>
> {
    descriptor: RelationDescriptor<PersistentEntityIdentifier, AnchorType, EntryType>;
    anchor: AnchorType;
}

export type Properties<KeyT extends symbol> = Record<KeyT, Property<any, any, any>>; 
export type Relations<KeyT extends symbol> = Record<KeyT, Relation<any, any, any>>;

