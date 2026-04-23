function Nav() {
  return (
    <nav className="w-full b-sm">
      <ul className="w-full inline-block m-0 text-sm p-4 bg-gray-100">
        <li className="inline-block mx-4">
          <a href="/">Home</a>
        </li>
        <li className="inline-block">
          <a href="/destinations">Destinations</a>
        </li>
        <li className="inline-block mx-4">
          <a href="/destinations/new">Add Destination</a>
        </li>
      </ul>
    </nav>
  );
}
function Footer() {
  let now = new Date();
  return (
    <footer>
      <p>Copyright {now.getFullYear()} My Company. All rights reserved.</p>
    </footer>
  );
}

export { Footer, Nav };