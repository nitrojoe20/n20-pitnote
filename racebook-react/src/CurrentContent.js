import Dashboard from './Content/Dashboard';
import Profile from './Content/Profile';
import Settings from './Content/Settings';

export function CurrentContent({ contentId, session }) {
  let content;
  switch (contentId) {
    case 'dashboard':
      content = <Dashboard session={session} />;
      break;
    case 'settings':
      content = <Settings />;
      break;
    case 'profile':
      content = <Profile />;
      break;
    default:
      content = null;
  }

  return (
    <div className="homecontent">
      {content}
    </div>
  );
}
