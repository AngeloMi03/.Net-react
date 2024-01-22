import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";

export default observer(function ProfilePage() {
  const { userName } = useParams<{ userName: string }>();
  const { profilestore } = useStore();
  const { loadProfile, loadingProfile, profile, SetActiveTab } = profilestore;

  useEffect(() => {
    if (userName) {
      loadProfile(userName);

      return () => {
        SetActiveTab(0);
      }
    }
  }, [userName, loadProfile]);

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && (
          <>
            <ProfileHeader profile={profile} />
            <ProfileContent profile={profile} />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
});
