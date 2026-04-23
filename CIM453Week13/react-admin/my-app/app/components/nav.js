function Nav() {
  return (
    <nav className="w-full">
      <ul className="w-full inline-block m-0 text-sm p-4 bg-black">
        <li className="inline-block mx-4">
          <a href="/" className="text-white hover:text-gray-300">Travel Site Admin</a>
        </li>
        <li className="inline-block mx-4">
          <a href="/destinations" className="text-white hover:text-gray-300">Destinations</a>
        </li>
        <li className="inline-block mx-4">
          <a href="/destinations/new" className="text-white hover:text-gray-300">Add Destination</a>
        </li>
      </ul>
    </nav>
  );
}
function Footer() {
  let now = new Date();
  return (
    <footer className="w-full bg-black text-white text-sm p-4 text-center">
      <p>Copyright {now.getFullYear()} My Company. All rights reserved.</p>
    </footer>
  );
}

export { Footer, Nav };