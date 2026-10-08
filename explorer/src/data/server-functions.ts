import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { loadConversations } from './conversations';
import { loadEvents } from './events';
import { loadGroupQuestions } from './group-questions';

export const getConversations = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .handler(loadConversations);

export const getConversation = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const conversation = (await loadConversations()).find(
      conversation => conversation.id === id
    );
    if (!conversation) throw notFound();
    return conversation;
  });

export const getEvents = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .handler(loadEvents);

export const getGroupQuestions = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .handler(loadGroupQuestions);
