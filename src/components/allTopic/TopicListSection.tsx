import { useContext, useState } from 'react';
import { LightWeightTopic, Topic } from '../../types/topic';
import TopicWrapper from './TopicWrapper';
import { StoreContext } from '../../store';
import { Droppable } from '../Droppable';
import { useHotkeys } from 'react-hotkeys-hook';
import Filter from './Filter';
import { TopicFilter } from '../../types/home';
import { DreamConEvent } from '../../types/event';
import { usePermission } from '../../hooks/usePermission';

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
    <div className="max-w-[920px] flex flex-col items-center gap-[24px] w-full">
      {!isReadOnly() && (
        <>
          <img
            className="h-[45px]"
            src="/logo/dream-con-logo-white.svg"
            alt="dreamcon-logo"
          />
          <Droppable id="add-topic" data={{ type: 'convert-to-topic' }}>
            {isOver => (
              <button
                onMouseEnter={() => setHoveredAddTopic(true)}
                onMouseLeave={() => setHoveredAddTopic(false)}
                className={`flex items-center gap-[8px] py-[10px] px-[60px] bg-blue6 rounded-[48px] text-white ${
                  isOver
                    ? 'border-blue7 border-[2px]'
                    : 'border-transparent border-[2px]'
                }`}
                onClick={handleAddTopic}
              >
                <img
                  className="w-[24px] h-[24px]"
                  src="/icon/plus.svg"
                  alt="plus-icon"
                />
                <span className="text-b2 wv-bold wv-ibmplex">
                  เพิ่มข้อถกเถียงใหม่
                </span>
              </button>
            )}
          </Droppable>
          <div className="flex flex-col items-center gap-[4px] max-w-[600px] text-center text-blue7 text-b3 wv-ibmplex">
            <img
              className="w-[16px] h-[16px]"
              src="/icon/warning.svg"
              alt="warning-icon"
            />
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
