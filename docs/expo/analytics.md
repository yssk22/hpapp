# Analytics

hpapp analytics is built on top of firebase analytics. `logEvent("{event_name}", {params})` is a syntax to fire an event.

## What Do We Track?

### Onboarding

#### Analytics

**Questions to answer**: Where do users drop off? What is the conversion rate?

- [Onboarding Funnel](https://analytics.google.com/analytics/web/#/analysis/p239063860/edit/DsziloFpTCOSm4YY2sL8zA) - open the app first time > accept tos > privacy policy > login > complete_onboarding

#### Events

- `accept_tos`: a user accept the ToS.
- `accept_privacy_policy`: a user accept the privacy policy.
- `login_completed`:a user completed the login process.
- `login_failed`:a user failed the login process.

#### Engagement Type

**Questions to answer**: Which features are most popluer in the app?

#### Events

all events are prefixed with `{feature_name}_{verb}` and should have `feature` parameter.

- `feed_view_item`: a user view a feed item.
- `artist_view_member`: a user view an artist member profile.
- `artist_follow_member`: a user follow the member.
- `sort_complete`: a user complete the sort.
- `upfc_authenticate`: a user authenticated with UPFC.
- `upfc_open_webview`: a user open the upfc WebView.
- `elineupmall_authenticate`: a user authenticated with Elineupmall.
- `elineupmall_follow_member_and_category`: a user authenticated with Elineupmall.
- `elineupmall_add_item_to_cart`: a user add an item to the cart.
- `elineupmall_open_webview`: a user open the upfc WebView.

### Other

#### Events

- `home_tab_view`: a user view a specific tab in the home screen.
