import { HPArtist, HPMember } from '@hpapp/features/app/user';
import { logEvent } from '@hpapp/system/firebase';
import { useCallback } from 'react';
import { graphql, useMutation } from 'react-relay';

import {
  useUpsertFollowMutation,
  HPFollowType,
  HPFollowElineupMallParamsInput
} from './__generated__/useUpsertFollowMutation.graphql';

const useUpsertFollowMutationGraphQL = graphql`
  mutation useUpsertFollowMutation($params: HPFollowUpsertParamsInput!) {
    me {
      upsertFollow(params: $params) {
        id
        type
        member {
          id
        }
        elineupmallBlueray
        elineupmallClearFile
        elineupmallCollectionOther
        elineupmallCollectionPinnapPoster
        elineupmallCollectionPhoto
        elineupmallDvd
        elineupmallDvdMagazine
        elineupmallDvdMagazineOther
        elineupmallFsk
        elineupmallKeyringOther
        elineupmallMicrofiberTowel
        elineupmallMufflerTowel
        elineupmallOther
        elineupmallPenlight
        elineupmallPhotoDaily
        elineupmallPhotoA4
        elineupmallPhotoA5
        elineupmallPhoto2l
        elineupmallPhotoOther
        elineupmallPhotoAlbum
        elineupmallPhotoAlbumOther
        elineupmallPhotoBook
        elineupmallPhotoBookOther
        elineupmallTshirt
      }
    }
  }
`;

export type UpsertFollowParams = {
  obj: HPArtist | HPMember;
  followType: HPFollowType;
  elineupMallFollowParams?: HPFollowElineupMallParamsInput[];
};

const useUpsertFollow = (): [(params: UpsertFollowParams) => Promise<string>, boolean] => {
  const [upsertFollow, isUpdating] = useMutation<useUpsertFollowMutation>(useUpsertFollowMutationGraphQL);
  const update = useCallback(
    async ({ obj, followType, elineupMallFollowParams }: UpsertFollowParams): Promise<string> => {
      const p = new Promise((resolve: (id: string) => void, reject: (err: object) => void) => {
        const artistId = obj.type === 'artist' ? parseInt(obj.id, 10) : undefined;
        const memberId = obj.type === 'member' ? parseInt(obj.id, 10) : undefined;
        upsertFollow({
          variables: {
            params: {
              artistId,
              memberId,
              followType,
              elineupMallFollowParams
            }
          },
          onCompleted: (data, err) => {
            if (err) {
              reject(err);
            } else {
              const id = data.me?.upsertFollow?.id;
              resolve(id!);
            }
          },
          onError: (err) => {
            reject(err);
          },
          updater: (store, payload) => {
            const followId = payload?.me?.upsertFollow?.id;
            const artistOrMember = store.get(obj.id) ?? undefined;
            if (followId === undefined || artistOrMember === undefined) {
              return;
            }
            const record = store.get(followId);
            if (record === undefined || record === null) {
              return;
            }
            artistOrMember.setLinkedRecord(record, 'myFollowStatus');
            record.setValue(followType, 'type');
            (elineupMallFollowParams ?? []).forEach((param) => {
              switch (param.category) {
                case 'blueray':
                  record.setValue('elineupmallBlueray', param.followType);
                  break;
                case 'clear_file':
                  record.setValue('elineupmallClearFile', param.followType);
                  break;
                case 'colllection_other':
                  record.setValue('elineupmallCollectionOther', param.followType);
                  break;
                case 'colllection_photo':
                  record.setValue('elineupmallCollectionPhoto', param.followType);
                  break;
                case 'colllection_pinnap_poster':
                  record.setValue('elineupmallCollectionPinnapPoster', param.followType);
                  break;
                case 'dvd':
                  record.setValue('elineupmallDvd', param.followType);
                  break;
                case 'dvd_magazine':
                  record.setValue('elineupmallDvdMagazine', param.followType);
                  break;
                case 'dvd_magazine_other':
                  record.setValue('elineupmallDvdMagazineOther', param.followType);
                  break;
                case 'fsk':
                  record.setValue('elineupmallFsk', param.followType);
                  break;
                case 'keyring_other':
                  record.setValue('elineupmallKeyringOther', param.followType);
                  break;
                case 'microfiber_towel':
                  record.setValue('elineupmallMicrofiberTowel', param.followType);
                  break;
                case 'muffler_towel':
                  record.setValue('elineupmallMufflerTowel', param.followType);
                  break;
                case 'other':
                  record.setValue('elineupmallOther', param.followType);
                  break;
                case 'penlight':
                  record.setValue('elineupmallPenlight', param.followType);
                  break;
                case 'photo2_l':
                  record.setValue('elineupmallPhoto2L', param.followType);
                  break;
                case 'photo_a4':
                  record.setValue('elineupmallPhotoA4', param.followType);
                  break;
                case 'photo_a5':
                  record.setValue('elineupmallPhotoA5', param.followType);
                  break;
                case 'photo_album':
                  record.setValue('elineupmallPhotoAlbum', param.followType);
                  break;
                case 'photo_album_other':
                  record.setValue('elineupmallPhotoAlbumOther', param.followType);
                  break;
                case 'photo_book':
                  record.setValue('elineupmallPhotoBook', param.followType);
                  break;
                case 'photo_book_other':
                  record.setValue('elineupmallPhotoBookOther', param.followType);
                  break;
                case 'photo_daily':
                  record.setValue('elineupmallPhotoDaily', param.followType);
                  break;
                case 'photo_other':
                  record.setValue('elineupmallPhotoOther', param.followType);
                  break;
                case 't_shirt':
                  record.setValue('elineupmallTShirt', param.followType);
                  break;
              }
              if (elineupMallFollowParams) {
                logEvent('artist_follow_member', {
                  feature: 'artist',
                  artistId,
                  memberId,
                  followType
                });
              } else {
                logEvent('elineupmall_follow_member_and_category', {
                  feature: 'elineupmall',
                  artistId,
                  memberId,
                  elineupMallFollowParams
                });
              }
            });
          }
        });
      });
      return p;
    },
    [upsertFollow]
  );
  return [update, isUpdating];
};

export default useUpsertFollow;
