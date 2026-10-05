import { createFileRoute, Link } from '@tanstack/react-router';
import { getConversations, type Comment } from '../data/conversations';
import { getEvents } from '../data/events';
import { getGroupQuestions } from '../data/group-questions';

const countComments = (comments: Comment[]): number =>
  comments.reduce(
    (total, { comments }) => total + 1 + countComments(comments),
    0
  );

export const Route = createFileRoute('/')({
  loader: async () => {
    const [events, conversations, groupQuestions] = await Promise.all([
      getEvents(),
      getConversations(),
      getGroupQuestions(),
    ]);
    return { events, conversations, groupQuestions };
  },
  component: function Home() {
    const { events, conversations, groupQuestions } = Route.useLoaderData();
    return (
      <main className="p-8">
        <h1 className="text-h5 font-bold">Dream Constitution</h1>
        <p>
          {events.length} events, {conversations.length} conversations,{' '}
          {countComments(conversations.flatMap(({ comments }) => comments))}{' '}
          comments, {groupQuestions.length} question categories
        </p>
        <Link to="/design-system" className="text-blue-7 underline">
          Design system
        </Link>
        {Object.entries({ events, conversations, groupQuestions }).map(
          ([name, data]) => (
            <details key={name}>
              <summary className="cursor-pointer font-bold">{name}</summary>
              <pre className="overflow-x-auto text-b6">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          )
        )}
      </main>
    );
  },
});
