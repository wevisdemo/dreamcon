import type { Conversation } from '../data/conversations';
import type { Event } from '../data/events';

/** Selected participant types, or a single event */
export type EventSelection =
  | { targetGroupTypes: string[] }
  | { eventId: string };

/**
 * Checks whether an untrusted value, like a search param, is an event
 * selection.
 *
 * @param value - Value to check
 * @returns `true` when `value` has a string `eventId` or a list of string
 * `targetGroupTypes`
 */
export const isEventSelection = (value: unknown): value is EventSelection =>
  typeof value === 'object' &&
  value !== null &&
  (('eventId' in value && typeof value.eventId === 'string') ||
    ('targetGroupTypes' in value &&
      Array.isArray(value.targetGroupTypes) &&
      value.targetGroupTypes.every(type => typeof type === 'string')));

/**
 * Counts the topics that came from an event.
 *
 * @param conversations - Topics to count
 * @param eventId - Id of the event
 * @returns How many of `conversations` have the event among their `eventIds`
 */
export const countEventTopics = (
  conversations: Pick<Conversation, 'eventIds'>[],
  eventId: string
) => conversations.filter(({ eventIds }) => eventIds.includes(eventId)).length;

/**
 * Lists the participant types across events.
 *
 * @param events - Events to collect from
 * @returns Each participant type once, in order of first appearance
 */
export const getTargetGroupTypes = (events: Pick<Event, 'targetGroup'>[]) => [
  ...new Set(events.flatMap(({ targetGroup }) => targetGroup.types)),
];

/**
 * Orders events by date.
 *
 * @param events - Events to order
 * @returns A copy of `events`, newest first
 */
export const sortEventsByDate = <T extends Pick<Event, 'date'>>(events: T[]) =>
  events.toSorted((a, b) => b.date.getTime() - a.date.getTime());

/**
 * Checks whether a topic falls in the event selection.
 *
 * @param topic - Events the topic or any of its nested comments came from, and
 * their participant types
 * @param selection - Selected participant types or event
 * @returns `true` when the topic or any nested comment came from the selected
 * event, or from an event with any of the selected participant types
 */
export const matchesEventSelection = (
  {
    eventIds,
    targetGroupTypes,
  }: { eventIds: string[]; targetGroupTypes: string[] },
  selection: EventSelection
) =>
  'eventId' in selection
    ? eventIds.includes(selection.eventId)
    : selection.targetGroupTypes.some(type => targetGroupTypes.includes(type));

/**
 * Lists the participant types in the event selection.
 *
 * @param selection - Selected participant types or event, if any
 * @returns The selected participant types, or an empty list when an event or
 * nothing is selected
 */
export const getSelectedTargetGroupTypes = (selection?: EventSelection) =>
  selection && 'targetGroupTypes' in selection
    ? selection.targetGroupTypes
    : [];

/**
 * Describes the event selection for display.
 *
 * @param events - Events to look the selected event up in
 * @param selection - Selected participant types or event
 * @returns The event's display name when an event is selected, otherwise the
 * participant types separated by commas
 */
export const formatEventSelection = (
  events: Pick<Event, 'id' | 'displayName'>[],
  selection: EventSelection
) =>
  'eventId' in selection
    ? (events.find(({ id }) => id === selection.eventId)?.displayName ?? '')
    : selection.targetGroupTypes.join(' | ');
