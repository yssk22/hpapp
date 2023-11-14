import { createFeedContext } from '@hpapp/features/feed/context/FeedContext';

const [HomeTabFeedProvider, useHomeTabFeed] = createFeedContext();

export { HomeTabFeedProvider, useHomeTabFeed };
