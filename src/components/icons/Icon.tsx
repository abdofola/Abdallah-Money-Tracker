type IconProps = {
    href: string,
    [key:string]: any
}

function Icon({ href, ...style }: IconProps) {
  return (
    <svg {...style}>
      <use href={href} />
    </svg>
  );
}

export default Icon;
