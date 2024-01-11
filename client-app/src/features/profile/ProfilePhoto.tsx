import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import { Photo, Profile } from "../../app/models/Profile";
import { useStore } from "../../app/stores/store";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface Props {
  profile: Profile;
}

export default observer(function ProfilePhotos({ profile }: Props) {
  const {
    profilestore: { IsCurrentUser, uploadPhoto, uploading, setMainPhoto, loading, deletePhoto },
  } = useStore();
  const [addPhotoMode, setAddPhotoMode] = useState(false);
  const [target, setTarget] = useState("");

function HandlePhotoUpload(file : Blob){
   uploadPhoto(file).then(() => setAddPhotoMode(false));
}

function HandleSetMain(photo : Photo, e : SyntheticEvent<HTMLButtonElement>){
   setTarget(e.currentTarget.name)
   setMainPhoto(photo);
}

function HandleDeletePhoto(photo : Photo,  e : SyntheticEvent<HTMLButtonElement> ){
  setTarget(e.currentTarget.name)
  deletePhoto(photo)
}


  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated="left" icon="image" content="Photos" />
          {IsCurrentUser && (
            <Button
              floated="right"
              basic
              content={addPhotoMode ? "Cancel" : "Add Photo"}
              onClick={() => setAddPhotoMode(!addPhotoMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget uploadPhoto={HandlePhotoUpload} loading={uploading} />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile.photos?.map((photo) => (
                <Card key={photo.id}>
                  <Image src={photo.url} />
                  {IsCurrentUser &&
                   <Button.Group fluid widths={2}>
                     <Button 
                     basic
                     color="green"
                     content="Main"
                     name={"main" + photo.id}
                     loading={target == "main"+ photo.id && loading}
                     onClick={e => HandleSetMain(photo, e)}
                     disabled={photo.isMain}
                     />
                      <Button 
                     basic
                     color="red"
                     name={photo.id}
                     loading={target == photo.id && loading}
                     onClick={e => HandleDeletePhoto(photo, e)}
                     disabled={photo.isMain}
                     />
                   </Button.Group>
                  }
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
});
