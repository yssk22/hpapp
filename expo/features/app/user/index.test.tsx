import { renderUserComponent } from '@hpapp/features/app/testhelper';
import { Text } from 'react-native';

import { useHelloProject, useMe } from './';

describe('user', () => {
  test('useHelloProject', async () => {
    function TestComponent() {
      const hp = useHelloProject();
      const artist = hp.useArtist('1'); // morningmusume
      const member = hp.useMember('8589934592'); // mizuki_fukumura
      const artists = hp.useArtists();
      const members = hp.useMembers();
      return (
        <>
          <Text testID="user.test.useArtist">{artist!.key}</Text>
          <Text testID="user.test.useMember">{member!.key}</Text>
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
    expect(content.getByTestId('user.test.useMember').props.children).toBe('mizuki_fukumura');
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
