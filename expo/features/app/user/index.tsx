import HelloProject, { HPArtist, HPMember } from './internals/HelloProject';
import Me, { HPFollow, HPFollowType } from './internals/Me';
import UserRoot, { UserRootProps } from './internals/UserRoot';
import { useUserServiceContext } from './internals/UserServiceProvider';

export { HelloProject, HPArtist, HPMember, HPFollow, HPFollowType, Me, UserRoot, UserRootProps };

export function useHelloProject() {
  return useUserServiceContext().hp!;
}

export function useMe() {
  return useUserServiceContext().me!;
}
