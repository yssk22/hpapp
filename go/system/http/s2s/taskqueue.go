package s2s

import (
	"fmt"
	"strings"

	"context"

	cloudtasks "cloud.google.com/go/cloudtasks/apiv2"
	taskspb "cloud.google.com/go/cloudtasks/apiv2/cloudtaskspb"
)

// NewTaskQueueClient returns a Client implementation that utilize Cloud Task (https://cloud.google.com/tasks)
// This task queue client would make an http request under Cloud Task to dispatch http tasks.
func NewTaskQueueClient(baseUrl string, projectID, locationID, queueID, email, audience string) Client {
	return &taskqueueClient{
		baseUrl:    baseUrl,
		projectID:  projectID,
		locationID: locationID,
		queueID:    queueID,
		email:      email,
		audience:   audience,
	}
}

type taskqueueClient struct {
	baseUrl    string
	projectID  string
	locationID string
	queueID    string
	email      string
	audience   string
}

func (c *taskqueueClient) Request(ctx context.Context, path string, payload []byte, options map[string]string) error {
	client, err := cloudtasks.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("cloudtasks.NewClient: %v", err)
	}
	defer client.Close()
	projectId := c.projectID
	locationId := c.locationID
	queueId := c.queueID
	email := c.email
	audience := c.audience
	if options != nil {
		if s, ok := options["project_id"]; ok {
			projectId = s
		}
		if s, ok := options["location_id"]; ok {
			locationId = s
		}
		if s, ok := options["queue_id"]; ok {
			queueId = s
		}
		if s, ok := options["service_account_email"]; ok {
			email = s
		}
		if s, ok := options["audience"]; ok {
			audience = s
		}
	}
	httpHeader := getHttpHeaderFromOptions(options)
	headers := make(map[string]string)
	for k, v := range httpHeader {
		headers[k] = strings.Join(v, ",")
	}
	queuePath := fmt.Sprintf("projects/%s/locations/%s/queues/%s", projectId, locationId, queueId)
	url := fmt.Sprintf("%s%s", c.baseUrl, path)
	req := &taskspb.CreateTaskRequest{
		Parent: queuePath,
		Task: &taskspb.Task{
			MessageType: &taskspb.Task_HttpRequest{
				HttpRequest: &taskspb.HttpRequest{
					HttpMethod: taskspb.HttpMethod_POST,
					Url:        url,
					Headers:    headers,
					AuthorizationHeader: &taskspb.HttpRequest_OidcToken{
						OidcToken: &taskspb.OidcToken{
							ServiceAccountEmail: email,
							Audience:            audience,
						},
					},
				},
			},
		},
	}
	req.Task.GetHttpRequest().Body = []byte(payload)
	_, err = client.CreateTask(ctx, req)
	if err != nil {
		return fmt.Errorf("failed to create task (queue=%s, url=%s): %v", queuePath, url, err)
	}
	return nil
}
