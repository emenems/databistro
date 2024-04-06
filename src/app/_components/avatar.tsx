import exp from "constants";

type Props = {
  name: string;
  picture: string;
  excerpt: string;
};

const Avatar = ({ name, picture, excerpt }: Props) => {
  return (
    <div className="flex items-center">
      <img src={picture} className="w-12 h-12 rounded-full mr-4" alt={name} />
      <div className="text-xl font-bold">{name}</div>
      { excerpt != '' && <div className="text-lg font-normal">: {excerpt}</div>}
    </div>
  );
};

export default Avatar;
