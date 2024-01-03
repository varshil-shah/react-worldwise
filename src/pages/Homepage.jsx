import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";

function Homepage() {
  return (
    <div>
      <PageNav />
      <h2>Homepage</h2>

      <Link to="/app">Go to App</Link>
    </div>
  );
}

export default Homepage;
