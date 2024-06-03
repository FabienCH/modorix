export default function Header() {
  return (
    <header className="border-b flex px-4 py-3  bg-white md:px-10">
      <div className="flex flex-auto mx-auto max-w-screen-xl">
        <img src="/icon/48.png" className="w-8 mr-2" />
        <span className="text-2xl lithos-font text-shadow">
          Modori<span className="text-primary">x</span>
        </span>
      </div>
    </header>
  );
}
