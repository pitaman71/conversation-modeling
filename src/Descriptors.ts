/** Descriptors.ts
 */

import { Domain } from 'typescript-introspection';
import { Properties, Relations } from './Entities';
import { Stream as FactStream } from './Facts';

/** When
 * One kind of clause that may appear inside of an intent descriptor.
 * Describes the conditions under which this intent may be accesssed,
 * negotiated, and executed as an app command.
 */
export interface When<PersistentEntityIdentifier, AnchorType extends Record<symbol, PersistentEntityIdentifier>> {
    soft?: string|string[],
    hard?: (anchor: AnchorType) => Promise<boolean>
};
  
/** Action
 * One kind of clause that may appear inside of an intent descriptor.
 * Describes one of possibly several discrete outcomes that may occur.
 * 'GET': fetch data from persistent storage
 * 'UPDATE': save data to persistent storage
 * 'DELETE': delete entities in persistent storage
 * 'SHOW': reveal a visualization in the UI
 */
export interface Action<
  PersistentEntityIdentifier, 
  AnchorType extends Record<symbol, PersistentEntityIdentifier>,
  PropertiesType extends Properties<symbol>,
  RelationsType extends Relations<symbol>
> {
    name: string;
    category: 'GET'|'UPDATE'|'DELETE'|'SHOW';
    when: When<PersistentEntityIdentifier, AnchorType>[], // conditions under which this outcome should be deemed to have been reached
    then: (anchor: AnchorType, facts: FactStream<PersistentEntityIdentifier, AnchorType, PropertiesType, RelationsType>) => Promise<{ anchor: AnchorType, facts: FactStream<PersistentEntityIdentifier, AnchorType, PropertiesType, RelationsType> }>
};

export type Anchor<
    RequiredSymbols extends symbol, 
    CorrelatedSymbols extends symbol,
    EnumeratedSymbols extends symbol,
> = Record<RequiredSymbols, {
    type: 'required',
    description: string; // what is the role or purpose of this formal symbol?
}>|Record<CorrelatedSymbols, {
    type: 'correlated',
    description: string; // what is the role or purpose of this formal symbol?
}>|Record<EnumeratedSymbols, {
    type: 'enumerated',
    description: string; // what is the role or purpose of this formal symbol?
}>;

/** Intent
 * A complete specification for a type of intent, including the persistent object symbols 
 * that must be bound (if any), and flow instructions describing how the conversational agent
 * should negotiate details with the user, get approval if necessary, execute the intent,
 * and keep the user informed when execution of the intent succeeds or fails.
 */
export interface Intent<
    PersistentEntityIdentifier, 
    AnchorType extends Record<symbol, PersistentEntityIdentifier>> {
    name: string, // Fully-qualified name of this descriptor
    purpose: string|string[], // human-readable description of the purpose of the intent being described
    anchor: Record<keyof AnchorType, { description: string }>, // formal symbols that must be bound
    enable: When<PersistentEntityIdentifier, AnchorType>[],
    reminder: When<PersistentEntityIdentifier, AnchorType>[],
    actions: Action<PersistentEntityIdentifier, AnchorType, any, any>[]
}

export interface Feature<PersistentEntityIdentifier> {
    intents: Record<string, Intent<PersistentEntityIdentifier, any>>;
};

export interface File<PersistentEntityIdentifier> {
    features: Record<string, Feature<PersistentEntityIdentifier>>;
}

export interface Property<
    PersistentEntityIdentifier, 
    AnchorType extends Record<symbol, PersistentEntityIdentifier>,
    ValueType extends any
> {
    name: string; // global name of the property
    description: string // purpose and meaning of this property and the value(s) it stores
    anchor: Record<keyof AnchorType, {
        description: string // role of this anchor symbol
    }>, elementDomain: Domain<ValueType>
}

export interface Relation<
    PersistentEntityIdentifier, 
    AnchorType extends Record<symbol, PersistentEntityIdentifier>, 
    EntryType extends Omit<Record<symbol, PersistentEntityIdentifier>, keyof AnchorType>
> {
    name: string; // global name of the property
    description: string // purpose and meaning of this property and the value(s) it stores
    anchor: Record<keyof AnchorType, {
      description: string // role of this anchor symbol
    }>;
    entry: Record<keyof EntryType, {
      description: string // role of this entry symbol
    }>;
}
