type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="max-w-5xl mx-auto px-5 sm:px-6">{children}</div>;
};

export default Container;
