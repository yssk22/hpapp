import { renderUserComponent } from '@hpapp/features/app/testhelper';

import ArtistMemberFollowIcon from './internals/ArtistMemberFollowIcon';
import ArtistMemberIcon from './internals/ArtistMemberIcon';

describe('artist', () => {
  describe('ArtistMemberFollowIcon', () => {
    test('following', async () => {
      const content = await renderUserComponent(<ArtistMemberFollowIcon member="8589934592" />);
      const icon = content.queryByTestId('ArtistMemberFollowIcon');
      expect(icon).toBeTruthy();
      expect(content).toMatchSnapshot();
    });

    test('not following', async () => {
      const content = await renderUserComponent(<ArtistMemberFollowIcon member="8589934593" />);
      const icon = content.queryByTestId('ArtistMemberFollowIcon');
      expect(icon).toBeFalsy();
      expect(content).toMatchSnapshot();
    });
  });

  describe('ArtistMemberIcon', () => {
    test('icon', async () => {
      const content = await renderUserComponent(<ArtistMemberIcon member="8589934592" />);
      const icon = content.queryByTestId('ArtistMemberIcon');
      expect(icon).toBeTruthy();
      expect(content).toMatchSnapshot();
    });
  });
});