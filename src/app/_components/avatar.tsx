type Props = {
  name: string;
  picture: string;
  excerpt: string;
};

const Avatar = ({ name, picture, excerpt }: Props) => {
  return (
    <div className="flex items-start sm:items-center gap-3.5">
      <img
        src={picture}
        className="w-10 h-10 rounded-full border border-neutral-200 shrink-0"
        alt={name}
      />
      {excerpt !== "" && (
        <p className="text-base text-neutral-600 leading-relaxed">{excerpt}</p>
      )}
    </div>
  );
};

export default Avatar;
