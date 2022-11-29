const binaryLogo = [
  0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0,
  1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0,
];

const Logo = () => (
  <a
    className="logo"
    href="https://sunflowerseastar.com"
    target="_blank"
    rel="noreferrer"
  >
    {binaryLogo.map((x: number, i: number) => (
      <div key={i} className={x ? "gray" : ""} />
    ))}
  </a>
);

export default Logo;
