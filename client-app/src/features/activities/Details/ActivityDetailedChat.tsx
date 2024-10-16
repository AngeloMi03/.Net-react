import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Segment, Header, Comment, Button, Loader } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Link } from "react-router-dom";
import { Field, FieldProps, Form, Formik } from "formik";
import * as Yup from "yup";
import { formatDistanceToNow } from "date-fns";

interface Props {
  activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
  const { commentStore } = useStore();

  useEffect(() => {
    if (activityId) {
      commentStore.createHubConnection(activityId);
    }

    return () => {
      commentStore.clearComments();
    };
  }, [activityId, commentStore]);

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached clearing>
        <Formik
          onSubmit={(values, { resetForm }) =>
            commentStore.addComments(values).then(() => resetForm())
          }
          initialValues={{ body: "" }}
          validationSchema={Yup.object({
            body: Yup.string().required(),
          })}
        >
          {({ isSubmitting, isValid, handleSubmit }) => (
            <Form className="ui form">
              <Field name="body">
                {(props: FieldProps) => (
                  <div style={{ position: "relative" }}>
                    <Loader active={isSubmitting} />
                    <textarea
                      placeholder="enter you comment(Enter to submit, Shift + enter new line)"
                      rows={2}
                      {...props.field}
                      onKeyPress={(e) => {
                        if (e.key == "Enter" && e.shiftKey) {
                          return;
                        }
                        if (e.key == "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          isValid && handleSubmit();
                        }
                      }}
                    />
                  </div>
                )}
              </Field>
            </Form>
          )}
        </Formik>

        <Comment.Group>
          {commentStore.comments.map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.Image || "/assets/user.png"} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profile/${comment.userName}`}>
                  {comment.userName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                </Comment.Metadata>
                <Comment.Text style={{ whiteSpace: "pre-wrap" }}>
                  {comment.body}
                </Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </>
  );
});

/*
   {({isSubmitting, isValid}) => (
             <Form className="ui form">
             <MyTextArea placeholder="add Comments" name="body" rows={2}/>
             <Button
               loading={isSubmitting}
               disabled={isSubmitting || !isValid}
               content="Add Reply"
               labelPosition="left"
               icon="edit"
               primary
               type="submit"
               floated="right"
             />
           </Form>
           )}*/
