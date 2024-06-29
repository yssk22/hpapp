import { createFeedContext } from '@hpapp/features/feed/context/FeedContext';

const [FeedHomeTabProvider, useHomeTabFeed] = createFeedContext();

export default FeedHomeTabProvider;
export { useHomeTabFeed };
