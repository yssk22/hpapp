import { renderUserComponent } from '@hpapp/features/testhelper';
import { Text } from 'react-native';

import { useArtist, useArtistList, useMember, useMe, useMemberList } from './';

describe('user', () => {
  test('hooks', async () => {
    function TestComponent() {
      const artist = useArtist('1'); // morningmusume
      const mizuki = useMember('8589934592'); // mizuki_fukumura from OG.
      const risa = useMember('8589934673'); // risa_irie.
      const artists = useArtistList();
      const members = useMemberList();
      return (
        <>
          <Text testID="user.test.useArtist">{artist!.key}</Text>
          <Text testID="user.test.useMember.mizuki">{mizuki!.key}</Text>
          <Text testID="user.test.useMember.risa">{risa!.key}</Text>
          <Text testID="user.test.useArtists">
            {artists
              .map((a) => {
                return a.key;
              })
              .join('\n')}
          </Text>
          <Text testID="user.test.useMembers">
            {members
              .map((m) => {
                return m.key;
              })
              .join('\n')}
          </Text>
        </>
      );
      // return <Text id="test">morningmusume</Text>;
    }
    // // test the useHelloProject function
    const content = await renderUserComponent(<TestComponent />);
    expect(content.getByTestId('user.test.useArtist').props.children).toBe('morningmusume');
    expect(content.getByTestId('user.test.useMember.mizuki').props.children).toBe('mizuki_fukumura');
    expect(content.getByTestId('user.test.useMember.risa').props.children).toBe('risa_irie');
    expect(content).toMatchSnapshot();
  });

  test('should return Me object', async () => {
    function TestComponent() {
      const me = useMe();
      return (
        <>
          <Text testID="user.test.username">{me.username}</Text>
        </>
      );
    }
    const content = await renderUserComponent(<TestComponent />);
    expect(content.getByTestId('user.test.username').props.children).toBe('yssk22');
    expect(content).toMatchSnapshot();
  });
});
