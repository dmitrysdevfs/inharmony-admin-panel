import { UserProfile } from '../components';

export default function UserProfilePage({ params }) {
  return <UserProfile userId={params.id} />;
}
