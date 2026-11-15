import Seo from "../components/common/Seo";
import { seoNoindex } from "../lib/seo";

const Profile = () => {
  return (
    <section>
      <Seo seo={seoNoindex("Profile")} />
      <h1 className="text-2xl font-bold">Profile</h1>
    </section>
  );
};

export default Profile;
