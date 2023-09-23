package oauth1

import (
	"context"
	"fmt"

	"github.com/dghubble/oauth1"
	"github.com/dghubble/oauth1/twitter"
	"github.com/yssk22/hpapp/go/system/settings"
)

var (
	TwitterConsumerKey    = settings.NewString("service.auth.extuser.oauth1.twitter_consumer_key", "twitter-consumer-key")
	TwitterConsumerSecret = settings.NewString("service.auth.extuser.oauth1.twitter_consumer_secret", "twitter-consumer-secret")
)

type twitterOAuth1 struct {
}

func NewTwitterOAuth() Provider {
	return &twitterOAuth1{}
}

func (t *twitterOAuth1) GetSlug() string {
	return "twitter"
}

func (p *twitterOAuth1) RequestToken(ctx context.Context, callbackUrl string) (*RequestTokenResponse, error) {
	config, err := p.genConfig(ctx, callbackUrl)
	if err != nil {
		return nil, err
	}
	token, secret, err := config.RequestToken()
	if err != nil {
		return nil, err
	}
	return &RequestTokenResponse{
		OAuthToken:             token,
		OAuthTokenSecret:       secret,
		OAuthCallbackConfirmed: true,
	}, nil
}

func (p *twitterOAuth1) AccessToken(ctx context.Context, oauthToken string, oauthSecret string, verifier string) (*AccessTokenResponse, error) {
	config, err := p.genConfig(ctx, "")
	if err != nil {
		return nil, err
	}
	accessToken, accessTokenSecret, err := config.AccessToken(oauthToken, oauthSecret, verifier)
	if err != nil {
		return nil, err
	}
	return &AccessTokenResponse{
		AccessToken:       accessToken,
		AccessTokenSecret: accessTokenSecret,
	}, nil
}

func (t *twitterOAuth1) genConfig(ctx context.Context, callbackURL string) (*oauth1.Config, error) {
	consumerKey, err := settings.Get(ctx, TwitterConsumerKey)
	if err != nil {
		return nil, fmt.Errorf("cannot fetch TwitterConsumerKey settings: %w", err)
	}
	consumerSecret, err := settings.Get(ctx, TwitterConsumerSecret)
	if err != nil {
		return nil, fmt.Errorf("cannot fetch TwitterConsumerSecret settings: %w", err)
	}
	if consumerKey == TwitterConsumerKey.Default() || consumerSecret == TwitterConsumerSecret.Default() {
		return nil, fmt.Errorf("twitter consumer key and secret have to be configured")
	}
	return &oauth1.Config{
		ConsumerKey:    consumerKey,
		ConsumerSecret: consumerSecret,
		Endpoint:       twitter.AuthorizeEndpoint,
		CallbackURL:    callbackURL,
	}, nil
}
