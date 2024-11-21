import HelloProject, { HPArtist, HPMember, HPFollowType } from './internals/HelloProject';
import Me from './internals/Me';
import UserRoot, { UserRootProps } from './internals/UserRoot';
import UserServiceProvider, { useUserServiceContext } from './internals/UserServiceProvider';

export { HelloProject, HPArtist, HPMember, HPFollowType, Me, UserRoot, UserServiceProvider, UserRootProps };

export function useHelloProject() {
  return useUserServiceContext().hp!;
}

export function useMe() {
  return useUserServiceContext().me!;
}
