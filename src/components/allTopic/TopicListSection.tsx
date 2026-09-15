import { useContext, useState } from 'react';
import AddIcon from '@material-symbols/svg-700/rounded/add.svg?react';
import WarningIcon from '@material-symbols/svg-700/rounded/warning.svg?react';
import { useHotkeys } from 'react-hotkeys-hook';
import { usePermission } from '../../hooks/usePermission';
import { StoreContext } from '../../store';
import { DreamConEvent } from '../../types/event';
import { TopicFilter } from '../../types/home';
import { LightWeightTopic, Topic } from '../../types/topic';
import { Droppable } from '../topic/Droppable';
import Filter from './Filter';
import TopicWrapper from './TopicWrapper';

interface PropTypes {
  topics: Topic[];
  lightWeightTopics: LightWeightTopic[];
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic) => void;
  events: DreamConEvent[];
  topicFilter: TopicFilter;
  setTopicFilter: (filter: TopicFilter) => void;
}

export default function TopicListSection(props: PropTypes) {
  const { homePage: homePageContext, clipboard: clipboardContext } =
    useContext(StoreContext);
  const [hoveredAddTopic, setHoveredAddTopic] = useState(false);
  const { isReadOnly } = usePermission();

  const handleAddTopic = () => {
    homePageContext.modalTopicMainSection.dispatch({
      type: 'OPEN_MODAL',
      payload: {
        mode: 'create',
      },
    });
  };

  useHotkeys('Meta+v, ctrl+v', () => {
    if (hoveredAddTopic) {
      clipboardContext.emitMoveComment({
        type: 'convert-to-topic',
      });
    }
  });

  const allTopicCount = () => {
    return props.lightWeightTopics.length;
  };
  return (
    <div className="flex w-full max-w-230 flex-col items-center gap-6">
      {!isReadOnly() && (
        <>
          <img
            className="h-11.25"
            src="/logo/dream-con-logo-white.svg"
            alt="dreamcon-logo"
          />
          <Droppable id="add-topic" data={{ type: 'convert-to-topic' }}>
            {isOver => (
              <button
                onMouseEnter={() => setHoveredAddTopic(true)}
                onMouseLeave={() => setHoveredAddTopic(false)}
                className={`flex items-center gap-2 rounded-full bg-blue-6 px-15 py-2.5 text-white ${
                  isOver
                    ? 'border-2 border-blue-7'
                    : 'border-2 border-transparent'
                }`}
                onClick={handleAddTopic}
              >
                <AddIcon className="h-6 w-6 text-white" aria-hidden />
                <span className="wv-bold wv-ibmplex text-b2">
                  เพิ่มข้อถกเถียงใหม่
                </span>
              </button>
            )}
          </Droppable>
          <div className="wv-ibmplex flex flex-col items-center gap-1 text-center text-b3 text-blue-7">
            <WarningIcon className="h-4 w-4" aria-hidden />
            <p>
              ก่อนเพิ่มข้อถกเถียงใหม่ ควรตรวจสอบข้อถกเถียงที่มีอยู่ก่อน
              หากพบประเด็นเดียวกัน ให้เพิ่มวงสนทนาของคุณในข้อถกเถียงนั้น หรือ
              เพิ่มความคิดเห็นต่อยอด
            </p>
          </div>
        </>
      )}
      <Filter
        lightWeightTopics={props.lightWeightTopics}
        events={props.events}
        filter={props.topicFilter}
        setFilter={props.setTopicFilter}
        allTopicCount={allTopicCount()}
      />
      <TopicWrapper
        topics={props.topics}
        selectedTopic={props.selectedTopic}
        setSelectedTopic={props.setSelectedTopic}
      />
    </div>
  );
}
