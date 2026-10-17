import { parseISO, format } from "date-fns";
import { sk } from "date-fns/locale";

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  const date = parseISO(dateString);
  return (
    <time
      dateTime={dateString}
      className="font-mono text-xs uppercase tracking-wider text-neutral-500 tabular-nums"
    >
      {format(date, "d. MMMM yyyy", { locale: sk })}
    </time>
  );
};

export default DateFormatter;
